"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, MapPin, Phone, Star, ChevronLeft, Ruler, X } from "lucide-react";
import { products as dummyProducts, stores } from "../data/dummy";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import type { Product } from "../types";

export const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addToFavorites, removeFromFavorites } = useCart();
  const { user } = useAuth();
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  // Load product from localStorage or dummy data
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("seller_products") || "{}");
    
    // Collect all seller products
    const sellerProducts: Product[] = [];
    Object.keys(savedProducts).forEach((storeId) => {
      sellerProducts.push(...savedProducts[storeId]);
    });

    // Merge with dummy products
    const allProducts = [...dummyProducts];
    sellerProducts.forEach((sellerProduct) => {
      const existingIndex = allProducts.findIndex((p) => p.id === sellerProduct.id);
      if (existingIndex >= 0) {
        allProducts[existingIndex] = sellerProduct;
      } else {
        allProducts.push(sellerProduct);
      }
    });

    const foundProduct = allProducts.find((p) => p.id === id);
    setProduct(foundProduct || null);
  }, [id]);

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Produk tidak ditemukan</p>
          <Link
            to="/"
            className="text-green-600 font-semibold hover:text-green-700"
          >
            Kembali ke beranda
          </Link>
        </div>
      </main>
    );
  }

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  const openWhatsApp = (withSize: boolean) => {
    if (isProcessing) return;
    setIsProcessing(true);
    const store = stores.find((s) => s.id === product.storeId);
    const rawNumber = store?.whatsapp || "";
    const phone = rawNumber.replace(/[^0-9]/g, "");
    const sizeInfo = withSize && selectedSize ? `, Ukuran: ${selectedSize}` : "";
    const msg = `Halo, saya ingin pesan ${product.name}${sizeInfo} dari toko ${store?.name}. Apakah tersedia?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setTimeout(() => setIsProcessing(false), 400);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ChevronLeft size={20} />
          <span>Kembali</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-lg">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="bg-gray-100 rounded-xl overflow-hidden h-96 md:h-full flex items-center justify-center">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Info */}
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 bg-gray-100 rounded-lg cursor-pointer hover:border-2 hover:border-green-500 transition"
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={`View ${i}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Category */}
            <div>
              <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                {product.category}
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600">{product.storeName}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={
                      i < Math.floor(product.rating)
                        ? "fill-current"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.reviews} ulasan)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-green-600">
                  Rp {product.price.toLocaleString("id-ID")}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      Rp {product.originalPrice.toLocaleString("id-ID")}
                    </span>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg font-bold">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Deskripsi Produk</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Bahan-bahan</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition Info */}
            {product.nutritionInfo && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-xl">🍽️</span>
                  Informasi Nutrisi (per porsi)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <p className="text-2xl font-bold text-orange-600">{product.nutritionInfo.calories}</p>
                    <p className="text-xs text-gray-600 mt-1">Kalori</p>
                  </div>
                  {product.nutritionInfo.protein && (
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <p className="text-2xl font-bold text-blue-600">{product.nutritionInfo.protein}</p>
                      <p className="text-xs text-gray-600 mt-1">Protein</p>
                    </div>
                  )}
                  {product.nutritionInfo.carbs && (
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <p className="text-2xl font-bold text-yellow-600">{product.nutritionInfo.carbs}</p>
                      <p className="text-xs text-gray-600 mt-1">Karbohidrat</p>
                    </div>
                  )}
                  {product.nutritionInfo.fat && (
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <p className="text-2xl font-bold text-red-600">{product.nutritionInfo.fat}</p>
                      <p className="text-xs text-gray-600 mt-1">Lemak</p>
                    </div>
                  )}
                  {product.nutritionInfo.fiber && (
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <p className="text-2xl font-bold text-green-600">{product.nutritionInfo.fiber}</p>
                      <p className="text-xs text-gray-600 mt-1">Serat</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Quantity removed as requested */}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  if (!user) {
                    alert("Silakan login terlebih dahulu!");
                    navigate("/login");
                    return;
                  }
                  if (isFavorite(product.id)) {
                    removeFromFavorites(product.id);
                  } else {
                    addToFavorites(product);
                  }
                }}
                className="flex-1 flex items-center justify-center space-x-2 py-3 border-2 border-gray-300 rounded-lg hover:border-red-500 transition font-semibold text-gray-700 hover:text-red-500"
              >
                <Heart
                  size={20}
                  className={isFavorite(product.id) ? "fill-current text-red-500" : ""}
                />
                <span>{isFavorite(product.id) ? "Hapus Simpanan" : "Simpan Dulu!"}</span>
              </button>
              
              <button
                onClick={() => {
                  if (!user) {
                    alert("Silakan login terlebih dahulu!");
                    navigate("/login");
                    return;
                  }
                  if (product.category === "Fashion" && product.availableSizes && product.availableSizes.length > 0) {
                    setShowSizeModal(true);
                  } else {
                    openWhatsApp(false);
                  }
                }}
                className="flex-1 flex items-center justify-center space-x-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                disabled={isProcessing}
              >
                <Phone size={20} />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Size Selection Modal */}
            {showSizeModal && product.availableSizes && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Pilih Ukuran</h3>
                    <button
                      onClick={() => {
                        setShowSizeModal(false);
                        setSelectedSize("");
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full transition"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Size Buttons */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {product.availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-4 font-bold rounded-lg border-2 transition ${
                          selectedSize === size
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Size Chart */}
                  {product.sizeChart && product.sizeChart.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Ruler size={18} />
                        Panduan Ukuran (cm)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-300 px-2 py-1">Ukuran</th>
                              {product.sizeChart[0].chest && <th className="border border-gray-300 px-2 py-1">Dada</th>}
                              {product.sizeChart[0].waist && <th className="border border-gray-300 px-2 py-1">Pinggang</th>}
                              {product.sizeChart[0].hips && <th className="border border-gray-300 px-2 py-1">Pinggul</th>}
                              {product.sizeChart[0].length && <th className="border border-gray-300 px-2 py-1">Panjang</th>}
                              {product.sizeChart[0].shoulder && <th className="border border-gray-300 px-2 py-1">Bahu</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {product.sizeChart.map((chart) => (
                              <tr key={chart.size}>
                                <td className="border border-gray-300 px-2 py-1 font-semibold text-center">{chart.size}</td>
                                {chart.chest && <td className="border border-gray-300 px-2 py-1 text-center">{chart.chest}</td>}
                                {chart.waist && <td className="border border-gray-300 px-2 py-1 text-center">{chart.waist}</td>}
                                {chart.hips && <td className="border border-gray-300 px-2 py-1 text-center">{chart.hips}</td>}
                                {chart.length && <td className="border border-gray-300 px-2 py-1 text-center">{chart.length}</td>}
                                {chart.shoulder && <td className="border border-gray-300 px-2 py-1 text-center">{chart.shoulder}</td>}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-900">
                      💡 <strong>Tips:</strong> Ukur badan Anda dan cocokkan dengan tabel ukuran di atas untuk hasil terbaik.
                    </p>
                  </div>

                  {/* Confirm Button - open WhatsApp with size */}
                  <button
                    onClick={() => {
                      if (!selectedSize) {
                        alert("Pilih ukuran terlebih dahulu!");
                        return;
                      }
                      openWhatsApp(true);
                      setShowSizeModal(false);
                      setSelectedSize("");
                    }}
                    className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            )}

            {/* Store Section */}
            <div className="bg-gradient-to-r from-yellow-50 to-green-50 p-6 rounded-xl border-2 border-yellow-200">
              <h3 className="font-bold text-gray-900 mb-4">Informasi Toko</h3>
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">
                  {product.storeName}
                </p>
                <div className="flex items-start space-x-2">
                  <MapPin
                    size={20}
                    className="text-green-600 mt-1 flex-shrink-0"
                  />
                  <p className="text-gray-600 text-sm">
                    Jl. Merdeka No. 123, Jakarta Pusat
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Phone
                    size={20}
                    className="text-green-600 mt-1 flex-shrink-0"
                  />
                  <p className="text-gray-600 text-sm">+62 812 345 678</p>
                </div>
                <Link
                  to={`/store/${product.storeId}`}
                  className="block text-center mt-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Lihat Toko
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
