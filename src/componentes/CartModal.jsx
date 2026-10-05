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
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin-bottom: 20px;" />
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
    <>
      <style>{`
        @keyframes modalOverlayFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes modalPopSmooth {
          0% {
            opacity: 0;
            transform: translate3d(0, 8px, 0) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        .cart-overlay-smooth {
          animation: modalOverlayFade 150ms ease-out forwards;
          will-change: opacity;
        }

        .cart-content-smooth {
          animation: modalPopSmooth 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>

      {/* Fondo Oscuro */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 cart-overlay-smooth">
        
        {/* Click fuera para cerrar */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Ventana Modal */}
        <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 cart-content-smooth">
          
          {/* Header */}
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-800 rounded-lg">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold">Carrito de Compras</h2>
                <p className="text-xs text-slate-400">{totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'} en total</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-red-400 hover:text-red-300 font-medium px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Vaciar carrito"
                >
                  Vaciar
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Lista de Productos */}
          <div className="p-5 overflow-y-auto space-y-3.5 bg-slate-50/50 flex-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="font-semibold text-slate-600">Tu carrito está vacío</p>
                <p className="text-xs mt-1">Agrega productos para realizar tu pedido</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-3 transition hover:border-slate-300"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 text-sm truncate">{item.nombre}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">${item.precio?.toLocaleString()} c/u</p>
                    <p className="text-sm font-bold text-emerald-600 mt-0.5">
                      ${(item.precio * item.qty).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                      <button
                        onClick={() => onUpdateQty(item, item.qty - 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-slate-800">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item, item.qty + 1)}
                        className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-xs transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Eliminar producto"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-5 bg-white border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium text-sm">Total a pagar:</span>
              <span className="text-2xl font-black text-emerald-600">${total.toLocaleString()}</span>
            </div>

            <button
              onClick={handleDownloadReceipt}
              disabled={cart.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar Recibo (PDF)
            </button>
          </div>

        </div>
      </div>
    </>
  );
}