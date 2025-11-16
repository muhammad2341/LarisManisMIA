import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Phone, Clock, TrendingUp } from "lucide-react";
import type { Store } from "../types";

interface StoreCardProps {
  store: Store;
  index: number;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, index }) => {
  return (
    <Link
      to={`/store/${store.id}`}
      className="card-futuristic overflow-hidden group animate-scale-in"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image Container with Enhanced Overlay */}
      <div className="relative overflow-hidden h-56 bg-gradient-to-br from-slate-100 to-slate-50">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-20 grid-background"></div>
        
        <img
          src={store.image}
          alt={store.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Category Badge with Glow */}
        {store.category && (
          <div className="absolute top-3 right-3 animate-pulse-glow">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full blur-lg opacity-50"></div>
              <div className="relative glass px-3 py-1 rounded-full backdrop-blur-md">
                <span className="text-xs font-bold text-white">{store.category}</span>
              </div>
            </div>
          </div>
        )}

        {/* Trending Badge (for high rated stores) */}
        {store.rating >= 4.5 && (
          <div className="absolute top-3 left-3">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500 rounded-full blur-lg opacity-50"></div>
              <div className="relative bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full flex items-center gap-1">
                <TrendingUp size={14} className="text-white" />
                <span className="text-xs font-bold text-white">Populer</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white/95 to-transparent p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-slate-600">
              <Clock size={14} />
              <span className="font-semibold">
                {store.openingTime && store.closingTime 
                  ? `${store.openingTime} - ${store.closingTime}`
                  : "Buka Setiap Hari"}
              </span>
            </div>
            <div className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">
              {store.products?.length || 0} Produk
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Store Name */}
        <h3 className="font-bold text-slate-800 text-lg line-clamp-2 h-14 group-hover:text-blue-600 transition-colors">
          {store.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 h-10">
          {store.description}
        </p>

        {/* Rating with Stars */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(store.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-700 font-bold">
              {store.rating}
            </span>
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            {store.products?.length || 0} item
          </span>
        </div>

        {/* Location Info */}
        <div className="flex items-start gap-2 pt-2 border-t border-slate-100">
          <MapPin size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-600 line-clamp-1 flex-1">
            {store.address}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <a
            href={`https://wa.me/${store.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <Phone className="w-4 h-4" />
            <span className="text-sm">Chat</span>
          </a>

          <Link
            to={`/maps?storeId=${store.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Lokasi</span>
          </Link>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </Link>
  );
};