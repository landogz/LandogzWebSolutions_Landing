import { adminSecondaryBtn, adminPrimaryBtn } from '@/components/admin/adminTheme';

export default function AdminCrudToolbar({ onReload, onCreate, createLabel = 'Create' }) {
    return (
        <div className="mb-6 flex flex-wrap items-center gap-2">
            <button type="button" className={adminSecondaryBtn} onClick={onReload}>
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400/80" aria-hidden />
                Reload data
            </button>
            {onCreate ? (
                <button type="button" className={adminPrimaryBtn} onClick={onCreate}>
                    + {createLabel}
                </button>
            ) : null}
        </div>
    );
}
