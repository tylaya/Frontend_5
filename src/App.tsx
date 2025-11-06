import { useEffect, useState } from "react";
import "./App.css";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  qty: number;
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal mengambil data produk");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2000); // tampil 2 detik
  };

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [{ id: product.id, title: product.title, price: product.price, image: product.image, qty: 1 }, ...prev];
    });
    showToast(`"${product.title}" ditambahkan ke keranjang`);
  };

  const handleChangeQty = (id: number, qty: number) => {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: Math.max(1, qty) } : p)));
  };

  const handleRemove = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
    // optional toast handled in CartDrawer via showToast prop or here if preferred
  };

  const handleCheckout = (method: string) => {
    // proses checkout sederhana: kosongkan keranjang, tutup drawer, tampilkan toast konfirmasi
    setCart([]);
    setIsCartOpen(false);
    showToast(`Checkout berhasil via ${method}`);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.qty * i.price, 0);

  if (loading) return <h2 className="loading">Memuat data produk...</h2>;
  if (error) return <h2 className="error">Error: {error}</h2>;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="title">🛍️ Daftar Produk Toko Online</h1>
        <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
          Keranjang ({cartCount})
        </button>
      </header>

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-category">Kategori: {product.category}</p>
              <p className="product-price">💲 {product.price.toFixed(2)}</p>
              <p className="product-desc">{product.description.slice(0, 100)}...</p>
              <button className="buy-btn" onClick={() => handleAddToCart(product)}>Beli Sekarang</button>
            </div>
          </div>
        ))}
      </div>

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onChangeQty={handleChangeQty}
        onRemove={handleRemove}
        total={cartTotal}
        showToast={showToast}
        onCheckout={handleCheckout}
      />

      {toastMsg && <Toast message={toastMsg} />}

    </div>
  );
}

export default App;