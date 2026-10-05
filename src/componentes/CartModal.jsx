import React from 'react';

export default function CartModal({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemove,
  onClearCart,
  total,
  totalUnits,
  showToast
}) {
  if (!isOpen) return null;

  // Función para descargar el recibo en PDF usando html2pdf
  const handleDownloadReceipt = () => {
    if (cart.length === 0) {
      showToast?.("⚠️ El carrito está vacío");
      return;
    }

    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontFamily = "Arial, sans-serif";

    const fecha = new Date().toLocaleString();
    let contenidoHtml = `
      <h2 style="text-align: center; margin-bottom: 5px;">Recibo de Compra</h2>
      <p style="text-align: center; color: #666; margin-bottom: 20px;">Fecha: ${fecha}</p>
      <hr style="border: none; border-top: 1px solid #ccc; margin-bottom: 15px;" />
      <table style="width: 100%; text-align: left; border-collapse: collapse;">
        <thead>
          <tr style="border-bottom: 2px solid #333;">
            <th style="padding: 8px 0;">Producto</th>
            <th style="padding: 8px 0; text-align: center;">Cant.</th>
            <th style="padding: 8px 0; text-align: right;">Precio U.</th>
            <th style="padding: 8px 0; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
    `;

    cart.forEach((item) => {
      const subtotal = item.precio * item.qty;
      contenidoHtml += `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding: 8px 0;">${item.nombre}</td>
          <td style="padding: 8px 0; text-align: center;">${item.qty}</td>
          <td style="padding: 8px 0; text-align: right;">$${item.precio}</td>
          <td style="padding: 8px 0; text-align: right;">$${subtotal}</td>
        </tr>
      `;
    });

    contenidoHtml += `
        </tbody>
      </table>
      <hr style="border: none; border-top: 2px solid #333; margin-top: 15px; margin-bottom: 15px;" />
      <div style="display: flex; justify-space-between: space-between; font-size: 18px; font-weight: bold;">
        <span>Total Unidades: ${totalUnits}</span>
        <span style="float: right;">Total Pagar: $${total.toFixed(2)}</span>
      </div>
    `;

    element.innerHTML = contenidoHtml;

    const opt = {
      margin: 10,
      filename: `recibo_compra_${Date.now()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    if (window.html2pdf) {
      window.html2pdf().set(opt).from(element).save();
      showToast?.("📄 Descargando recibo...");
    } else {
      showToast?.("⚠️ La librería html2pdf no está disponible");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Encabezado del Modal */}
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            Carrito de Compras ({totalUnits})
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 text-xl font-bold px-2"
          >
            ✕
          </button>
        </div>

        {/* Lista de productos en el carrito */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-slate-100">
          {cart.length === 0 ? (
            <p className="text-center text-slate-500 py-8">
              El carrito está vacío.
            </p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="py-3 flex items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{item.nombre}</h4>
                  <p className="text-sm text-slate-500">${item.precio} c/u</p>
                </div>

                {/* Controles de cantidad con verificación de stock */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQty(item, item.qty - 1)}
                    className="w-8 h-8 bg-slate-200 hover:bg-slate-300 font-bold rounded flex items-center justify-center transition"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">
                    {item.qty}
                  </span>
                  <button
                    onClick={() => onUpdateQty(item, item.qty + 1)}
                    className="w-8 h-8 bg-slate-200 hover:bg-slate-300 font-bold rounded flex items-center justify-center transition"
                  >
                    +
                  </button>
                </div>

                {/* Botón para eliminar */}
                <button
                  onClick={() => onRemove(item.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-semibold transition"
                >
                  Eliminar
                </button>
              </div>
            ))
          )}
        </div>

        {/* Pie del Modal con resumen y acciones */}
        <div className="p-4 border-t bg-slate-50 flex flex-col gap-3">
          <div className="flex justify-between items-center text-lg font-bold text-slate-800">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadReceipt}
              disabled={cart.length === 0}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Descargar Recibo
            </button>
            <button
              onClick={onClose}
              className="px-4 bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold py-2 rounded transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}