import React from 'react';

export default function CartModal({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemove,
  total,
  totalUnits,
  onDownloadReceipt
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 relative max-h-[90vh] flex flex-col">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Carrito de Compras ({totalUnits})</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500 my-8 text-center">El carrito está vacío.</p>
        ) : (
          <div className="overflow-y-auto flex-1 my-4 space-y-4 pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-semibold">{item.nombre || item.name}</p>
                  <p className="text-sm text-gray-600">${item.precio || item.price} c/u</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQty(item.id, item.qty - 1)}
                    className="px-2 py-1 bg-gray-200 rounded font-bold hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="px-2">{item.qty}</span>
                  <button
                    onClick={() => onUpdateQty(item.id, item.qty + 1)}
                    className="px-2 py-1 bg-gray-200 rounded font-bold hover:bg-gray-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="ml-2 text-red-500 hover:text-red-700 font-semibold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="border-t pt-4 mt-auto">
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onDownloadReceipt}
              disabled={cart.length === 0}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-300"
            >
              Descargar Recibo
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}