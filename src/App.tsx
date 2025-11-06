import { useEffect, useState } from "react";
import "./App.css";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <h2 className="loading">Memuat data produk...</h2>;
  if (error) return <h2 className="error">Error: {error}</h2>;

  return (
    <div className="app">
      <h1 className="title">🛍️ Daftar Produk Toko Online</h1>

      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} alt={product.title} className="product-image" />

            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <p className="product-category">Kategori: {product.category}</p>
              <p className="product-price">💲 {product.price.toFixed(2)}</p>
              <p className="product-desc">
                {product.description.slice(0, 100)}...
              </p>
              <button className="buy-btn">Beli Sekarang</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
