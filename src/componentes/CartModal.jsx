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
    element.style.padding = "24px";
    element.style.fontFamily = "system-ui, -apple-system, sans-serif";

    const fecha = new Date().toLocaleString();
    let contenidoHtml = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; color: #0f172a; font-size: 24px;">La Trocha Market</h2>
        <p style="margin: 4px 0 0; color: #64748b; font-size: 14px;">Recibo de Compra</p>
        <p style="margin: 2px 0 0; color: #94a3b8; font-size: 12px;">Fecha: ${fecha}</p>
      </div>
      <hr style="border: none; border-top: 1px border-slate-200; margin-bottom: 20px;" />
      <table style="width: 100%; text-align: left; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0; color: #475569;">
            <th style="padding: 10px 0;">Producto</th>
            <th style="padding: 10px 0; text-align: center;">Cant.</th>
            <th style="padding: 10px 0; text-align: right;">Precio U.</th>
            <th style="padding: 10px 0; text-align: right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
    `;

    cart.forEach((item) => {
      const subtotal = item.precio * item.qty;
      contenidoHtml += `
        <tr style="border-bottom: 1px solid #f1f5f9; color: #1e293b;">
          <td style="padding: 12px 0;"><strong>${item.nombre}</strong></td>
          <td style="padding: 12px 0; text-align: center;">${item.qty}</td>
          <td style="padding: 12px 0; text-align: right;">$${item.precio.toLocaleString()}</td>
          <td style="padding: 12px 0; text-align: right;">$${subtotal.toLocaleString()}</td>
        </tr>
      `;
    });

    contenidoHtml += `
        </tbody>
      </table>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #0f172a; display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #0f172a;">
        <span>Total Unidades: ${totalUnits}</span>
        <span style="float: right;">Total Pagar: $${total.toLocaleString('es-CO')}</span>
      </div>
    `;

    element.innerHTML = contenidoHtml;

    const opt = {
      margin: 10,
      filename: `recibo_${Date.now()}.pdf`,
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
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Fondo oscuro traslúcido */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        {/* Panel Deslizable Lateral */}
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Encabezado */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold">Tu Carrito</h2>
                <p className="text-xs text-slate-400">{totalUnits} {totalUnits === 1 ? 'producto' : 'productos'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1 rounded hover:bg-slate-800 transition"
                  title="Vaciar carrito"
                >
                  Vaciar
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Cuerpo del Carrito */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-slate-200/60 rounded-full flex items-center justify-center mb-4 text-slate-400">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-700 text-lg">El carrito está vacío</h3>
                <p className="text-slate-400 text-sm mt-1 max-w-[200px]">Añade algunos productos típicos para comenzar tu compra.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex gap-3.5 items-center hover:border-slate-300 transition"
                >
                  {/* Imagen Miniatura */}
                  {item.imagen && (
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-16 h-16 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                    />
                  )}

                  {/* Info Producto */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-800 text-sm truncate">{item.nombre}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">${item.precio?.toLocaleString()} c/u</p>
                    <p className="text-sm font-bold text-emerald-600 mt-1">
                      ${(item.precio * item.qty).toLocaleString()}
                    </p>
                  </div>

                  {/* Controles de Cantidad */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-slate-400 hover:text-red-500 transition p-0.5"
                      title="Eliminar producto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => onUpdateQty(item, item.qty - 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs transition"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-slate-800">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item, item.qty + 1)}
                        className="px-2 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs transition"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pie del Carrito */}
          <div className="p-5 border-t border-slate-200 bg-white shadow-lg space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-500 text-sm">
                <span>Subtotal</span>
                <span>${total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-slate-900 pt-1 border-t border-slate-100">
                <span>Total Pagar:</span>
                <span className="text-xl text-emerald-600">${total.toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={handleDownloadReceipt}
                disabled={cart.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar Recibo (PDF)
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}