import { useState, useEffect } from "react";
import { PlusIcon, EditIcon, XIcon, CheckIcon } from "lucide-react";
import Loading from "../../components/Loading";
import api from "../../config/api";
import toast from "react-hot-toast";

interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    createdAt?: string;
}

interface FormData {
    name: string;
    slug: string;
    image: string;
}

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({ name: "", slug: "", image: "" });
    const [submitting, setSubmitting] = useState(false);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get("/categories");
            setCategories(data.categories || []);
        } catch (error: any) {
            toast.error(error.response?.data?.message || error?.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const resetForm = () => {
        setFormData({ name: "", slug: "", image: "" });
        setEditingId(null);
        setShowForm(false);
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name,
            slug: generateSlug(name),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error("Category name is required");
            return;
        }
        if (!formData.image.trim()) {
            toast.error("Category image URL is required");
            return;
        }

        setSubmitting(true);
        try {
            if (editingId) {
                await api.put(`/categories/${editingId}`, {
                    name: formData.name,
                    slug: formData.slug,
                    image: formData.image,
                });
                toast.success("Category updated successfully", { duration: 3000 });
            } else {
                await api.post("/categories", {
                    name: formData.name,
                    slug: formData.slug,
                    image: formData.image,
                });
                toast.success("Category added successfully", { duration: 3000 });
            }
            fetchCategories();
            resetForm();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to save category");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (category: Category) => {
        setFormData({
            name: category.name,
            slug: category.slug,
            image: category.image,
        });
        setEditingId(category.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`Are you sure you want to delete "${name}"? This will not delete products in this category.`)) return;

        try {
            await api.delete(`/categories/${id}`);
            toast.success("Category deleted successfully", { duration: 3000 });
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete category");
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-app-border overflow-hidden">
                <div className="px-6 py-5 border-b border-app-border flex items-center justify-between gap-4 flex-wrap">
                    <h2 className="text-xl font-semibold text-zinc-900">Categories</h2>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-app-green text-white rounded-xl hover:bg-green-950 transition-colors font-medium text-sm"
                        >
                            <PlusIcon className="size-4" /> Add Category
                        </button>
                    )}
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className="px-6 py-5 border-b border-app-border bg-app-cream/50">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-900 mb-1.5">Category Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                        placeholder="e.g., Fruits & Vegetables"
                                        className="w-full px-3 py-2 border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-green/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-900 mb-1.5">Slug (Auto-generated)</label>
                                    <input type="text" value={formData.slug} readOnly className="w-full px-3 py-2 border border-app-border rounded-lg bg-zinc-50 text-zinc-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-900 mb-1.5">Image URL *</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                                        placeholder="https://..."
                                        className="w-full px-3 py-2 border border-app-border rounded-lg focus:outline-none focus:ring-2 focus:ring-app-green/50"
                                    />
                                </div>
                            </div>

                            {/* Image Preview */}
                            {formData.image && (
                                <div className="flex items-center gap-4">
                                    <img src={formData.image} alt="preview" className="size-16 rounded-lg object-cover border border-app-border" />
                                    <span className="text-sm text-zinc-500">Image preview</span>
                                </div>
                            )}

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-4 py-2 bg-app-green text-white rounded-lg hover:bg-green-950 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckIcon className="size-4" /> {submitting ? "Saving..." : editingId ? "Update Category" : "Add Category"}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-4 py-2 bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-colors font-medium text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Categories Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-app-cream/50 text-zinc-500 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-app-border">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500">
                                        No categories found. Create your first category!
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-zinc-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img src={category.image} alt={category.name} className="size-10 rounded-lg object-cover" />
                                                <span className="font-semibold text-zinc-900">{category.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-zinc-600">{category.slug}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={category.image} target="_blank" rel="noopener noreferrer" className="text-app-green hover:underline text-xs truncate max-w-48">
                                                View Image
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-zinc-500 hover:text-app-orange bg-zinc-100 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Edit category"
                                                >
                                                    <EditIcon className="size-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id, category.name)}
                                                    className="p-2 text-zinc-500 hover:text-red-600 bg-zinc-100 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete category"
                                                >
                                                    <XIcon className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
