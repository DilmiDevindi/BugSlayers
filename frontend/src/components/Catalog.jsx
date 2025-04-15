// src/components/Catalog.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import '../ProductCatalog.css';

const Catalog = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState(null);

  // Fetch categories from the API
  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then((res) => {
        console.log('Fetched categories:', res.data);
        setCategories(res.data);
        if (res.data.length > 0) {
          setActiveTab(res.data[0]._id); // Default to the first category
        }
      })
      .catch((err) => console.error('Error fetching categories:', err));
  }, []);

  // Fetch products for the active tab (selected category)
  useEffect(() => {
    if (activeTab) {
      axios.get(`http://localhost:5000/api/inventoryitems?categoryId=${activeTab}`)
        .then((res) => {
          console.log('Fetched products:', res.data);
          setProducts(res.data);
        })
        .catch((err) => console.error('Error fetching products:', err));
    }
  }, [activeTab]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Product Catalog</h2>
      {/* Tabs for categories */}
      <ul className="nav nav-tabs mb-4">
        {categories.map((category) => (
          <li className="nav-item" key={category._id}>
            <button
              className={`nav-link ${activeTab === category._id ? 'active' : ''}`}
              onClick={() => setActiveTab(category._id)}
            >
              {category.name}
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
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text mb-1"><strong>Item Code:</strong> {product.itemCode}</p>
                  <p className="card-text mb-1"><strong>Price:</strong> Rs. {product.price}</p>
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
