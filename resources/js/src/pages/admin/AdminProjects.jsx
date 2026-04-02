import { useEffect, useState } from 'react';
import { api, unwrap } from '@/services/api';
import toast from 'react-hot-toast';
import AdminCrudToolbar from '@/components/admin/AdminCrudToolbar';
import AdminModal from '@/components/admin/AdminModal';
import AdminConfirmDialog from '@/components/admin/AdminConfirmDialog';
import { toastApiError } from '@/utils/toastApiError';

const inp = 'mt-1 w-full rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm';

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
        const fd = buildProjectFormData(form, thumbnailFile, galleryFiles);
        try {
            if (editing) {
                unwrap(await api.put(`/admin/projects/${editing.id}`, fd));
                toast.success('Project updated');
            } else {
                unwrap(await api.post('/admin/projects', fd));
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
            <h1 className="text-2xl font-bold">Projects</h1>
            <AdminCrudToolbar onReload={load} onCreate={openCreate} />

            <input
                className="mt-4 w-full max-w-md rounded-lg border border-white/15 bg-slate-900 px-3 py-2 text-sm"
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-sm">
                    <thead className="bg-white/5 text-left text-slate-400">
                        <tr>
                            <th className="p-3">Title</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Featured</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((p) => (
                            <tr key={p.id} className="border-t border-white/5">
                                <td className="p-3">{p.title}</td>
                                <td className="p-3">{p.status}</td>
                                <td className="p-3">{p.is_featured ? 'Yes' : 'No'}</td>
                                <td className="p-3 text-right">
                                    <button type="button" className="mr-2 text-landogz-accent" onClick={() => openEdit(p)}>
                                        Edit
                                    </button>
                                    <button type="button" className="text-red-400 hover:underline" onClick={() => setDeleteId(p.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex gap-2">
                <button type="button" disabled={page <= 1} className="rounded border border-white/15 px-3 py-1" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                    Prev
                </button>
                <span className="text-slate-400">
                    Page {meta.current_page || page} / {meta.last_page || 1}
                </span>
                <button
                    type="button"
                    disabled={(meta.current_page || page) >= (meta.last_page || 1)}
                    className="rounded border border-white/15 px-3 py-1"
                    onClick={() => setPage((p) => p + 1)}
                >
                    Next
                </button>
            </div>

            {modal ? (
                <AdminModal title={editing ? 'Edit project' : 'Create project'} onClose={() => setModal(false)} wide>
                    <form onSubmit={save} className="space-y-3">
                        <label className="block text-sm">
                            <span className="text-slate-400">Category</span>
                            <select
                                className={inp}
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
                        <label className="block text-sm">
                            <span className="text-slate-400">Title</span>
                            <input className={inp} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Slug (optional)</span>
                            <input className={inp} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Short description</span>
                            <input className={inp} value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Full description</span>
                            <textarea className={inp} rows={5} value={form.full_description} onChange={(e) => setForm({ ...form, full_description: e.target.value })} />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block text-sm">
                                <span className="text-slate-400">Status</span>
                                <select className={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                    <option value="draft">draft</option>
                                    <option value="published">published</option>
                                </select>
                            </label>
                            <label className="flex items-center gap-2 pt-6 text-sm">
                                <input
                                    type="checkbox"
                                    checked={form.is_featured}
                                    onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                                />
                                Featured
                            </label>
                        </div>
                        <label className="block text-sm">
                            <span className="text-slate-400">Tech stack (comma-separated)</span>
                            <input className={inp} value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block text-sm">
                                <span className="text-slate-400">Client name</span>
                                <input className={inp} value={form.client_name} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
                            </label>
                            <label className="block text-sm">
                                <span className="text-slate-400">Duration</span>
                                <input className={inp} value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                            </label>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block text-sm">
                                <span className="text-slate-400">Project URL</span>
                                <input className={inp} value={form.project_url} onChange={(e) => setForm({ ...form, project_url: e.target.value })} />
                            </label>
                            <label className="block text-sm">
                                <span className="text-slate-400">GitHub URL</span>
                                <input className={inp} value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
                            </label>
                        </div>
                        <label className="block text-sm">
                            <span className="text-slate-400">Thumbnail</span>
                            <input type="file" accept="image/*" className="mt-1 text-sm" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
                        </label>
                        <label className="block text-sm">
                            <span className="text-slate-400">Add gallery images</span>
                            <input type="file" accept="image/*" multiple className="mt-1 text-sm" onChange={(e) => setGalleryFiles(e.target.files ? Array.from(e.target.files) : [])} />
                        </label>
                        {editing && editing.gallery_paths?.length ? (
                            <div className="text-sm">
                                <span className="text-slate-400">Current gallery</span>
                                <ul className="mt-1 space-y-1">
                                    {editing.gallery_paths.map((path) => (
                                        <li key={path} className="flex flex-wrap items-center justify-between gap-2 rounded border border-white/10 px-2 py-1">
                                            <span className="truncate text-xs text-slate-500">{path}</span>
                                            <button
                                                type="button"
                                                className="text-xs text-red-400"
                                                onClick={() => removeGalleryPath(editing.id, path)}
                                            >
                                                Remove
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                        <div className="flex gap-2 pt-2">
                            <button type="submit" className="rounded-lg bg-landogz-blue px-4 py-2 text-sm font-medium">
                                Save
                            </button>
                            <button type="button" className="rounded-lg border border-white/15 px-4 py-2 text-sm" onClick={() => setModal(false)}>
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
