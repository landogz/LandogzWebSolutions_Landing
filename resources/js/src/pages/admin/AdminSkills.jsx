import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminDataTable from '@/components/admin/AdminDataTable';
import AdminPagination from '@/components/admin/AdminPagination';
import AdminImageField from '@/components/admin/AdminImageField';
import {
    adminInput,
    adminLabel,
    adminPrimaryBtn,
    adminSecondaryBtn,
    adminTextLink,
    adminTextLinkDanger,
} from '@/components/admin/adminTheme';
import { toastApiError } from '@/utils/toastApiError';

const empty = { name: '', category: '', proficiency: 80, sort_order: 0 };

function buildSkillFormData(form, iconFile) {
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('category', form.category);
    if (form.proficiency != null && form.proficiency !== '') {
        fd.append('proficiency', String(form.proficiency));
    }
    if (form.sort_order != null && form.sort_order !== '') {
        fd.append('sort_order', String(form.sort_order));
    }
    if (iconFile) {
        fd.append('icon', iconFile);
    }
    return fd;
}

function buildSkillJsonBody(form) {
    return {
        name: form.name,
        category: form.category,
        proficiency: Number(form.proficiency) || 0,
        sort_order: Number(form.sort_order) || 0,
    };
}

export default function AdminSkills() {
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [iconFile, setIconFile] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    function load() {
        setLoading(true);
        setLoadError(false);
        api
            .get('/admin/skills', { params: { page, per_page: 20 } })
            .then((r) => {
                const d = unwrap(r);
                setRows(d.items || []);
                setMeta(d.pagination || {});
            })
            .catch(() => {
                setLoadError(true);
                toast.error('Failed to load');
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
    }, [page]);

    function openCreate() {
        setEditing(null);
        setForm(empty);
        setIconFile(null);
        setModal(true);
    }

    function openEdit(s) {
        setEditing(s);
        setForm({
            name: s.name || '',
            category: s.category || '',
            proficiency: s.proficiency ?? 80,
            sort_order: s.sort_order ?? 0,
        });
        setIconFile(null);
        setModal(true);
    }

    async function save(e) {
        e.preventDefault();
        try {
            if (editing) {
                if (iconFile) {
                    unwrap(await api.post(`/admin/skills/${editing.id}`, buildSkillFormData(form, iconFile)));
                } else {
                    unwrap(await api.post(`/admin/skills/${editing.id}`, buildSkillJsonBody(form)));
                }
                toast.success('Skill updated');
            } else if (iconFile) {
                unwrap(await api.post('/admin/skills', buildSkillFormData(form, iconFile)));
                toast.success('Skill created');
            } else {
                unwrap(await api.post('/admin/skills', buildSkillJsonBody(form)));
                toast.success('Skill created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/skills/${id}`));
            toast.success('Deleted');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        }
    }

    return (
        <div>
            <AdminPageHeader title="Skills" description="Capability rows for the landing skills section — optional icon upload per item." />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <AdminDataTable
                loading={loading}
                error={loadError}
                onRetry={load}
                rows={rows}
                emptyTitle="No skills yet"
                emptyDescription="Add capabilities to show in the skills section."
                emptyActionLabel="Add skill"
                onEmptyAction={openCreate}
                columns={[
                    {
                        key: 'name',
                        label: 'Name',
                        render: (r) => <span className="font-medium text-slate-200">{r.name}</span>,
                    },
                    { key: 'category', label: 'Category' },
                    {
                        key: 'proficiency',
                        label: '%',
                        render: (r) => <span className="tabular-nums">{r.proficiency}</span>,
                    },
                ]}
                actions={(r) => (
                    <>
                        <button type="button" className={`${adminTextLink} mr-1`} onClick={() => openEdit(r)}>
                            Edit
                        </button>
                        <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(r.id)}>
                            Delete
                        </button>
                    </>
                )}
            />
            <AdminPagination meta={meta} page={page} onPageChange={setPage} />

            {modal ? (
                <AdminModal title={editing ? 'Edit skill' : 'Create skill'} onClose={() => setModal(false)} wide>
                    <form onSubmit={save} className="space-y-4">
                        <label className="block">
                            <span className={adminLabel}>Name</span>
                            <input className={adminInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Category</span>
                            <input className={adminInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Proficiency (0–100)</span>
                            <input
                                className={adminInput}
                                type="number"
                                min={0}
                                max={100}
                                value={form.proficiency}
                                onChange={(e) => setForm({ ...form, proficiency: Number(e.target.value) })}
                            />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Sort order</span>
                            <input
                                className={adminInput}
                                type="number"
                                min={0}
                                value={form.sort_order}
                                onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) || 0 })}
                            />
                        </label>
                        <AdminImageField
                            label={editing ? 'Icon (optional new file)' : 'Icon (optional)'}
                            currentUrl={editing?.icon_url}
                            file={iconFile}
                            onFileChange={setIconFile}
                        />
                        <div className="flex flex-wrap gap-3 pt-2">
                            <button type="submit" className={adminPrimaryBtn}>
                                Save
                            </button>
                            <button type="button" className={adminSecondaryBtn} onClick={() => setModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </AdminModal>
            ) : null}

            {deleteId ? (
                <AdminConfirmDialog title="Delete skill?" onConfirm={() => remove(deleteId)} onCancel={() => setDeleteId(null)} danger />
            ) : null}
        </div>
    );
}
