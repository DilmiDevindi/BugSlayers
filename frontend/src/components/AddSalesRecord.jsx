import { useState, useEffect } from 'react';
import axios from 'axios';
import './Sales.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddSalesRecord = () => {
  const [customerName, setCustomerName] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [remark, setRemark] = useState('');

  // Calculate totalAmount whenever quantity or price changes
  useEffect(() => {
    const q = parseFloat(quantity) || 0;
    const p = parseFloat(price) || 0;
    setTotalAmount(q * p);
  }, [quantity, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSale = {
        customerName,
        productName,
        quantity,
        price,
        totalAmount,
        remark,
      };
      await axios.post('http://localhost:5000/api/sales/add', newSale);
      // Reset form fields after successful submission
      setCustomerName('');
      setProductName('');
      setQuantity('');
      setPrice('');
      setTotalAmount(0);
      setRemark('');
      alert('Sale record added successfully!');
    } catch (error) {
      console.error('Error adding sale record:', error);
      alert('Error adding sale record. Please try again.');
    }
  };

  return (
    <div className="container-addsales">
      <h3><FontAwesomeIcon icon={faPlus} className="addsales-icon" /> Add Sales Record</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="customerName" className="form-label">Customer Name</label>
          <input
            type="text"
            className="form-control"
            id="customerName"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
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
        <div className="mb-3">
          <label htmlFor="quantity" className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="0"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="totalAmount" className="form-label">Total Amount</label>
          <input
            type="number"
            className="form-control"
            id="totalAmount"
            value={totalAmount}
            disabled
          />
        </div>
        <div className="mb-3">
          <label htmlFor="remark" className="form-label">Remark</label>
          <input
            type="text"
            className="form-control"
            id="remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Sale</button>
      </form>
    </div>
  );
};

export default AddSalesRecord;
