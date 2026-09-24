<?php

namespace App\Http\Controllers\Api;

use App\Actions\Attendance\RecordBiometricAttendance;
use App\Enums\DeviceCommandStatus;
use App\Http\Controllers\Controller;
use App\Models\BiometricDevice;
use App\Models\EmployeeFingerprint;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;

/**
 * Implements the ZKTeco ADMS (PUSH SDK) protocol.
 *
 * Device configuration:
 *   Server Address: your-server.com
 *   Server Port:    80 (or 443 for HTTPS)
 *   URL:            /api/iclock
 *
 * Protocol flow:
 *   1. Device sends GET  /api/iclock/cdata?SN=SERIAL     → server replies with options
 *   2. Device sends POST /api/iclock/cdata?SN=SERIAL&table=ATTLOG → attendance data
 *   3. Device polls  GET  /api/iclock/getrequest?SN=SERIAL → server sends queued commands
 *   4. Device sends POST /api/iclock/devicecmd?SN=SERIAL  → command execution result
 */
class ZKTecoController extends Controller
{
    /**
     * Step 1 — Device handshake / initialization.
     * GET /api/iclock/cdata?SN=SERIAL&options=all
     */
    public function init(Request $request): Response
    {
        $serial = $request->query('SN');

        Log::info('ZKTeco INIT', [
            'ip' => $request->ip(),
            'sn' => $serial,
        ]);

        if (! $serial) {
            return response('Error: Missing SN', 400);
        }

        $device = BiometricDevice::where('serial_number', $serial)->first();

        if (! $device) {
            $device = BiometricDevice::create([
                'serial_number' => $serial,
                'name' => 'New Device ('.$serial.')',
                'last_heartbeat_at' => now(),
            ]);
            Log::info("ZKTeco: Auto-registered device SN={$serial}.");
        } else {
            $device->update(['last_heartbeat_at' => now()]);
        }

        $stamp = $device->last_attlog_stamp ?? 0;

        return response(
            "GET OPTION FROM:{$serial}\nATTLOGStamp={$stamp}\nOPERLOGStamp=9999\nATTPHOTOStamp=None\nErrorDelay=30\nDelay=10\nTransTimes=00:00;14:05\nTransInterval=1\nTransFlag=TransData AttLog\nTimeZone=5\nRealtime=1\nEncrypt=None\n",
            200,
            ['Content-Type' => 'text/plain']
        );
    }

    /**
     * Step 2 — Device pushes attendance logs.
     * POST /api/iclock/cdata?SN=SERIAL&table=ATTLOG&Stamp=TIMESTAMP
     *
     * Body format (tab-separated, one record per line):
     *   PIN\tDateTime\tStatus\tVerify\tWorkCode\tReserved
     */
    public function push(Request $request, RecordBiometricAttendance $action): Response
    {
        $serial = $request->query('SN');
        $table = $request->query('table');

        if (! $serial || $table !== 'ATTLOG') {
            return response('OK', 200, ['Content-Type' => 'text/plain']);
        }

        $device = BiometricDevice::where('serial_number', $serial)->first();

        if (! $device || ! $device->is_active) {
            Log::warning("ZKTeco: Push from inactive/unknown device SN={$serial}. Skipping.");

            return response('OK', 200, ['Content-Type' => 'text/plain']);
        }

        $device->update(['last_heartbeat_at' => now()]);

        $body = $request->getContent();
        $lines = array_filter(explode("\n", trim($body)));
        $recorded = 0;
        $newStamp = (int) $request->query('Stamp', $device->last_attlog_stamp ?? 0);

        foreach ($lines as $line) {
            $parts = explode("\t", trim($line));

            if (count($parts) < 2) {
                continue;
            }

            [$pin, $datetime] = $parts;
            $pin = trim($pin);
            $datetime = trim($datetime);

            $fingerprint = EmployeeFingerprint::where('device_user_id', $pin)->first();

            if (! $fingerprint) {
                Log::debug("ZKTeco: No employee mapped to PIN={$pin} on SN={$serial}.");

                continue;
            }

            $parsedDateTime = Carbon::parse($datetime);
            $date = $parsedDateTime->toDateString();
            $time = $parsedDateTime->format('H:i:s');

            $action->execute($fingerprint->employee_id, $date, $time);
            $recorded++;
        }

        if ($newStamp > ($device->last_attlog_stamp ?? 0)) {
            $device->update(['last_attlog_stamp' => $newStamp]);
        }

        Log::info("ZKTeco: SN={$serial} pushed {$recorded} attendance record(s).");

        return response('OK', 200, ['Content-Type' => 'text/plain']);
    }

    /**
     * Step 3 — Device polls for queued commands.
     * GET /api/iclock/getrequest?SN=SERIAL
     */
    public function getRequest(Request $request): Response
    {
        $serial = $request->query('SN');

        if (! $serial) {
            return response('OK', 200, ['Content-Type' => 'text/plain']);
        }

        $device = BiometricDevice::where('serial_number', $serial)->first();

        if (! $device) {
            return response('OK', 200, ['Content-Type' => 'text/plain']);
        }

        $device->update(['last_heartbeat_at' => now()]);

        $pending = $device->commands()
            ->pending()
            ->orderBy('sequence')
            ->first();

        if ($pending) {
            $pending->update([
                'status' => DeviceCommandStatus::Sent,
                'sent_at' => now(),
            ]);

            return response(
                "C:{$pending->sequence}:{$pending->command}\n",
                200,
                ['Content-Type' => 'text/plain']
            );
        }

        return response('OK', 200, ['Content-Type' => 'text/plain']);
    }

    /**
     * Step 4 — Device reports command execution result.
     * POST /api/iclock/devicecmd?SN=SERIAL
     *
     * Body: ID={sequence}&Return=0
     */
    public function deviceCmd(Request $request): Response
    {
        $serial = $request->query('SN');
        $body = $request->getContent();

        Log::info('ZKTeco DEVICECMD', [
            'sn' => $serial,
            'body' => $body,
        ]);

        if ($serial && preg_match('/ID=(\d+)/i', $body, $m)) {
            $sequence = (int) $m[1];
            $returnCode = 0;

            if (preg_match('/Return=(\d+)/i', $body, $r)) {
                $returnCode = (int) $r[1];
            }

            $device = BiometricDevice::where('serial_number', $serial)->first();

            if ($device) {
                $device->update(['last_heartbeat_at' => now()]);

                if ($returnCode === 0) {
                    $device->commands()
                        ->where('sequence', $sequence)
                        ->where('status', DeviceCommandStatus::Sent)
                        ->update([
                            'status' => DeviceCommandStatus::Acknowledged,
                            'acknowledged_at' => now(),
                        ]);
                } else {
                    Log::warning("ZKTeco: Command seq={$sequence} failed on SN={$serial} with Return={$returnCode}.");
                }
            }
        }

        return response('OK', 200, ['Content-Type' => 'text/plain']);
    }
}
