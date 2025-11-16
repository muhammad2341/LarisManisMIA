import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, Package, ChevronLeft, Clock } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

export const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart, createOrder } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTimeSlot, setPickupTimeSlot] = useState("");
  
  // Generate time slots (9 AM - 8 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(time);
    }
    return slots;
  };
  
  const timeSlots = generateTimeSlots();
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const handleCheckout = () => {
    if (!user) {
      alert("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    if (!pickupDate || !pickupTimeSlot) {
      alert("Silakan pilih tanggal dan jam pengambilan!");
      return;
    }

    // Group items by store
    const itemsByStore = cart.reduce((acc, item) => {
      const storeId = item.product.storeId;
      if (!acc[storeId]) {
        acc[storeId] = {
          storeName: item.product.storeName,
          items: [],
        };
      }
      acc[storeId].items.push(item);
      return acc;
    }, {} as Record<string, { storeName: string; items: typeof cart }>);

    // Create orders for each store
    const pickupDateTime = `${pickupDate} ${pickupTimeSlot}`;
    
    const orderIds = Object.entries(itemsByStore).map(([storeId, data]) => {
      return createOrder(storeId, data.storeName, data.items, pickupDateTime);
    });

    clearCart();
    alert(`Pesanan berhasil dibuat!\n\nID Pesanan: ${orderIds.join(", ")}\n\nSilakan datang ke toko pada:\n${new Date(pickupDateTime).toLocaleString('id-ID')}\n\nPembayaran dilakukan saat pengambilan (COD).`);
    navigate("/orders");
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Keranjang Kosong
          </h2>
          <p className="text-gray-600 mb-6">
            Belum ada produk yang ditambahkan ke keranjang
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-green-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
          >
            Belanja Sekarang
          </button>
        </div>
      </main>
    );
  }

  // Group items by store for display
  const itemsByStore = cart.reduce((acc, item) => {
    const storeId = item.product.storeId;
    if (!acc[storeId]) {
      acc[storeId] = {
        storeName: item.product.storeName,
        items: [],
      };
    }
    acc[storeId].items.push(item);
    return acc;
  }, {} as Record<string, { storeName: string; items: typeof cart }>);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
        >
          <ChevronLeft size={20} />
          <span>Kembali</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingCart size={32} className="text-green-600" />
            Pesan & Ambil di Toko
          </h1>
          <p className="text-gray-600 mt-2">
            📦 Pesan sekarang → 📅 Pilih waktu pengambilan tunai saat ambil barang (COD)
          </p>
          <p className="text-gray-600 mt-2">
            📦 Pesan sekarang → 📅 Pilih waktu pengambilan tunai saat ambil barang (COD)
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(itemsByStore).map(([storeId, data]) => (
              <div key={storeId} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b-2 border-gray-200">
                  <Package className="text-green-600" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">{data.storeName}</h3>
                </div>

                <div className="space-y-4">
                  {data.items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.category}</p>
                        <p className="text-lg font-bold text-green-600 mt-2">
                          Rp {item.product.price.toLocaleString("id-ID")}
                        </p>
                        {item.notes && (
                          <p className="text-sm text-gray-500 italic mt-1">
                            Catatan: {item.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={20} />
                        </button>
                        <div className="flex items-center gap-2 bg-white border-2 border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 transition"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                          Subtotal: Rp{" "}
                          {(item.product.price * item.quantity).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Ringkasan Pesanan
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Total Item</span>
                  <span className="font-semibold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} item
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Jumlah Toko</span>
                  <span className="font-semibold">
                    {Object.keys(itemsByStore).length} toko
                  </span>
                </div>
                <div className="border-t-2 border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-green-600">
                      Rp {getCartTotal().toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pickup Date & Time */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock size={18} />
                  Waktu Pengambilan (Opsional)
                </label>
                
                {/* Date Picker */}
                <input
                  type="date"
                  value={pickupDate}
                  min={tomorrow}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 mb-3"
                  placeholder="Pilih tanggal"
                  required
                />
                
                {/* Time Slot Picker */}
                {pickupDate && (
                  <div>
                    <p className="text-xs text-gray-600 mb-2 font-semibold">Pilih Jam Pengambilan:</p>
                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setPickupTimeSlot(slot)}
                          className={`py-2 px-3 text-sm font-semibold rounded-lg transition ${
                            pickupTimeSlot === slot
                              ? "bg-green-500 text-white"
                              : "bg-white border-2 border-gray-300 text-gray-700 hover:border-green-400"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {pickupDate && pickupTimeSlot && (
                  <div className="mt-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                    <p className="text-sm text-green-900 font-semibold">
                      ✓ Waktu pengambilan: {new Date(pickupDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} jam {pickupTimeSlot}
                    </p>
                    <p className="text-xs text-orange-700 font-semibold mt-1">
                      ⚠️ Pembayaran hanya bisa dilakukan pada atau setelah waktu ini
                    </p>
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  💡 Pilih tanggal & jam kapan Anda bisa mengambil barang di toko (minimal besok)
                </p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-green-500 text-white font-bold rounded-lg hover:shadow-lg transition mb-3"
              >
                🛒 Konfirmasi Pesanan
              </button>

              <button
                onClick={clearCart}
                className="w-full py-2 border-2 border-red-500 text-red-500 font-semibold rounded-lg hover:bg-red-50 transition"
              >
                Kosongkan Keranjang
              </button>

              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  ℹ️ Cara Pesan & Ambil (COD):
                </p>
                <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Pilih tanggal & jam pengambilan</li>
                  <li>Klik "🛒 Konfirmasi Pesanan"</li>
                  <li>Pesanan akan dikonfirmasi via WhatsApp</li>
                  <li>Datang ke toko sesuai waktu yang dipilih</li>
                  <li>Bayar tunai saat mengambil barang (COD)</li>
                </ol>
                <p className="text-xs text-orange-800 font-semibold mt-2">
                  ⚠️ Penting: Pembayaran hanya dapat dilakukan pada atau setelah waktu pengambilan yang ditentukan!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
