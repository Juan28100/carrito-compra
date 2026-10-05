import React, { useState, useEffect } from "react";
import { PRODUCTOS } from "./data/product";

import Navbar from "./componentes/Navbar";
import Hero from "./componentes/hero";
import ProductList from "./componentes/producLits";
import CartModal from "./componentes/CartModal";
import ToastContainer from "./componentes/toast";

export function App() {
  // Cargar el carrito guardado previamente en localStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart_items");
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Guardar cambios en el carrito en localStorage
  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(cart));
  }, [cart]);

  // Mostrar notificaciones flotantes (Toasts)
  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => removeToast(id), 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Agregar un producto al carrito verificando stock
  const handleAddToCart = (product, quantity) => {
    const currentInCart = cart.find((item) => item.id === product.id)?.qty || 0;

    if (currentInCart + quantity > product.stock) {
      showToast(`⚠️ No hay más stock disponible de ${product.nombre}`);
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prevCart, { ...product, qty: quantity }];
    });

    showToast(`✅ Agregado: ${product.nombre}`);
  };

  // Modificar la cantidad desde el modal controlando el límite de stock
  const handleUpdateQuantity = (product, newQty) => {
    // Si intenta subir más del stock disponible, detenemos la acción
    if (newQty > product.stock) {
      showToast(`⚠️ Solo hay ${product.stock} unidades disponibles de ${product.nombre}`);
      return;
    }

    // Si baja a 0 o menos, lo eliminamos del carrito
    if (newQty <= 0) {
      handleRemoveFromCart(product.id);
      return;
    }

    // Actualizamos la cantidad en el carrito
    setCart((prev) =>
      prev.map((item) => (item.id === product.id ? { ...item, qty: newQty } : item))
    );
  };

  // Eliminar un producto por su ID
  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast("🗑️ Producto eliminado del carrito");
  };

  // Vaciar el carrito completamente
  const handleClearCart = () => {
    setCart([]);
    showToast("🧹 Carrito vaciado");
  };

  // Cálculos de totales
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.precio || 0) * item.qty,
    0
  );

  const totalUnits = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar cartCount={totalUnits} onOpenCart={() => setIsCartOpen(true)} />

      <Hero />

      <main className="max-w-7xl mx-auto py-8 px-4">
        <ProductList products={PRODUCTOS} onAddToCart={handleAddToCart} />
      </main>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        onClearCart={handleClearCart}
        total={totalPrice}
        totalUnits={totalUnits}
        showToast={showToast}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;