import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const AddInventoryItem = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newItem = { productName, category, quantity: Number(quantity), buyingPrice: Number(buyingPrice), sellingPrice: Number(sellingPrice), };
      await axios.post('http://localhost:5000/api/inventory/add', newItem);
      setProductName('');
      setCategory('');
      setQuantity('');
      setBuyingPrice('');
      setSellingPrice('');
      alert('Item added successfully!');
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h5>Add New Product</h5>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName" className="form-label">Product Name</label>
          <input
            type="text"
            className="form-control"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category" className="form-label">Category</label>
          <select
            className="form-control"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value=""></option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            value={quantity}
            onChange={(e) => setBuyingPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="buyingPrice" className="form-label">Buying Price</label>
          <input
            className="form-control"
            id="buyingPrice"
            min="0"
            step="0.01"
            placeholder="Enter buying price"
            value={buyingPrice}
            onChange={(e) => setBuyingPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sellingPrice" className="form-label">Selling Price</label>
          <input
            className="form-control"
            id="sellingPrice"
            min="0"
            step="0.01"
            placeholder="Enter selling price "
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Item'}
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default AddInventoryItem;
