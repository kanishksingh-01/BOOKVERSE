"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Book, Category } from "@/types";
import { formatINR } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [originalPriceRupees, setOriginalPriceRupees] = useState("");
  const [sellingPriceRupees, setSellingPriceRupees] = useState("");
  const [stock, setStock] = useState("20");
  const [pages, setPages] = useState("300");
  const [language, setLanguage] = useState("English");
  const [coverImage, setCoverImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [staffPick, setStaffPick] = useState(false);

  const fetchBooksAndCategories = async () => {
    try {
      const [bRes, cRes] = await Promise.all([
        fetch("/api/books?limit=50"),
        fetch("/api/categories"),
      ]);
      if (bRes.ok && cRes.ok) {
        const bData = await bRes.json();
        const cData = await cRes.json();
        setBooks(bData.books || []);
        setCategories(cData.categories || []);
        if (cData.categories?.length > 0 && !categoryId) {
          setCategoryId(cData.categories[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooksAndCategories();
  }, []);

  const openAddModal = () => {
    setEditingBook(null);
    setTitle("");
    setAuthor("");
    setPublisher("Independent Press");
    setIsbn(`978-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
    setDescription("");
    setOriginalPriceRupees("499");
    setSellingPriceRupees("399");
    setStock("25");
    setPages("320");
    setLanguage("English");
    setCoverImage("https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&auto=format&fit=crop&q=80");
    if (categories.length > 0) setCategoryId(categories[0].id);
    setFeatured(false);
    setBestseller(false);
    setStaffPick(false);
    setIsModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setTitle(book.title);
    setAuthor(book.author);
    setPublisher(book.publisher);
    setIsbn(book.isbn);
    setDescription(book.description);
    setOriginalPriceRupees((book.originalPrice / 100).toString());
    setSellingPriceRupees((book.sellingPrice / 100).toString());
    setStock(book.stock.toString());
    setPages(book.pages.toString());
    setLanguage(book.language);
    setCoverImage(book.coverImage);
    setCategoryId(book.categoryId);
    setFeatured(Boolean(book.featured));
    setBestseller(Boolean(book.bestseller));
    setStaffPick(Boolean(book.staffPick));
    setIsModalOpen(true);
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !author || !isbn || !categoryId) {
      toast.error("Please fill in title, author, ISBN and select a category");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title,
        author,
        publisher,
        isbn,
        description,
        originalPrice: Math.round(parseFloat(originalPriceRupees) * 100),
        sellingPrice: Math.round(parseFloat(sellingPriceRupees) * 100),
        stock: parseInt(stock, 10),
        pages: parseInt(pages, 10),
        language,
        coverImage,
        categoryId,
        featured,
        bestseller,
        staffPick,
      };

      const url = editingBook ? `/api/books/${editingBook.slug}` : "/api/books";
      const method = editingBook ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(editingBook ? "Book updated successfully!" : "Book added to catalogue!");
        setIsModalOpen(false);
        fetchBooksAndCategories();
      } else {
        toast.error(data.error || "Failed to save book");
      }
    } catch {
      toast.error("Network error saving book");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBook = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to remove "${title}" from the catalogue?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/books/${slug}`, { method: "DELETE" });
      if (res.ok) {
        toast.success(`"${title}" has been deleted`);
        fetchBooksAndCategories();
      } else {
        toast.error("Failed to delete book");
      }
    } catch {
      toast.error("Error deleting book");
    }
  };

  // Filter books locally
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.isbn.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || b.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-bookverse-sage font-bold block mb-1">
            Catalogue Management
          </span>
          <h1 className="font-serif text-3xl font-bold text-bookverse-espresso">
            Books & Works
          </h1>
          <p className="text-xs text-bookverse-espresso/60">
            Manage metadata, prices, inventory ceilings, and editorial picks.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover shadow-warm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bookverse-cream border border-bookverse-beige rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-bookverse-espresso/40 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, ISBN..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-bookverse-espresso/60 font-medium">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-xs font-medium text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Table */}
      <div className="bg-bookverse-cream border border-bookverse-beige rounded-3xl p-6 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-bookverse-terracotta animate-spin mx-auto" />
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="py-16 text-center text-bookverse-espresso/60 space-y-2">
            <BookOpen className="w-10 h-10 mx-auto text-bookverse-espresso/30" />
            <p className="font-semibold text-sm">No books found matching criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-bookverse-ivory/80 text-bookverse-espresso/70 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Book Cover & Title</th>
                  <th className="p-3.5">ISBN</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Badges</th>
                  <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bookverse-beige/60">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-bookverse-ivory/50 transition-colors">
                    <td className="p-3.5 flex items-center gap-3 min-w-[240px]">
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded shadow-xs shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-sm text-bookverse-espresso truncate">
                          {book.title}
                        </h4>
                        <p className="text-[11px] text-bookverse-espresso/60 truncate">
                          by {book.author}
                        </p>
                        <p className="text-[10px] text-bookverse-espresso/50 truncate">
                          {book.publisher}
                        </p>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-bookverse-espresso/80">
                      {book.isbn}
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-bookverse-sage-light text-bookverse-sage font-medium text-[10px]">
                        {book.category?.name || "Literature"}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <p className="font-serif font-bold text-bookverse-terracotta">
                        {formatINR(book.sellingPrice, true)}
                      </p>
                      {book.originalPrice > book.sellingPrice && (
                        <p className="text-[10px] text-bookverse-espresso/40 line-through">
                          {formatINR(book.originalPrice, true)}
                        </p>
                      )}
                    </td>

                    <td className="p-3.5 font-bold">
                      <span
                        className={
                          book.stock <= 5
                            ? "text-red-600 font-extrabold"
                            : "text-bookverse-espresso"
                        }
                      >
                        {book.stock} copies
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex gap-1">
                        {book.bestseller && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-bookverse-terracotta text-white">
                            BESTSELLER
                          </span>
                        )}
                        {book.staffPick && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-bookverse-espresso text-white">
                            PICK
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/books/${book.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-bookverse-espresso/60 hover:text-bookverse-espresso hover:bg-bookverse-ivory"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(book)}
                          className="p-1.5 rounded-lg text-bookverse-espresso/60 hover:text-bookverse-terracotta hover:bg-bookverse-ivory"
                          title="Edit book"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.slug, book.title)}
                          className="p-1.5 rounded-lg text-bookverse-espresso/60 hover:text-red-600 hover:bg-red-50"
                          title="Delete book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Book Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bookverse-espresso/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-bookverse-cream rounded-3xl border border-bookverse-beige shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-bookverse-beige">
              <h3 className="font-serif text-2xl font-bold text-bookverse-espresso">
                {editingBook ? `Edit: ${editingBook.title}` : "Add New Work to Catalogue"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-bookverse-espresso/50 hover:text-bookverse-espresso hover:bg-bookverse-beige/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. The God of Small Things"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Arundhati Roy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Publisher
                  </label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="e.g. Penguin India"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    ISBN-13 *
                  </label>
                  <input
                    type="text"
                    required
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="978-0679457312"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso font-mono focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Original Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={originalPriceRupees}
                    onChange={(e) => setOriginalPriceRupees(e.target.value)}
                    placeholder="499"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={sellingPriceRupees}
                    onChange={(e) => setSellingPriceRupees(e.target.value)}
                    placeholder="389"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta font-bold text-bookverse-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Page Count
                  </label>
                  <input
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(e.target.value)}
                    placeholder="340"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Cover Image URL (Cloudinary / Web Image URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold uppercase tracking-wider text-bookverse-sage mb-1">
                    Literary Description & Synopsis
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Synopsis of this work..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-bookverse-beige bg-bookverse-ivory text-sm text-bookverse-espresso focus:outline-none focus:border-bookverse-terracotta"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex flex-wrap gap-6 border-t border-bookverse-beige/70">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bestseller}
                    onChange={(e) => setBestseller(e.target.checked)}
                    className="w-4 h-4 rounded text-bookverse-terracotta border-bookverse-beige focus:ring-bookverse-terracotta"
                  />
                  <span className="font-semibold text-bookverse-espresso">
                    Mark as Bestseller
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={staffPick}
                    onChange={(e) => setStaffPick(e.target.checked)}
                    className="w-4 h-4 rounded text-bookverse-terracotta border-bookverse-beige focus:ring-bookverse-terracotta"
                  />
                  <span className="font-semibold text-bookverse-espresso">
                    Curator Staff Pick
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-bookverse-terracotta border-bookverse-beige focus:ring-bookverse-terracotta"
                  />
                  <span className="font-semibold text-bookverse-espresso">Featured on Home</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-bookverse-beige">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-bookverse-beige text-xs font-semibold text-bookverse-espresso hover:bg-bookverse-ivory"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-7 py-2.5 rounded-xl bg-bookverse-terracotta text-white text-xs font-semibold hover:bg-bookverse-terracotta-hover disabled:opacity-50 shadow-warm flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingBook ? "Save Changes" : "Create Book"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
