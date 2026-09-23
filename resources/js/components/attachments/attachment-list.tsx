import { router } from '@inertiajs/react';
import { Download, FileIcon, Trash2, Upload } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import type { Attachment } from '@/types';
import { destroy, store } from '@/actions/App/Http/Controllers/AttachmentController';
import { download } from '@/actions/App/Http/Controllers/AttachmentController';

type AttachmentListProps = {
    attachments: Attachment[];
    attachableType: string;
    attachableId: number;
    canUpload?: boolean;
    canDelete?: boolean;
};

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AttachmentList({
    attachments,
    attachableType,
    attachableId,
    canUpload = false,
    canDelete = false,
}: AttachmentListProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        router.post(
            store().url,
            {
                file,
                attachable_type: attachableType,
                attachable_id: attachableId,
            } as Record<string, unknown>,
            {
                forceFormData: true,
                preserveScroll: true,
            },
        );

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    function handleDelete(attachment: Attachment) {
        router.delete(destroy({ attachment: attachment.id }).url, {
            preserveScroll: true,
        });
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Attachments</span>
                {canUpload && (
                    <>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                            onChange={handleUpload}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="mr-1 h-3 w-3" />
                            Add File
                        </Button>
                    </>
                )}
            </div>

            {attachments.length === 0 && (
                <p className="text-muted-foreground text-sm">
                    No attachments yet.
                </p>
            )}

            {attachments.length > 0 && (
                <ul className="divide-y rounded-md border">
                    {attachments.map((attachment) => (
                        <li
                            key={attachment.id}
                            className="flex items-center justify-between px-3 py-2 text-sm"
                        >
                            <div className="flex min-w-0 items-center gap-2">
                                <FileIcon className="text-muted-foreground h-4 w-4 shrink-0" />
                                <span className="truncate">
                                    {attachment.file_name}
                                </span>
                                <span className="text-muted-foreground shrink-0 text-xs">
                                    {formatFileSize(attachment.file_size)}
                                </span>
                            </div>
                            <div className="flex shrink-0 items-center gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                >
                                    <a
                                        href={
                                            download({
                                                attachment: attachment.id,
                                            }).url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Download className="h-3 w-3" />
                                    </a>
                                </Button>
                                {canDelete && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            handleDelete(attachment)
                                        }
                                    >
                                        <Trash2 className="h-3 w-3 text-red-500" />
                                    </Button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
