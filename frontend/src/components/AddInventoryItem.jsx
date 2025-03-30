import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faBriefcase, faSquarePlus, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import './inventory.css';

const AddInventoryItem = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newItem = { productName, category, quantity: Number(quantity), buyingPrice: Number(buyingPrice), sellingPrice: Number(sellingPrice) };
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
      <div className='form-title'>
        <span className='form-icon'><FontAwesomeIcon icon={faSquarePlus} /></span> Add New Product
      </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Product Title"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Product Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group input-icon">
                <span className="icon"><FontAwesomeIcon icon={faShoppingCart} /></span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Product Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group input-icon">
                <span className="icon"><FontAwesomeIcon icon={faDollarSign} /></span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Buying Price"
                  min="0"
                  step="0.01"
                  value={buyingPrice}
                  onChange={(e) => setBuyingPrice(e.target.value)}
                  required
                />
              </div>

              <div className="form-group input-icon">
                <span className="icon"><FontAwesomeIcon icon={faDollarSign} /></span>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Selling Price"
                  min="0"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Product'}
            </button>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </form>
        </div>
      )}
export default AddInventoryItem;
