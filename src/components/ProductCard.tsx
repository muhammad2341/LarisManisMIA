import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Phone, MapPin, Zap } from "lucide-react";
import type { Product } from "../types/index";
import { stores } from "../data/dummy";
import { useCart } from "../contexts/CartContext";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useCart();
  const favorite = isFavorite(product.id);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const openWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setIsProcessing(true);

    const store = stores.find((s) => s.id === product.storeId);
    const rawNumber = store?.whatsapp || "";
    const phone = rawNumber.replace(/[^0-9]/g, "");
    const msg = `Halo, saya ingin pesan ${product.name} (1 pcs) dari toko ${store?.name}. Apakah tersedia?`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    setTimeout(() => setIsProcessing(false), 400);
  };

  const discount = product.originalPrice
    ? Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    )
    : 0;

  return (
    <div className="card-futuristic overflow-hidden group">
      {/* Image Container with Overlay */}
      <div className="relative overflow-hidden h-56 bg-gradient-to-br from-slate-100 to-slate-50">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-30 grid-background"></div>

        <img
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Discount Badge with Glow */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 animate-pulse-glow">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1">
                <Zap className="w-4 h-4" />
                -{discount}%
              </div>
            </div>
          </div>
        )}

        {/* Favorite Button with Glow Effect */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-3 glass rounded-2xl hover-glow transition-all duration-300 transform hover:scale-110"
          aria-pressed={favorite}
          aria-label={favorite ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${favorite
                ? "fill-red-500 text-red-500 scale-110"
                : "text-slate-400 hover:text-red-500"
              }`}
          />
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/95 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link
            to={`/product/${product.id}`}
            className="block w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center font-semibold rounded-xl hover:shadow-lg transition-all"
          >
            Lihat Detail
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 text-xs font-bold rounded-full border border-blue-200">
            {product.category}
          </span>
          <span className="text-xs text-slate-400">{product.storeName}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-slate-800 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating with Stars */}
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-200"
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-500 font-semibold">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Price Section */}
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Rp {product.price.toLocaleString("id-ID")}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-slate-400 line-through">
              Rp {product.originalPrice.toLocaleString("id-ID")}
            </span>
          )}
        </div>

        {/* Stock/Availability Info */}
        {product.category === "Makanan" || product.category === "Minuman" ? (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.isAvailable ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-bold ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              {product.isAvailable ? "Tersedia" : "Tidak Tersedia"}
            </span>
          </div>
        ) : (
          product.stock !== undefined && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} tersisa` : "Habis"}
              </span>
            </div>
          )
        )}

        {/* Action Buttons with Gradient */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={openWhatsApp}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            aria-busy={isProcessing}
            aria-label={`Hubungi penjual ${product.storeName} via WhatsApp untuk ${product.name}`}
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">WhatsApp</span>
          </button>

          <Link
            to={`/maps?storeId=${encodeURIComponent(product.storeId)}`}
            className="flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
            aria-label={`Lihat lokasi toko ${product.storeName} pada peta`}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Lokasi</span>
          </Link>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </div>
  );
};