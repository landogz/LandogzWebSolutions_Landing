import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import {
    adminInput,
    adminLabel,
    adminPrimaryBtn,
    adminSecondaryBtn,
    adminSelect,
    adminTextarea,
    adminFileInput,
    adminTableShell,
    adminTableHead,
    adminTh,
    adminTd,
    adminBadge,
    adminPaginationBtn,
    adminTextLink,
    adminTextLinkDanger,
} from '@/components/admin/adminTheme';
import { toastApiError } from '@/utils/toastApiError';

const empty = {
    project_category_id: '',
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    status: 'draft',
    is_featured: false,
    client_name: '',
    project_url: '',
    github_url: '',
    duration: '',
    tech_stack: '',
};

function buildProjectFormData(form, thumbnailFile, galleryFiles) {
    const fd = new FormData();
    if (form.project_category_id) {
        fd.append('project_category_id', String(form.project_category_id));
    }
    fd.append('title', form.title);
    if (form.slug?.trim()) {
        fd.append('slug', form.slug.trim());
    }
    fd.append('short_description', form.short_description || '');
    fd.append('full_description', form.full_description || '');
    fd.append('status', form.status);
    fd.append('is_featured', form.is_featured ? '1' : '0');
    fd.append('client_name', form.client_name || '');
    fd.append('project_url', form.project_url || '');
    fd.append('github_url', form.github_url || '');
    fd.append('duration', form.duration || '');
    const stack = form.tech_stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    fd.append('tech_stack', JSON.stringify(stack));
    if (thumbnailFile) {
        fd.append('thumbnail', thumbnailFile);
    }
    if (galleryFiles?.length) {
        for (const file of galleryFiles) {
            fd.append('gallery[]', file);
        }
    }
    return fd;
}

function buildProjectJsonBody(form) {
    const stack = form.tech_stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    const body = {
        title: form.title,
        short_description: form.short_description || '',
        full_description: form.full_description || '',
        status: form.status,
        is_featured: !!form.is_featured,
        client_name: form.client_name || '',
        project_url: form.project_url || '',
        github_url: form.github_url || '',
        duration: form.duration || '',
        tech_stack: stack,
    };
    if (form.project_category_id) {
        body.project_category_id = Number(form.project_category_id);
    }
    if (form.slug?.trim()) {
        body.slug = form.slug.trim();
    }
    return body;
}

