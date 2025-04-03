import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSquarePlus, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddInventoryItem = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Living Room Furniture',
    'Bedroom Furniture',
    'Dining Room Furniture',
    'Office Furniture',
    'Outdoor Furniture',
    'Custom Furniture',
    'Storage Furniture',
    'Kids’ Furniture',
    'Home Décor & Accessories'  
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newItem = { productName, category, quantity: Number(quantity), buyingPrice: parseFloat(buyingPrice).toFixed(2), sellingPrice: parseFloat(sellingPrice).toFixed(2) };
      await axios.post('http://localhost:5001/api/inventory/add', newItem);
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
    <div className="container-i mt-4">
      <div className='form-title-i'>
        <span className='form-icon-i'><FontAwesomeIcon icon={faSquarePlus} /></span> Add New Product
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group-i">
          <input
            type="text"
            className="form-control"
            placeholder="Product Title"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div className="form-row-i">
          <div className="form-group-i input-icon-i">
          <select
            className="form-control-ii"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
          <option value="" disabled>Select Category</option>
          <option value="">None</option> {/* Option to deselect */}
          {categories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
          </select>

          </div>
        </div>

        <div className="form-row-i">
          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faShoppingCart} /></span>
            <input
              type="number"
              className="form-control-i"
              placeholder="Product Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row-i">
          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faDollarSign} /></span>
            <input
              type="number"
              className="form-control-i"
              placeholder="Buying Price"
              min="0"
              step="0.01"
              value={buyingPrice}
              onChange={(e) => setBuyingPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faDollarSign} /></span>
            <input
              type="number"
              className="form-control-i"
              placeholder="Selling Price"
              min="0"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary-i" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>
        {error && <div className="alert alert-danger-i mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default AddInventoryItem;
