// src/components/Catalog.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import '../ProductCatalog.css';

const Catalog = () => {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:5000/api/catalog/inventory') // ✅ Corrected API endpoint
      .then((res) => {
        console.log("Fetched products:", res.data); // Debug
        setProducts(res.data);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Product Catalog</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product._id}>
            <div className="card h-100 shadow-sm">
              {product.image && (
                <img 
                  src={product.image} 
                  className="card-img-top" 
                  alt={product.name} 
                  style={{ height: "200px", objectFit: "cover" }} 
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text mb-1"><strong>Item Code:</strong> {product.itemCode}</p>
                <p className="card-text mb-1"><strong>Category:</strong> {product.categoryName}</p>
                <p className="card-text"><strong>Price:</strong> Rs. {product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