export default function AdminProjects() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({});
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [galleryFiles, setGalleryFiles] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    function loadCategories() {
        api
            .get('/admin/project-categories')
            .then((r) => setCategories(unwrap(r) || []))
            .catch(() => {});
    }

    function load() {
        api
            .get('/admin/projects', { params: { page, search, per_page: 12 } })
            .then((r) => {
                const d = unwrap(r);
                setRows(d.items || []);
                setMeta(d.pagination || {});
            })
            .catch(() => toast.error('Failed to load projects'));
    }

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        load();
    }, [page, search]);

    function openCreate() {
        setEditing(null);
        setForm(empty);
        setThumbnailFile(null);
        setGalleryFiles([]);
        setModal(true);
    }

    async function openEdit(p) {
        setThumbnailFile(null);
        setGalleryFiles([]);
        let d = p;
        try {
            const r = await api.get(`/admin/projects/${p.id}`);
            d = unwrap(r) || p;
        } catch {
            /* use row */
        }
        setEditing(d);
        const catId = d.project_category_id ?? d.category?.id ?? '';
        const tech = Array.isArray(d.tech_stack) ? d.tech_stack.join(', ') : '';
        setForm({
            project_category_id: catId ? String(catId) : '',
            title: d.title || '',
            slug: d.slug || '',
            short_description: d.short_description || '',
            full_description: d.full_description || '',
            status: d.status || 'draft',
            is_featured: !!d.is_featured,
            client_name: d.client_name || '',
            project_url: d.project_url || '',
            github_url: d.github_url || '',
            duration: d.duration || '',
            tech_stack: tech,
        });
        setModal(true);
    }

    async function save(e) {
        e.preventDefault();
        const needsMultipart = Boolean(thumbnailFile) || (galleryFiles?.length > 0);
        try {
            if (editing) {
                if (needsMultipart) {
                    unwrap(
                        await api.post(
                            `/admin/projects/${editing.id}`,
                            buildProjectFormData(form, thumbnailFile, galleryFiles),
                        ),
                    );
                } else {
                    unwrap(await api.post(`/admin/projects/${editing.id}`, buildProjectJsonBody(form)));
                }
                toast.success('Project updated');
            } else if (needsMultipart) {
                unwrap(await api.post('/admin/projects', buildProjectFormData(form, thumbnailFile, galleryFiles)));
                toast.success('Project created');
            } else {
                unwrap(await api.post('/admin/projects', buildProjectJsonBody(form)));
                toast.success('Project created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function removeGalleryPath(projectId, path) {
        try {
            unwrap(await api.delete(`/admin/projects/${projectId}/gallery`, { data: { path } }));
            toast.success('Image removed');
            const r = await api.get(`/admin/projects/${projectId}`);
            setEditing(unwrap(r));
        } catch (err) {
            toastApiError(err, 'Remove failed');
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/projects/${id}`));
            toast.success('Deleted');
            setDeleteId(null);
            load();
        } catch (err) {
            toastApiError(err, 'Delete failed');
        }
    }

    return (
        <div>
            <AdminPageHeader
                title="Projects"
                description="Portfolio case studies, media, tech stack, and publish state — mirrored on the public work grid."
            />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <input
                className={`${adminInput} mt-4 max-w-md`}
                placeholder="Search projects…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className={`${adminTableShell} mt-6`}>
                <table className="min-w-full text-sm">
                    <thead className={adminTableHead}>
                        <tr>
                            <th className={adminTh}>Title</th>
                            <th className={adminTh}>Status</th>
                            <th className={adminTh}>Featured</th>
                            <th className={`${adminTh} text-right`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={4} className={`${adminTd} py-12 text-center text-slate-500`}>
                                    No projects match your filters.
                                </td>
                            </tr>
                        ) : (
                            rows.map((p) => (
                                <tr key={p.id} className="transition hover:bg-white/[0.02]">
                                    <td className={adminTd}>
                                        <span className="font-medium text-slate-200">{p.title}</span>
                                    </td>
                                    <td className={adminTd}>
                                        <span className={adminBadge}>{p.status}</span>
                                    </td>
                                    <td className={adminTd}>{p.is_featured ? 'Yes' : 'No'}</td>
                                    <td className={`${adminTd} text-right`}>
                                        <button type="button" className={`${adminTextLink} mr-1`} onClick={() => openEdit(p)}>
                                            Edit
                                        </button>
                                        <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(p.id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-3">
                <button type="button" disabled={page <= 1} className={adminPaginationBtn} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Prev
                </button>
                <span className="text-sm text-slate-500">
                    Page <span className="tabular-nums text-slate-300">{meta.current_page || page}</span> /{' '}
                    <span className="tabular-nums">{meta.last_page || 1}</span>
                </span>
                <button
                    type="button"
                    disabled={(meta.current_page || page) >= (meta.last_page || 1)}
                    className={adminPaginationBtn}
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>

            {modal ? (
                <AdminModal title={editing ? 'Edit project' : 'Create project'} onClose={() => setModal(false)} wide>
                    <form onSubmit={save} className="space-y-4">
                        <label className="block">
                            <span className={adminLabel}>Category</span>
                            <select
                                className={adminSelect}
                                value={form.project_category_id}
                                onChange={(e) => setForm({ ...form, project_category_id: e.target.value })}
                            >
                                <option value="">— None —</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Title</span>
                            <input className={adminInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Slug (optional)</span>
                            <input className={adminInput} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Short description</span>
                            <input className={adminInput} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Full description</span>
                            <textarea className={adminTextarea} rows={5} value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} />
                        </label>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className={adminLabel}>Status</span>
                                <select className={adminSelect} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                    <option value="draft">draft</option>
                                    <option value="published">published</option>
                                </select>
                            </label>
                            <label className="flex min-h-[44px] items-center gap-3 pt-6 text-sm text-slate-300">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-white/20 bg-slate-900 text-sky-500 focus:ring-sky-500/30"
                                    checked={form.is_featured}
                                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                                />
                                Featured
                            </label>
                        </div>
                        <label className="block">
                            <span className={adminLabel}>Tech stack (comma-separated)</span>
                            <input className={adminInput} value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} />
                        </label>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className={adminLabel}>Client name</span>
                                <input className={adminInput} value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Duration</span>
                                <input className={adminInput} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                            </label>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className={adminLabel}>Project URL</span>
                                <input className={adminInput} value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>GitHub URL</span>
                                <input className={adminInput} value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
                            </label>
                        </div>
                        <label className="block">
                            <span className={adminLabel}>Thumbnail</span>
                            <input type="file" accept="image/*" className={adminFileInput} onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Add gallery images</span>
                            <input type="file" accept="image/*" multiple className={adminFileInput} onChange={(e) => setGalleryFiles(e.target.files ? Array.from(e.target.files) : [])} />
                        </label>
                        {editing && editing.gallery_paths?.length ? (
                            <div>
                                <span className={adminLabel}>Current gallery</span>
                                <ul className="mt-2 space-y-2">
                                    {editing.gallery_paths.map((path) => (
                                        <li key={path} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2">
                                            <span className="truncate text-xs text-slate-500">{path}</span>
                                            <button type="button" className={adminTextLinkDanger} onClick={() => removeGalleryPath(editing.id, path)}>
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
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
                <AdminConfirmDialog
                    title="Delete this project?"
                    message="All images will be removed from storage."
                    onConfirm={() => remove(deleteId)}
                    onCancel={() => setDeleteId(null)}
                    danger
                />
            ) : null}
        </div>
    );
}
