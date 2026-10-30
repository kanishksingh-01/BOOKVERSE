"use client";

import React, { useState, useEffect } from "react";
import { FolderTree, Plus, X, Loader2, ArrowRight } from "lucide-react";
import { Category } from "@/types";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, image }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Category created!");
        setIsModalOpen(false);
        setName("");
        setDescription("");
        setImage("");
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to create category");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
            Taxonomy & Genres
          </span>
          <h1 className="font-serif text-3xl font-bold text-bookverse-espresso">
            Categories & Shelves
          </h1>
          <p className="text-xs text-bookverse-espresso/60">
            Organize catalog titles into genres and thematic shelves.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover shadow-warm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-5 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                {cat.image && (
                  <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-bookverse-beige/20">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-serif font-bold text-base text-bookverse-espresso">
                    {cat.name}
                  </h3>
                  <span className="font-mono text-[10px] text-bookverse-espresso/50">
                    /categories/{cat.slug}
                  </span>
                </div>
                <p className="text-xs text-bookverse-espresso/70 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-bookverse-beige flex items-center justify-between text-xs">
                <span className="font-bold text-bookverse-sage">
                  {cat.bookCount || 0} Books assigned
                </span>
                <Link
                  href={`/categories/${cat.slug}`}
                  target="_blank"
                  className="text-bookverse-terracotta font-semibold hover:underline flex items-center gap-1"
                >
                  <span>View shelf</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bookverse-espresso/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-bookverse-cream rounded-3xl border border-bookverse-beige shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-bookverse-beige">
              <h3 className="font-serif text-xl font-bold text-bookverse-espresso">
                Create New Shelf Category
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-bookverse-espresso/50 hover:text-bookverse-espresso"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Literary Essay & Criticism"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                  Shelf Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Curator note explaining the scope of this genre..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-bookverse-beige text-xs font-semibold text-bookverse-espresso"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover disabled:opacity-50"
                >
                  {isSaving ? "Creating..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
