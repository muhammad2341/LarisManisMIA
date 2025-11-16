import React, { createContext, useContext, useState, useEffect } from "react";
import type { Product, Store } from "../types";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "buyer" | "seller";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, password: string, role: "buyer" | "seller") => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isBuyer: boolean;
  isSeller: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("umkm_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setHydrated(true);
  }, []);

  const register = (name: string, email: string, phone: string, password: string, role: "buyer" | "seller"): boolean => {
    try {
      // Trim whitespace from inputs
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();
      const trimmedName = name.trim();
      const trimmedPhone = phone.trim();

      // Get existing users from localStorage
      const usersData = localStorage.getItem("umkm_users");
      const users = usersData ? JSON.parse(usersData) : [];

      // Check if email already exists
      if (users.some((u: any) => u.email === trimmedEmail)) {
        alert("Email sudah terdaftar!");
        return false;
      }

      // Optionally create a default store for sellers
      let storeId: string | undefined;
      if (role === "seller") {
        storeId = `store-${Date.now()}`;

        const newStore: Store = {
          id: storeId,
          name: `Toko ${trimmedName}`,
          image: "",
          description: "Perbarui deskripsi toko Anda di halaman Info Toko.",
          category: "",
          address: "",
          whatsapp: trimmedPhone || "",
          mapUrl: "",
          rating: 0,
          products: [] as Product[],
          openingTime: "",
          closingTime: "",
        };

        const existingStores = JSON.parse(localStorage.getItem("seller_stores") || "{}");
        existingStores[storeId] = newStore;
        localStorage.setItem("seller_stores", JSON.stringify(existingStores));

        const existingProducts = JSON.parse(localStorage.getItem("seller_products") || "{}");
        existingProducts[storeId] = [];
        localStorage.setItem("seller_products", JSON.stringify(existingProducts));
      }

      // Create new user
      const newUser: any = {
        id: Date.now().toString(),
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        password: trimmedPassword, // In production, this should be hashed!
        role,
      };
      if (storeId) newUser.storeId = storeId;

      console.log("✅ Register success:", { email: trimmedEmail, role });

      // Save to users list
      users.push(newUser);
      localStorage.setItem("umkm_users", JSON.stringify(users));

      // Auto login after register
      const userWithoutPassword: any = { id: newUser.id, name: trimmedName, email: trimmedEmail, phone: trimmedPhone, role };
      if (storeId) userWithoutPassword.storeId = storeId;
      setUser(userWithoutPassword);
      localStorage.setItem("umkm_user", JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const login = (email: string, password: string): boolean => {
    try {
      // Trim whitespace from inputs
      const trimmedEmail = email.trim().toLowerCase();
      const trimmedPassword = password.trim();

      // Get users from localStorage
      const usersData = localStorage.getItem("umkm_users");
      const users = usersData ? JSON.parse(usersData) : [];

      console.log("🔍 Login attempt:", { email: trimmedEmail });
      console.log("📋 Available users:", users.map((u: any) => ({ email: u.email, role: u.role })));

      // Find user
      const foundUser = users.find(
        (u: any) => u.email === trimmedEmail && u.password === trimmedPassword
      );

      if (!foundUser) {
        console.log("❌ Login failed: User not found or wrong password");
        alert("Email atau password salah!");
        return false;
      }

      console.log("✅ Login success:", { email: trimmedEmail, role: foundUser.role });

      // Set user (without password)
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        role: foundUser.role || "buyer", // Default to buyer for old accounts
      };
      setUser(userWithoutPassword);
      localStorage.setItem("umkm_user", JSON.stringify(userWithoutPassword));

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("umkm_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isBuyer: user?.role === "buyer",
        isSeller: user?.role === "seller",
        // @ts-expect-error expose hydrated flag for route guards
        hydrated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
