import React from 'react';

export default function Navbar({ cartCount, onOpenCart }) {
  return (
    <nav className="bg-slate-900 text-white p-4 flex justify-between items-center px-8 shadow-md">
      <h1 className="text-xl font-bold">La Trocha Market</h1>
      <button
        onClick={onOpenCart}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <span>🛒</span>
        <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
          {cartCount}
        </span>
      </button>
    </nav>
  );
}