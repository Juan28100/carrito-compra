import React from 'react';

export default function ProductList({ products, onAddToCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-4">
      {products.map((p) => (
        <div key={p.id} className="bg-white rounded-lg shadow p-4 flex flex-col justify-between">
          <img src={p.imagen} alt={p.nombre} className="w-full h-40 object-cover mb-4 rounded" />
          <h3 className="font-bold text-lg mb-1">{p.nombre}</h3>
          <p className="text-gray-700 font-semibold mb-4">${p.precio.toFixed(2)}</p>
          <button
            onClick={() => onAddToCart(p, 1)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Agregar al Carrito
          </button>
        </div>
      ))}
    </div>
  );
}