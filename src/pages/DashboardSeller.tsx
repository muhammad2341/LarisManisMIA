"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, ChevronLeft, MapPin, Phone, Tag, Package, TrendingUp, BarChart3, MessageSquare, Star, Send } from "lucide-react";
import type { Product, Store } from "../types";
import { useAuth } from "../contexts/AuthContext";
import { stores as dummyStores, products as dummyProducts } from "../data/dummy";

export const DashboardSeller: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "store" | "reviews">(
    "overview"
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditStoreModal, setShowEditStoreModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [storeData, setStoreData] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    image: "",
    description: "",
    stock: "",
  });

  const [editStoreForm, setEditStoreForm] = useState({
    name: "",
    description: "",
    address: "",
    whatsapp: "",
    category: "",
    openingTime: "",
    closingTime: "",
  });

  // Revenue: monthly income entries per store
  type RevenueRecord = { year: number; month: number; amount: number };
  const [revenue, setRevenue] = useState<RevenueRecord[]>([]);
  const [revForm, setRevForm] = useState<{ year: number; month: number; amount: string }>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, amount: "" };
  });

  // Dummy reviews data (in real app, fetch from backend)
  const [reviews, setReviews] = useState([
    { id: "1", customerName: "Budi Santoso", rating: 5, comment: "Produk sangat bagus, pengiriman cepat!", date: "2024-11-10", response: "" },
    { id: "2", customerName: "Siti Aminah", rating: 4, comment: "Kualitas oke, harga terjangkau.", date: "2024-11-12", response: "Terima kasih atas reviewnya!" },
    { id: "3", customerName: "Ahmad Rizki", rating: 5, comment: "Pelayanan ramah, barang sesuai ekspektasi.", date: "2024-11-14", response: "" },
  ]);
  const [responseText, setResponseText] = useState<{[key: string]: string}>({});

  // Build sales data for chart from revenue; fallback to dummy if empty
  const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const computedSalesData = (() => {
    if (revenue.length === 0) {
      return [
        { monthLabel: "Jan", sales: 0 },
        { monthLabel: "Feb", sales: 0 },
        { monthLabel: "Mar", sales: 0 },
        { monthLabel: "Apr", sales: 0 },
        { monthLabel: "Mei", sales: 0 },
        { monthLabel: "Jun", sales: 0 },
      ];
    }
    // take last 6 entries by year/month
    const sorted = [...revenue].sort((a, b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
    const last6 = sorted.slice(-6);
    return last6.map(r => ({ monthLabel: `${monthNames[r.month-1]} ${String(r.year).slice(-2)}`, sales: r.amount }));
  })();
  const maxSales = Math.max(1, ...computedSalesData.map(d => d.sales));

  // Load store and products based on logged-in seller
  useEffect(() => {
    if (!user) return;

    // Get user's store data from dummyAccounts
    const usersArr = JSON.parse(localStorage.getItem("umkm_users") || "[]");
    const userAccount = usersArr.find(
      (u: any) => u.email === user.email
    );

    // Fallback: if seller account has no storeId, create one now
    if (userAccount && user?.role === "seller" && !userAccount.storeId) {
      const newStoreId = `store-${Date.now()}`;
      const newStore: Store = {
        id: newStoreId,
        name: `Toko ${userAccount.name || user.name}`,
        image: "",
        description: "Perbarui deskripsi toko Anda di halaman Info Toko.",
        address: "",
        whatsapp: userAccount.phone || "",
        mapUrl: "",
        rating: 0,
        products: [],
        category: "",
        openingTime: "",
        closingTime: "",
      } as Store;

      const savedStores = JSON.parse(localStorage.getItem("seller_stores") || "{}");
      savedStores[newStoreId] = newStore;
      localStorage.setItem("seller_stores", JSON.stringify(savedStores));

      const savedProducts = JSON.parse(localStorage.getItem("seller_products") || "{}");
      savedProducts[newStoreId] = [];
      localStorage.setItem("seller_products", JSON.stringify(savedProducts));

      // Update users storeId in umkm_users and current session user
      const updatedUsers = usersArr.map((u: any) =>
        u.email === user.email ? { ...u, storeId: newStoreId } : u
      );
      localStorage.setItem("umkm_users", JSON.stringify(updatedUsers));
      const current = JSON.parse(localStorage.getItem("umkm_user") || "null");
      if (current && current.email === user.email) {
        localStorage.setItem(
          "umkm_user",
          JSON.stringify({ ...current, storeId: newStoreId })
        );
      }

      // Initialize state immediately
      setStoreData(newStore);
      setProducts([]);
      return;
    }

    if (userAccount && userAccount.storeId) {
      // Load store from localStorage or dummy data
      const savedStores = JSON.parse(localStorage.getItem("seller_stores") || "{}");
      const store = savedStores[userAccount.storeId] || dummyStores.find((s) => s.id === userAccount.storeId);
      
      if (store) {
        setStoreData(store);
        setEditStoreForm({
          name: store.name,
          description: store.description,
          address: store.address,
          whatsapp: store.whatsapp,
          category: store.category || "",
          openingTime: store.openingTime || "",
          closingTime: store.closingTime || "",
        });

        // Load products from localStorage first, fallback to dummy data
        const savedProducts = JSON.parse(localStorage.getItem("seller_products") || "{}");
        const storeProducts = savedProducts[userAccount.storeId] || 
          dummyProducts.filter((p) => p.storeId === userAccount.storeId);
        setProducts(storeProducts);
      }
    }
  }, [user]);

  // Load revenue when storeData is available
  useEffect(() => {
    if (!storeData) return;
    try {
      const db = JSON.parse(localStorage.getItem("seller_revenue") || "{}");
      const list: RevenueRecord[] = Array.isArray(db[storeData.id]) ? db[storeData.id] : [];
      setRevenue(list);
    } catch {
      setRevenue([]);
    }
  }, [storeData]);

  // Add or update product
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeData) {
      alert("Data toko tidak ditemukan");
      return;
    }

    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      alert("Mohon isi semua field yang diperlukan");
      return;
    }

    if (editingProduct) {
      // Update existing product
      const updatedProduct: Product = {
        ...editingProduct,
        name: newProduct.name,
        category: newProduct.category,
        price: Number.parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice
          ? Number.parseFloat(newProduct.originalPrice)
          : undefined,
        image: newProduct.image,
        description: newProduct.description,
        stock: newProduct.stock ? Number.parseInt(newProduct.stock) : undefined,
      };

      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? updatedProduct : p
      );
      setProducts(updatedProducts);
      
      // Save to localStorage
      saveProductsToLocalStorage(updatedProducts);
      setEditingProduct(null);
    } else {
      // Add new product
      const newId = `product-${Date.now()}`;
      const product: Product = {
        id: newId,
        name: newProduct.name,
        category: newProduct.category,
        price: Number.parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice
          ? Number.parseFloat(newProduct.originalPrice)
          : undefined,
        image: newProduct.image,
        rating: 0,
        reviews: 0,
        storeId: storeData.id,
        storeName: storeData.name,
        description: newProduct.description,
        stock: newProduct.stock ? Number.parseInt(newProduct.stock) : undefined,
      };

      const updatedProducts = [...products, product];
      setProducts(updatedProducts);
      
      // Save to localStorage
      saveProductsToLocalStorage(updatedProducts);
    }

    setNewProduct({
      name: "",
      category: "",
      price: "",
      originalPrice: "",
      image: "",
      description: "",
      stock: "",
    });
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    saveProductsToLocalStorage(updatedProducts);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      image: product.image,
      description: product.description,
      stock: product.stock?.toString() || "",
    });
    setShowAddModal(true);
  };

  const handleUpdateStore = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeData) return;

    const updatedStore: Store = {
      ...storeData,
      name: editStoreForm.name,
      description: editStoreForm.description,
      address: editStoreForm.address,
      whatsapp: editStoreForm.whatsapp,
      category: editStoreForm.category,
      openingTime: editStoreForm.openingTime,
      closingTime: editStoreForm.closingTime,
    };

    setStoreData(updatedStore);
    saveStoreToLocalStorage(updatedStore);
    setShowEditStoreModal(false);
  };

  // Save products to localStorage
  const saveProductsToLocalStorage = (productList: Product[]) => {
    if (!storeData) return;
    
    // Get existing seller products from localStorage
    const existingProducts = JSON.parse(
      localStorage.getItem("seller_products") || "{}"
    );
    
    // Update products for this store
    existingProducts[storeData.id] = productList;
    
    // Save back to localStorage
    localStorage.setItem("seller_products", JSON.stringify(existingProducts));
  };

  const handleImageFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setNewProduct((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
  };

  // Save store info to localStorage
  const saveStoreToLocalStorage = (store: Store) => {
    const existingStores = JSON.parse(
      localStorage.getItem("seller_stores") || "{}"
    );
    
    existingStores[store.id] = store;
    localStorage.setItem("seller_stores", JSON.stringify(existingStores));
  };

  // Revenue helpers
  const saveRevenue = (records: RevenueRecord[]) => {
    if (!storeData) return;
    const db = JSON.parse(localStorage.getItem("seller_revenue") || "{}");
    db[storeData.id] = records;
    localStorage.setItem("seller_revenue", JSON.stringify(db));
    setRevenue(records);
  };

  const addOrUpdateRevenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeData) return;
    const amountNum = Number.parseInt(revForm.amount || "0");
    if (!amountNum || amountNum < 0) {
      alert("Masukkan nominal pendapatan yang valid");
      return;
    }
    const list = [...revenue];
    const idx = list.findIndex(r => r.year === revForm.year && r.month === revForm.month);
    if (idx >= 0) list[idx] = { year: revForm.year, month: revForm.month, amount: amountNum };
    else list.push({ year: revForm.year, month: revForm.month, amount: amountNum });
    // sort by date
    list.sort((a,b) => a.year !== b.year ? a.year - b.year : a.month - b.month);
    saveRevenue(list);
    alert("Pendapatan bulanan tersimpan");
  };


  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white font-semibold shadow transition"
            >
              <ChevronLeft size={20} />
              <span>Kembali</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-lg">Dashboard Penjual</h1>
          </div>
          <div className="text-lg md:text-xl font-semibold text-white/90 drop-shadow">Kelola toko & produk Anda</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-6 font-semibold rounded-t-lg transition-all duration-150 ${
              activeTab === "overview"
                ? "bg-white border-x border-t border-b-0 border-green-500 text-green-700 shadow-sm -mb-px"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Ringkasan
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`pb-3 px-6 font-semibold rounded-t-lg transition-all duration-150 ${
              activeTab === "products"
                ? "bg-white border-x border-t border-b-0 border-green-500 text-green-700 shadow-sm -mb-px"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Produk
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 px-6 font-semibold rounded-t-lg transition-all duration-150 ${
              activeTab === "reviews"
                ? "bg-white border-x border-t border-b-0 border-green-500 text-green-700 shadow-sm -mb-px"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            <MessageSquare size={16} className="inline mr-1" />
            Review
          </button>
          <button
            onClick={() => setActiveTab("store")}
            className={`pb-3 px-6 font-semibold rounded-t-lg transition-all duration-150 ${
              activeTab === "store"
                ? "bg-white border-x border-t border-b-0 border-green-500 text-green-700 shadow-sm -mb-px"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Info Toko
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-green-500">
                <div className="text-gray-500 text-sm font-semibold mb-2">Total Produk</div>
                <div className="text-5xl font-extrabold text-green-600 mb-1">{products.length}</div>
                <div className="text-xs text-gray-400">Produk aktif di toko Anda</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-blue-500">
                <div className="text-gray-500 text-sm font-semibold mb-2">Pendapatan Bulan Ini</div>
                <div className="text-5xl font-extrabold text-blue-600 mb-1">
                  {(() => {
                    const now = new Date();
                    const rec = revenue.find(r => r.year === now.getFullYear() && r.month === (now.getMonth()+1));
                    const amt = rec?.amount || 0;
                    return `Rp ${amt.toLocaleString("id-ID")}`;
                  })()}
                </div>
                <div className="text-xs text-gray-400">Diambil dari input pendapatan</div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center border-t-4 border-yellow-400">
                <div className="text-gray-500 text-sm font-semibold mb-2">Rating Toko</div>
                <div className="text-5xl font-extrabold text-yellow-500 mb-1">4.8 <span className="text-3xl">⭐</span></div>
                <div className="text-xs text-gray-400">Dari pembeli</div>
              </div>
            </div>

            {/* Revenue Input */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Tambah/Update Pendapatan Bulanan</h3>
              <form onSubmit={addOrUpdateRevenue} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bulan</label>
                  <select
                    value={revForm.month}
                    onChange={(e) => setRevForm({ ...revForm, month: Number(e.target.value) })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    {monthNames.map((m, i) => (
                      <option key={i} value={i+1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tahun</label>
                  <input
                    type="number"
                    value={revForm.year}
                    onChange={(e) => setRevForm({ ...revForm, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nominal (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={revForm.amount}
                    onChange={(e) => setRevForm({ ...revForm, amount: e.target.value })}
                    placeholder="cth: 1200000"
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">Simpan</button>
                  <button type="button" onClick={() => setRevForm((p) => ({ ...p, amount: "" }))} className="px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition">Reset</button>
                </div>
              </form>
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="text-blue-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">Grafik Pendapatan 6 Bulan Terakhir</h3>
              </div>
              <div className="space-y-4">
                {computedSalesData.map((data, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-semibold text-gray-600">{data.monthLabel}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-10 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full flex items-center justify-end pr-4 transition-all duration-500"
                        style={{ width: `${(data.sales / maxSales) * 100}%` }}
                      >
                        <span className="text-white text-sm font-bold">
                          Rp {(data.sales / 1000000).toFixed(1)}jt
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                <TrendingUp size={16} className="text-green-600" />
                <span>Trend penjualan meningkat 15% dari bulan lalu</span>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Kelola Produk
              </h2>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setNewProduct({
                    name: "",
                    category: "",
                    price: "",
                    originalPrice: "",
                    image: "",
                    description: "",
                    stock: "",
                  });
                  setShowAddModal(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
              >
                <Plus size={20} />
                <span>Tambah Produk</span>
              </button>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {product.category}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-green-600">
                          Rp {product.price.toLocaleString("id-ID")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            Rp {product.originalPrice.toLocaleString("id-ID")}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition font-semibold text-sm"
                        >
                          <Edit2 size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition font-semibold text-sm"
                        >
                          <Trash2 size={16} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500 text-lg mb-4">Belum ada produk</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                >
                  <Plus size={20} />
                  <span>Tambah Produk Pertama</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="text-green-600" size={28} />
                Review Pelanggan
              </h2>
              <div className="text-sm text-gray-500">
                Total {reviews.length} review
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl shadow-md p-6 space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{review.customerName}</h3>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-2">{review.rating}/5</span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">{review.date}</span>
                  </div>

                  {/* Review Comment */}
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{review.comment}</p>

                  {/* Seller Response */}
                  {review.response ? (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="text-sm font-semibold text-blue-900 mb-1">Respon Anda:</div>
                      <p className="text-gray-700">{review.response}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Balas Review:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Tulis respon Anda..."
                          value={responseText[review.id] || ""}
                          onChange={(e) => setResponseText({ ...responseText, [review.id]: e.target.value })}
                          className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                        />
                        <button
                          onClick={() => {
                            if (responseText[review.id]?.trim()) {
                              setReviews(reviews.map(r => 
                                r.id === review.id ? { ...r, response: responseText[review.id] } : r
                              ));
                              setResponseText({ ...responseText, [review.id]: "" });
                              alert("Respon berhasil dikirim!");
                            }
                          }}
                          className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                          <Send size={16} />
                          Kirim
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Store Info Tab */}
        {activeTab === "store" && (
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Informasi Toko
              </h2>
              <button
                onClick={() => setShowEditStoreModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                <Edit2 size={20} />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img
                  src={storeData.image || "/placeholder.svg"}
                  alt={storeData.name}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-500">
                    Nama Toko
                  </label>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {storeData.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-500">
                    Deskripsi
                  </label>
                  <p className="text-gray-700 mt-1">{storeData.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3">
                    <MapPin
                      className="text-green-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        Alamat
                      </label>
                      <p className="text-gray-900">{storeData.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone
                      className="text-green-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <label className="text-sm font-semibold text-gray-500">
                        WhatsApp
                      </label>
                      <a
                        href={`https://wa.me/${storeData.whatsapp.replace(
                          /\D/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 font-semibold hover:text-green-700"
                      >
                        {storeData.whatsapp}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-yellow-400 to-green-500 text-white p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">
                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-2xl font-bold hover:text-yellow-100 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  placeholder="Masukkan nama produk"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                    required
                  >
                    <option value="">Pilih kategori</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Kerajinan">Kerajinan</option>
                    <option value="Aksesoris">Aksesoris</option>
                    <option value="Kecantikan">Kecantikan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    placeholder="Harga produk"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Harga Asli (Opsional - untuk diskon)
                </label>
                <input
                  type="number"
                  value={newProduct.originalPrice}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      originalPrice: e.target.value,
                    })
                  }
                  placeholder="Harga asli untuk menampilkan diskon"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                />
                {newProduct.originalPrice && newProduct.price && (
                  <p className="text-sm text-green-600 mt-1">
                    Diskon:{" "}
                    {Math.round(
                      ((Number.parseFloat(newProduct.originalPrice) -
                        Number.parseFloat(newProduct.price)) /
                        Number.parseFloat(newProduct.originalPrice)) *
                        100
                    )}
                    %
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Foto Produk
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {newProduct.image && (
                    <div className="mt-2">
                      <img src={newProduct.image} alt="Preview" className="h-24 w-24 object-cover rounded-md border" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Package size={16} className="inline mr-1" />
                    Stock (Opsional)
                  </label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                    placeholder="Jumlah stok"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Deskripsi produk"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500"
                  rows={3}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  {editingProduct ? "Perbarui Produk" : "Tambah Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Store Modal */}
      {showEditStoreModal && storeData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-400 to-purple-500 text-white p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold">Edit Informasi Toko</h3>
              <button
                onClick={() => setShowEditStoreModal(false)}
                className="text-2xl font-bold hover:text-blue-100 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStore} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Toko
                </label>
                <input
                  type="text"
                  value={editStoreForm.name}
                  onChange={(e) =>
                    setEditStoreForm({ ...editStoreForm, name: e.target.value })
                  }
                  placeholder="Nama toko Anda"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori Toko
                </label>
                <select
                  value={editStoreForm.category}
                  onChange={(e) =>
                    setEditStoreForm({ ...editStoreForm, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">Pilih kategori</option>
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Kerajinan">Kerajinan</option>
                  <option value="Aksesoris">Aksesoris</option>
                  <option value="Kecantikan">Kecantikan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Deskripsi Toko
                </label>
                <textarea
                  value={editStoreForm.description}
                  onChange={(e) =>
                    setEditStoreForm({ ...editStoreForm, description: e.target.value })
                  }
                  placeholder="Deskripsikan toko Anda"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <MapPin size={16} className="inline mr-1" />
                  Alamat
                </label>
                <input
                  type="text"
                  value={editStoreForm.address}
                  onChange={(e) =>
                    setEditStoreForm({ ...editStoreForm, address: e.target.value })
                  }
                  placeholder="Alamat lengkap toko"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone size={16} className="inline mr-1" />
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={editStoreForm.whatsapp}
                  onChange={(e) =>
                    setEditStoreForm({ ...editStoreForm, whatsapp: e.target.value })
                  }
                  placeholder="+628xxxxxxxxxx"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Buka
                  </label>
                  <input
                    type="time"
                    value={editStoreForm.openingTime}
                    onChange={(e) =>
                      setEditStoreForm({ ...editStoreForm, openingTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jam Tutup
                  </label>
                  <input
                    type="time"
                    value={editStoreForm.closingTime}
                    onChange={(e) =>
                      setEditStoreForm({ ...editStoreForm, closingTime: e.target.value })
                    }
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditStoreModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
