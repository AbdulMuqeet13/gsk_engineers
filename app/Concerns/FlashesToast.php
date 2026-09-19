<?php

namespace App\Concerns;

trait FlashesToast
{
    protected function flashSuccess(string $message): void
    {
        session()->flash('toast', ['type' => 'success', 'message' => $message]);
    }

    protected function flashError(string $message): void
    {
        session()->flash('toast', ['type' => 'error', 'message' => $message]);
    }

    protected function flashInfo(string $message): void
    {
        session()->flash('toast', ['type' => 'info', 'message' => $message]);
    }

    protected function flashWarning(string $message): void
    {
        session()->flash('toast', ['type' => 'warning', 'message' => $message]);
    }
}
