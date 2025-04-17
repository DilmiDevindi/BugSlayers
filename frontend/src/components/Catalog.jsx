import { useEffect, useState } from 'react';
import axios from 'axios';
import '../ProductCatalog.css';

const Catalog = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  // Fetch categories from the API
  useEffect(() => {
    axios.get('http://localhost:5000/api/catalog/categories') // ✅ updated
      .then((res) => {
        console.log('Fetched categories:', res.data);
        setCategories(res.data);
        if (res.data.length > 0) {
          setActiveTab(res.data[0]._id); // Set the first category as default
        }
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch products when category tab changes
  useEffect(() => {
    if (activeTab) {
      axios.get(`http://localhost:5000/api/catalog/products?categoryId=${activeTab}`)
        .then((res) => {
          console.log('Fetched products:', res.data); // Log products
          setProducts(res.data);
        })
        .catch((err) => console.error('Error fetching products:', err));
    }
  }, [activeTab]);
  

  return (
    <div className="container mt-4">

      {/* Tabs for categories */}
      <ul className="nav nav-tabs mb-4">
        {categories.map((category) => (
          <li className="nav-item" key={category._id}>
            <button
              className={`nav-link ${activeTab === category._id ? 'active' : ''}`}
              onClick={() => setActiveTab(category._id)}
            >
              {category.categoryName}
            </button>
          </li>
        ))}
      </ul>

      {/* Product grid */}
      <div className="row">
        {products.length ? (
          products.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <div className="card h-100 shadow-sm">
                {product.image && (
                  <img
                    src={`http://localhost:5000/uploads/${product.image}`} // Fixed image path
                    className="card-img-top"
                    alt={product.productName}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.productName || 'No Name Available'}</h5>
                  <p className="card-text mb-1"><strong>Item Code: {product.code || 'No Code Available'}</strong></p>
                  <p className="card-text mb-1"><strong>Price: Rs. {product.sellingPrice || 'N/A'}</strong></p>
                  <p className="card-text mb-1">
                    <strong>Stock Status:</strong>{' '}
                    <span className={`badge ${product.quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products available for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Catalog;
