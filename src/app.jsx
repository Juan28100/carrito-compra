import React, { useState } from 'react';
import { PRODUCTOS } from './data/product';

import Navbar from './componentes/Navbar';
import Hero from './componentes/hero';
import ProductList from './componentes/producLits';
import CartModal from './componentes/CartModal';
import ToastContainer from './componentes/toast';

export function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Funciones de gestión del carrito
  const showToast = (message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prevCart, { ...product, qty: quantity }];
    });
    showToast(`Agregado al carrito: ${product.name || product.nombre || 'Producto'}`);
  };

  const handleUpdateQuantity = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, qty: newQty } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.price || item.precio || 0) * item.qty,
    0
  );

  const totalUnits = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleDownloadReceipt = () => {
    alert('Descargando recibo...');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        cartCount={totalUnits}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <Hero />

      <main className="max-w-7xl mx-auto py-8 px-4">
        <ProductList
          products={PRODUCTOS}
          onAddToCart={handleAddToCart}
        />
      </main>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateQuantity}
        onRemove={handleRemoveFromCart}
        total={totalPrice}
        totalUnits={totalUnits}
        showToast={showToast}
        onDownloadReceipt={handleDownloadReceipt}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;