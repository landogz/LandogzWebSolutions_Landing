import { useEffect, useMemo, useState } from 'react';
import { adminFileInput, adminLabel, adminSecondaryBtn } from '@/components/admin/adminTheme';

export default function AdminImageField({
    label = 'Image',
    currentUrl,
    file,
    onFileChange,
    accept = 'image/*',
    hint = 'PNG, JPG, WEBP · max ~2MB recommended',
}) {
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return undefined;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const shown = preview || currentUrl || null;
    const fileName = useMemo(() => file?.name || null, [file]);

    return (
        <div>
            <span className={adminLabel}>{label}</span>
            {shown ? (
                <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-slate-950/40">
                    <img src={shown} alt="" className="max-h-40 w-full object-contain object-center p-2" />
                </div>
            ) : (
                <div className="mt-2 flex h-28 items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-xs text-slate-500">
                    No image
                </div>
            )}
            <input
                type="file"
                accept={accept}
                className={adminFileInput}
                onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            />
            <div className="mt-2 flex flex-wrap items-center gap-3">
                {fileName ? <p className="text-xs text-slate-400 truncate max-w-[14rem]">{fileName}</p> : null}
                {file ? (
                    <button type="button" className={`${adminSecondaryBtn} !min-h-[36px] !px-3 !py-1.5 text-xs`} onClick={() => onFileChange(null)}>
                        Clear selection
                    </button>
                ) : null}
            </div>
            {hint ? <p className="mt-1.5 text-[11px] text-slate-500">{hint}</p> : null}
        </div>
    );
}
