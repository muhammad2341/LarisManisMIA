"use client";

import React from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  ArrowRight, 
  MapPin, 
  Store, 
  Star, 
  ShoppingBag,
  Shield,
  Zap,
  Users,
  TrendingUp,
  Heart,
  CheckCircle2,
  Sparkles,
  Phone
} from "lucide-react";
import { Carousel } from "../components/Carousel";
import { ProductCard } from "../components/ProductCard";
import { StoreCard } from "../components/StoreCard";
import { categories, products, advertisementBanners, stores } from "../data/dummy";
import { BuyerChatBot } from "../components/BuyerChatBot";

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("");

  const filteredProducts = React.useMemo(() => {
    const q = searchQuery.toLowerCase();
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.storeName.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-green-400/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Hero Section dengan Welcome Text */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border-2 border-yellow-300">
                <Sparkles className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-bold text-yellow-800">Platform UMKM Terpercaya</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  Selamat Datang
                </span>
                <br />
                <span className="text-gray-900">Di Laris Manis</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Platform marketplace yang menghubungkan Anda dengan ribuan produk berkualitas dari UMKM lokal. 
                Belanja mudah, dukung ekonomi lokal, tingkatkan kesejahteraan bersama!
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/login"
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <ShoppingBag className="w-5 h-5 relative z-10" />
                  <span className="relative z-10">Mulai Belanja</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
                </Link>
                
                <Link
                  to="/maps"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-800 font-bold rounded-2xl border-3 border-gray-300 hover:border-orange-500 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <span>Lihat Peta Toko</span>
                </Link>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t-2 border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                    1000+
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">Pembeli Aktif</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    500+
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">Produk Dijual</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                    100+
                  </div>
                  <div className="text-sm text-gray-600 font-semibold mt-1">UMKM Partner</div>
                </div>
              </div>
            </div>

            {/* Right Content - Laptop Mockup with Screenshots */}
            <div className="relative lg:block hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
              <div className="relative space-y-8">
                {/* Laptop Mockup 1 - Home Buyer */}
                <div className="relative group transform hover:scale-105 transition-transform duration-500">
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  {/* Laptop Frame */}
                  <div className="relative bg-gray-900 rounded-t-2xl p-3 shadow-2xl">
                    {/* Laptop Screen */}
                    <div className="bg-white rounded-lg overflow-hidden border-4 border-gray-800">
                      <div className="bg-gray-200 px-3 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-1 bg-white rounded px-2 py-0.5 text-[8px] text-gray-600">
                          larismanis.com/home
                        </div>
                      </div>
                      {/* Screenshot Content - Home Buyer Preview */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 h-64 overflow-hidden">
                        <div className="space-y-3">
                          {/* Mini Search Bar */}
                          <div className="bg-white rounded-lg p-2 shadow-md flex items-center gap-2">
                            <Search className="w-3 h-3 text-gray-400" />
                            <div className="h-2 bg-gray-200 rounded flex-1"></div>
                          </div>
                          {/* Mini Categories */}
                          <div className="grid grid-cols-4 gap-2">
                            {['🍲', '🥤', '👗', '🎨'].map((icon, i) => (
                              <div key={i} className="bg-white rounded-lg p-2 text-center shadow-sm">
                                <div className="text-xl">{icon}</div>
                              </div>
                            ))}
                          </div>
                          {/* Mini Product Grid */}
                          <div className="grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                                <div className="bg-gradient-to-br from-orange-200 to-red-200 h-16"></div>
                                <div className="p-1.5 space-y-1">
                                  <div className="h-1.5 bg-gray-200 rounded"></div>
                                  <div className="h-1 bg-gray-100 rounded w-3/4"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Laptop Bottom */}
                    <div className="h-2 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-2xl"></div>
                  </div>
                  {/* Laptop Base */}
                  <div className="relative">
                    <div className="h-2 bg-gray-300 rounded-b-lg mx-auto w-[110%] shadow-lg"></div>
                  </div>
                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-blue-200">
                    <span className="text-xs font-bold text-blue-600">Halaman Pembeli</span>
                  </div>
                </div>

                {/* Laptop Mockup 2 - Seller Dashboard */}
                <div className="relative group transform hover:scale-105 transition-transform duration-500 mt-12">
                  <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  {/* Laptop Frame */}
                  <div className="relative bg-gray-900 rounded-t-2xl p-3 shadow-2xl">
                    {/* Laptop Screen */}
                    <div className="bg-white rounded-lg overflow-hidden border-4 border-gray-800">
                      <div className="bg-gray-200 px-3 py-2 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <div className="flex-1 bg-white rounded px-2 py-0.5 text-[8px] text-gray-600">
                          larismanis.com/dashboard-seller
                        </div>
                      </div>
                      {/* Screenshot Content - Seller Dashboard Preview */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 h-64 overflow-hidden">
                        <div className="space-y-3">
                          {/* Dashboard Header */}
                          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 text-white shadow-md">
                            <div className="flex items-center gap-2 mb-2">
                              <Store className="w-4 h-4" />
                              <div className="h-2 bg-white/30 rounded w-24"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white/20 rounded p-1.5 text-center">
                                  <div className="text-xs font-bold">50+</div>
                                  <div className="h-1 bg-white/30 rounded mt-1"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Products Management */}
                          <div className="bg-white rounded-lg p-3 shadow-md space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="h-2 bg-gray-300 rounded w-20"></div>
                              <div className="w-12 h-4 bg-green-500 rounded"></div>
                            </div>
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded p-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-red-200 rounded"></div>
                                <div className="flex-1 space-y-1">
                                  <div className="h-1.5 bg-gray-200 rounded"></div>
                                  <div className="h-1 bg-gray-100 rounded w-2/3"></div>
                                </div>
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Laptop Bottom */}
                    <div className="h-2 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-2xl"></div>
                  </div>
                  {/* Laptop Base */}
                  <div className="relative">
                    <div className="h-2 bg-gray-300 rounded-b-lg mx-auto w-[110%] shadow-lg"></div>
                  </div>
                  {/* Label */}
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-green-200">
                    <span className="text-xs font-bold text-green-600">Dashboard Penjual</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Kenapa Pilih
              </span>
              <span className="text-gray-900"> Laris Manis?</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Platform terlengkap untuk mendukung UMKM lokal dengan fitur-fitur unggulan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="group relative p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl border-2 border-yellow-200 hover:border-orange-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Produk Beragam</h3>
                <p className="text-gray-600 mb-4">Variasi produk dari berbagai kategori UMKM lokal</p>
                <div className="inline-flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-4 transition-all">
                  <span>Jelajahi</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border-2 border-blue-200 hover:border-cyan-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Peta Lokasi</h3>
                <p className="text-gray-600 mb-4">Navigasi interaktif ke toko UMKM terdekat</p>
                <div className="inline-flex items-center gap-2 text-cyan-600 font-semibold group-hover:gap-4 transition-all">
                  <span>Lihat Peta</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl border-2 border-green-200 hover:border-emerald-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Aman & Terpercaya</h3>
                <p className="text-gray-600 mb-4">Verified seller dengan rating dan review asli</p>
                <div className="inline-flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-4 transition-all">
                  <span>Pelajari</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border-2 border-purple-200 hover:border-pink-400 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-bl-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3"> Cepat</h3>
                <p className="text-gray-600 mb-4">Hubungi penjual langsung via WhatsApp</p>
                <div className="inline-flex items-center gap-2 text-pink-600 font-semibold group-hover:gap-4 transition-all">
                  <span>Coba Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Carousel Banner Promo */}
      <section className="relative py-12 px-4 md:px-8 lg:px-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <Carousel items={advertisementBanners} />
        </div>
      </section>

      {/* Chatbot CTA above Search */}
      <section className="relative px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="mb-6 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white">
              <span className="text-sm font-extrabold">LM</span>
              <span className="absolute -top-1 -right-1 text-yellow-300 text-xs">✦</span>
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Tanyakan AI Laris Manis</p>
              <p className="text-sm text-slate-700">Butuh rekomendasi cepat? Tanyakan harga, kalori, atau produk spesifik.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new Event("open-buyer-chatbot"))}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white font-semibold shadow hover:opacity-90"
            >
              Buka Chat
            </button>
          </div>
        </div>
      </section>

      {/* Search Bar + Categories */}
      <section className="relative py-12 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative group max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity"></div>
            <div className="relative bg-white rounded-2xl shadow-xl border-2 border-gray-200 group-hover:border-orange-400 transition-colors overflow-hidden">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Cari produk, toko, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-5 text-gray-800 placeholder-gray-400 focus:outline-none font-semibold text-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-xl"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-black mb-2">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Kategori
              </span>
              <span className="text-gray-900"> Produk</span>
            </h2>
            <p className="text-gray-600">Jelajahi berbagai kategori produk UMKM lokal</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            <button
              onClick={() => setSelectedCategory("")}
              className={`group relative p-6 rounded-2xl transition-all duration-300 ${
                selectedCategory === ""
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white scale-105 shadow-2xl"
                  : "bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-400 hover:scale-105 hover:shadow-lg"
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className={`text-4xl transform group-hover:scale-110 transition-transform ${
                  selectedCategory === "" ? "animate-pulse" : ""
                }`}>
                  🏠
                </div>
                <span className={`text-xs md:text-sm font-bold ${
                  selectedCategory === "" ? "text-white" : "text-gray-700"
                }`}>
                  Semua
                </span>
              </div>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`group relative p-6 rounded-2xl transition-all duration-300 ${
                  selectedCategory === cat.name
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500 text-white scale-105 shadow-2xl"
                    : "bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-400 hover:scale-105 hover:shadow-lg"
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className={`text-4xl transform group-hover:scale-110 group-hover:rotate-6 transition-all ${
                    selectedCategory === cat.name ? "animate-pulse" : ""
                  }`}>
                    {cat.icon}
                  </div>
                  <span className={`text-xs md:text-sm font-bold text-center ${
                    selectedCategory === cat.name ? "text-white" : "text-gray-700"
                  }`}>
                    {cat.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="relative py-16 px-4 md:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-2">
              <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                Produk
              </span>
              <span className="text-gray-900"> Terpopuler</span>
            </h2>
            <p className="text-gray-600">Pilihan terbaik dari UMKM lokal</p>
          </div>
          {filteredProducts.length > 0 && (
            <span className="px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-orange-300 rounded-full text-sm font-bold text-orange-700">
              {filteredProducts.length} produk
            </span>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((product, idx) => (
              <div 
                key={product.id} 
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg border-2 border-gray-200">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg font-semibold">Produk tidak ditemukan</p>
            <p className="text-gray-400 mt-2">Coba kata kunci lain atau pilih kategori berbeda</p>
          </div>
        )}

        {filteredProducts.length > 8 && (
          <div className="text-center mt-10">
            <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <span>Lihat Semua Produk</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Cara Belanja
              </span>
              <span className="text-gray-900"> di Laris Manis</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Proses belanja yang mudah dan cepat hanya dalam 4 langkah
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition"></div>
              <div className="relative bg-white p-8 rounded-3xl border-2 border-blue-200 hover:border-cyan-400 transition-all">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">1</span>
                </div>
                <div className="mt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <Search className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Cari Produk</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Gunakan fitur pencarian atau jelajahi kategori untuk menemukan produk yang Anda inginkan
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition"></div>
              <div className="relative bg-white p-8 rounded-3xl border-2 border-purple-200 hover:border-pink-400 transition-all">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">2</span>
                </div>
                <div className="mt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <Star className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Lihat Detail</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Cek detail produk, harga, rating, dan informasi toko untuk memastikan pilihan Anda
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition"></div>
              <div className="relative bg-white p-8 rounded-3xl border-2 border-orange-200 hover:border-red-400 transition-all">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">3</span>
                </div>
                <div className="mt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <Phone className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Hubungi Penjual</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Klik tombol WhatsApp untuk langsung chat dengan penjual dan tanyakan detail produk
                  </p>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur opacity-25 group-hover:opacity-75 transition"></div>
              <div className="relative bg-white p-8 rounded-3xl border-2 border-green-200 hover:border-emerald-400 transition-all">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-xl">4</span>
                </div>
                <div className="mt-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">Selesai!</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Lakukan transaksi dengan penjual dan terima produk Anda. Jangan lupa beri review!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stores Section */}
      <section className="relative py-16 px-4 md:px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur-xl opacity-30"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                  <Store className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-black">
                  <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    Toko
                  </span>
                  <span className="text-gray-900"> Pilihan</span>
                </h2>
                <p className="text-gray-600">Jelajahi UMKM terbaik di sekitar Anda</p>
              </div>
            </div>

            <Link
              to="/maps"
              className="hidden md:flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
            >
              <span>Lihat Peta</span>
              <MapPin className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stores.slice(0, 8).map((store, idx) => (
              <div 
                key={store.id}
                className="opacity-0 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <StoreCard store={store} index={idx} />
              </div>
            ))}
          </div>

          {/* Store Stats */}
          <div className="p-8 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-3xl border-2 border-green-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {stores.length}+
                </p>
                <p className="text-sm font-semibold text-gray-600 mt-1">Toko Terdaftar</p>
              </div>
              <div>
                <p className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {products.length}+
                </p>
                <p className="text-sm font-semibold text-gray-600 mt-1">Produk Tersedia</p>
              </div>
              <div>
                <p className="text-4xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  4.8⭐
                </p>
                <p className="text-sm font-semibold text-gray-600 mt-1">Rating Rata-rata</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Laris Manis dalam Angka
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Kepercayaan ribuan pengguna adalah bukti komitmen kami
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Stat 1 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-white/30 rounded-3xl blur"></div>
              <div className="relative bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-8 text-center hover:bg-white/20 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-black text-white mb-2">1000+</div>
                <div className="text-white/90 font-semibold">Pembeli Aktif</div>
                <div className="text-white/70 text-sm mt-2">Setiap bulannya</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-white/30 rounded-3xl blur"></div>
              <div className="relative bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-8 text-center hover:bg-white/20 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-black text-white mb-2">500+</div>
                <div className="text-white/90 font-semibold">Produk Dijual</div>
                <div className="text-white/70 text-sm mt-2">Dari berbagai kategori</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-white/30 rounded-3xl blur"></div>
              <div className="relative bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-8 text-center hover:bg-white/20 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-black text-white mb-2">100+</div>
                <div className="text-white/90 font-semibold">Toko UMKM</div>
                <div className="text-white/70 text-sm mt-2">Verified dan terpercaya</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-white/30 rounded-3xl blur"></div>
              <div className="relative bg-white/10 backdrop-blur-lg border-2 border-white/30 rounded-3xl p-8 text-center hover:bg-white/20 transition-all hover:scale-105">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-black text-white mb-2">4.9/5</div>
                <div className="text-white/90 font-semibold">Rating Pengguna</div>
                <div className="text-white/70 text-sm mt-2">Dari 2000+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 md:px-8 lg:px-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-full mb-8">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="text-white font-bold">Bergabung Sekarang!</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Siap Dukung UMKM Lokal?
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Bergabunglah dengan ribuan pengguna yang telah merasakan kemudahan berbelanja 
            dan mendukung ekonomi lokal melalui Laris Manis
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-orange-600 font-black text-lg rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Sparkles className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Daftar Sekarang Gratis!</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-3 px-10 py-5 bg-transparent border-3 border-white text-white font-bold text-lg rounded-2xl hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              <span>Login</span>
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Gratis Tanpa Biaya</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Proses Cepat & Mudah</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Aman & Terpercaya</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 md:px-8 lg:px-12 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-white">Laris Manis</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Platform marketplace yang menghubungkan Anda dengan produk berkualitas dari UMKM lokal. 
                Dukung ekonomi lokal, tingkatkan kesejahteraan bersama!
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Navigasi Cepat</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link to="/maps" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Peta Toko
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Daftar
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold text-lg mb-4">Hubungi Kami</h4>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  Surabaya, Indonesia
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-orange-500" />
                  +62 800-000-0000
                </p>
                <p className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-orange-500" />
                  Dukung UMKM Lokal
                </p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} <span className="text-white font-bold">Laris Manis</span>. 
              All rights reserved. Made with <Heart className="w-4 h-4 inline text-red-500" /> for Indonesian UMKM
            </p>
          </div>
        </div>
      </footer>
      {/* Chatbot floating widget */}
      <BuyerChatBot products={products} />
    </main>
  );
};
