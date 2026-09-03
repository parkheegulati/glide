import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const STORAGE_KEY = "glide_cart_v1";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  const addToCart = (product, variant, emiPlan) => {
    setCart((prev) => {
      // Find if this variant is already in cart
      const existingIdx = prev.findIndex((item) => item.variant.id === variant.id);
      if (existingIdx > -1) {
        // Update EMI plan / quantity
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          emiPlan,
          quantity: updated[existingIdx].quantity + 1,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: `${variant.id}-${Date.now()}`,
          product: {
            id: product.id,
            slug: product.slug,
            name: product.name,
            brand: product.brand,
            category: product.category,
          },
          variant: {
            id: variant.id,
            variantLabel: variant.variantLabel,
            storage: variant.storage,
            color: variant.color,
            colorHex: variant.colorHex,
            price: Number(variant.price),
            mrp: Number(variant.mrp),
            imageUrl: variant.imageUrl,
          },
          emiPlan: {
            id: emiPlan.id,
            tenureMonths: Number(emiPlan.tenureMonths),
            monthlyAmount: Number(emiPlan.monthlyAmount),
            interestRate: Number(emiPlan.interestRate),
            cashbackAmount: Number(emiPlan.cashbackAmount || 7500),
            fundName: emiPlan.fundName,
          },
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateItemPlan = (itemId, newEmiPlan) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              emiPlan: {
                id: newEmiPlan.id,
                tenureMonths: Number(newEmiPlan.tenureMonths),
                monthlyAmount: Number(newEmiPlan.monthlyAmount),
                interestRate: Number(newEmiPlan.interestRate),
                cashbackAmount: Number(newEmiPlan.cashbackAmount || 7500),
                fundName: newEmiPlan.fundName,
              },
            }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalDeviceValue = cart.reduce(
    (acc, item) => acc + item.variant.price * item.quantity,
    0
  );
  const totalMonthlyOutflow = cart.reduce(
    (acc, item) => acc + item.emiPlan.monthlyAmount * item.quantity,
    0
  );
  const totalCashback = cart.reduce(
    (acc, item) => acc + item.emiPlan.cashbackAmount * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        totalDeviceValue,
        totalMonthlyOutflow,
        totalCashback,
        addToCart,
        removeFromCart,
        updateItemPlan,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
