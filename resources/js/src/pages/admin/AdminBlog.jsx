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
    title: '',
    slug: '',
    category: '',
    tags: '',
    content: '',
    excerpt: '',
    author: '',
    published_at: '',
    status: 'draft',
};

function buildBlogFormData(form, featuredFile) {
    const fd = new FormData();
    fd.append('title', form.title);
    if (form.slug?.trim()) {
        fd.append('slug', form.slug.trim());
    }
    fd.append('category', form.category || '');
    const tags = form.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    fd.append('tags', JSON.stringify(tags));
    fd.append('content', form.content || '');
    fd.append('excerpt', form.excerpt || '');
    fd.append('author', form.author || '');
    if (form.published_at) {
        fd.append('published_at', form.published_at);
    }
    fd.append('status', form.status);
    if (featuredFile) {
        fd.append('featured_image', featuredFile);
    }
    return fd;
}

function buildBlogJsonBody(form) {
    const tags = form.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    const body = {
        title: form.title,
        category: form.category || '',
        tags,
        content: form.content || '',
        excerpt: form.excerpt || '',
        author: form.author || '',
        status: form.status,
    };
    if (form.slug?.trim()) {
        body.slug = form.slug.trim();
    }
    if (form.published_at) {
        body.published_at = form.published_at;
    }
    return body;
}

export default function AdminBlog() {
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState({});
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(empty);
    const [featuredFile, setFeaturedFile] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    function load() {
        api
            .get('/admin/blog-posts', { params: { page, per_page: 12 } })
            .then((r) => {
                const d = unwrap(r);
                setRows(d.items || []);
                setMeta(d.pagination || {});
            })
            .catch(() => toast.error('Failed to load'));
    }

    useEffect(() => {
        load();
    }, [page]);

    function openCreate() {
        setEditing(null);
        setForm(empty);
        setFeaturedFile(null);
        setModal(true);
    }

    async function openEdit(b) {
        setFeaturedFile(null);
        let d = b;
        try {
            const r = await api.get(`/admin/blog-posts/${b.id}`);
            d = unwrap(r) || b;
        } catch {
            /* use row */
        }
        setEditing(d);
        const tagsStr = Array.isArray(d.tags) ? d.tags.join(', ') : '';
        let pub = '';
        if (d.published_at) {
            const dt = new Date(d.published_at);
            if (!Number.isNaN(dt.getTime())) {
                pub = dt.toISOString().slice(0, 16);
            }
        }
        setForm({
            title: d.title || '',
            slug: d.slug || '',
            category: d.category || '',
            tags: tagsStr,
            content: d.content || '',
            excerpt: d.excerpt || '',
            author: d.author || '',
            published_at: pub,
            status: d.status || 'draft',
        });
        setModal(true);
    }

    async function save(e) {
        e.preventDefault();
        try {
            if (editing) {
                if (featuredFile) {
                    unwrap(await api.post(`/admin/blog-posts/${editing.id}`, buildBlogFormData(form, featuredFile)));
                } else {
                    unwrap(await api.post(`/admin/blog-posts/${editing.id}`, buildBlogJsonBody(form)));
                }
                toast.success('Post updated');
            } else if (featuredFile) {
                unwrap(await api.post('/admin/blog-posts', buildBlogFormData(form, featuredFile)));
                toast.success('Post created');
            } else {
                unwrap(await api.post('/admin/blog-posts', buildBlogJsonBody(form)));
                toast.success('Post created');
            }
            setModal(false);
            load();
        } catch (err) {
            toastApiError(err, 'Save failed');
        }
    }

    async function remove(id) {
        try {
            unwrap(await api.delete(`/admin/blog-posts/${id}`));
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
                title="Blog posts"
                description="Editorial content for the site — HTML or markdown in the body depending on how the public blog renders."
            />
            <AdminCrudToolbar onReload={load} onCreate={openCreate} createLabel="New post" />

            <div className={`${adminTableShell} mt-6`}>
                <table className="min-w-full text-sm">
                    <thead className={adminTableHead}>
                        <tr>
                            <th className={adminTh}>Title</th>
                            <th className={adminTh}>Status</th>
                            <th className={`${adminTh} text-right`}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={3} className={`${adminTd} py-12 text-center text-slate-500`}>
                                    No posts yet.
                                </td>
                            </tr>
                        ) : (
                            rows.map((b) => (
                                <tr key={b.id} className="transition hover:bg-white/[0.02]">
                                    <td className={`${adminTd} font-medium text-slate-200`}>{b.title}</td>
                                    <td className={adminTd}>
                                        <span className={adminBadge}>{b.status}</span>
                                    </td>
                                    <td className={`${adminTd} text-right`}>
                                        <button type="button" className={`${adminTextLink} mr-1`} onClick={() => openEdit(b)}>
                                            Edit
                                        </button>
                                        <button type="button" className={adminTextLinkDanger} onClick={() => setDeleteId(b.id)}>
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
                <button type="button" disabled={page <= 1} className={adminPaginationBtn} onClick={() => setPage((p) => p - 1)}>
                    Prev
                </button>
                <span className="text-sm text-slate-500">
                    <span className="tabular-nums text-slate-300">{meta.current_page || page}</span> /{' '}
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
                <AdminModal title={editing ? 'Edit post' : 'New post'} onClose={() => setModal(false)} wide>
                    <form onSubmit={save} className="space-y-4">
                        <label className="block">
                            <span className={adminLabel}>Title</span>
                            <input className={adminInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Slug (optional)</span>
                            <input className={adminInput} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                        </label>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className={adminLabel}>Category</span>
                                <input className={adminInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Author</span>
                                <input className={adminInput} value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                            </label>
                        </div>
                        <label className="block">
                            <span className={adminLabel}>Tags (comma-separated)</span>
                            <input className={adminInput} value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Excerpt</span>
                            <textarea className={adminTextarea} rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
                        </label>
                        <label className="block">
                            <span className={adminLabel}>Content</span>
                            <textarea className={adminTextarea} rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                        </label>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="block">
                                <span className={adminLabel}>Status</span>
                                <select className={adminSelect} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                    <option value="draft">draft</option>
                                    <option value="published">published</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className={adminLabel}>Published at</span>
                                <input
                                    className={adminInput}
                                    type="datetime-local"
                                    value={form.published_at}
                                    onChange={(e) => setForm({ ...form, published_at: e.target.value })}
                                />
                            </label>
                        </div>
                        <label className="block">
                            <span className={adminLabel}>Featured image</span>
                            <input type="file" accept="image/*" className={adminFileInput} onChange={(e) => setFeaturedFile(e.target.files?.[0] || null)} />
                        </label>
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
                <AdminConfirmDialog title="Delete this post?" onConfirm={() => remove(deleteId)} onCancel={() => setDeleteId(null)} danger />
            ) : null}
        </div>
    );
}
