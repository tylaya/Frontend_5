import React, { useState } from "react";

type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  qty: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onChangeQty: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
  total: number;
  showToast: (msg: string) => void;
  onCheckout: (method: string) => void;
};

const paymentMethods = ["Credit Card", "Bank Transfer", "E-Wallet"];

const CartDrawer: React.FC<Props> = ({ open, onClose, items, onChangeQty, onRemove, total, showToast, onCheckout }) => {
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  const handleConfirmDelete = () => {
    if (confirmId != null) {
      onRemove(confirmId);
      showToast("Item telah dihapus dari keranjang");
      setConfirmId(null);
    }
  };

  const handleStartCheckout = () => {
    setShowPayment(true);
  };

  const handleSelectPayment = (method: string) => {
    onCheckout(method);
    setShowPayment(false);
    showToast(`Pembayaran diproses via ${method}`);
  };

  return (
    <>
      <div className={`cart-drawer ${open ? "open" : ""}`} role="dialog" aria-hidden={!open}>
        <div className="cart-header">
          <h3>Keranjang</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="empty">Keranjang kosong</div>
          ) : (
            items.map(item => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.title}</div>
                  <div className="cart-item-price">💲 {item.price.toFixed(2)}</div>
                  <div className="cart-item-controls">
                    <button onClick={() => onChangeQty(item.id, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => onChangeQty(item.id, item.qty + 1)}>+</button>
                    <button className="remove" onClick={() => setConfirmId(item.id)}>Hapus</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">Total: 💲 {total.toFixed(2)}</div>
          <button className="checkout-btn" disabled={items.length === 0} onClick={handleStartCheckout}>Checkout</button>
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmId != null && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h4>Hapus item?</h4>
            <p>Apakah Anda yakin ingin menghapus item ini dari keranjang?</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => setConfirmId(null)}>Batal</button>
              <button className="btn danger" onClick={handleConfirmDelete}>Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment modal */}
      {showPayment && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <h4>Pilih Metode Pembayaran</h4>
            <div className="payment-list">
              {paymentMethods.map((m) => (
                <button key={m} className="btn payment-btn" onClick={() => handleSelectPayment(m)}>{m}</button>
              ))}
            </div>
            <div className="modal-actions" style={{ marginTop: 12 }}>
              <button className="btn" onClick={() => setShowPayment(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;