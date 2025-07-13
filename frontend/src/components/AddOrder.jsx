import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddOrder = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    orderId: '',
    companyName: '',
    productName: '',
    category: '',
    subcategory: '',
    quantity: '',
    date: '',
    status: 'Pending',
  });

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => {
    generateOrderId();
    fetchSuppliers();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (form.category) {
      fetchSubcategories(form.category);
    } else {
      setSubcategories([]);
      setForm(prev => ({ ...prev, subcategory: '' }));
    }
  }, [form.category]);

  const generateOrderId = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders`);
      const allOrders = res.data;

      let maxOrderNumber = 0;
      allOrders.forEach(order => {
        if (order.orderId && /^ORD\d+$/.test(order.orderId)) {
          const numPart = parseInt(order.orderId.replace("ORD", ""), 10);
          if (numPart > maxOrderNumber) maxOrderNumber = numPart;
        }
      });

      const nextId = maxOrderNumber + 1;
      const formattedId = `ORD${String(nextId).padStart(3, "0")}`;
      setForm(prev => ({ ...prev, orderId: formattedId }));
    } catch (error) {
      console.error("Error generating Order ID", error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/category`);
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/subcategories/by-category/${categoryId}`);
      setSubcategories(res.data);
    } catch (err) {
      console.error('Failed to fetch subcategories:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' && { subcategory: '' }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const {
      orderId, companyName, productName, category,
      subcategory, quantity, date, status,
    } = form;

    if (!orderId || !companyName || !productName || !category || !subcategory || !quantity || !date || !status) {
      setError('⚠️ Please fill all fields.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/orders`, {
        orderId,
        companyName,
        productName,
        category,
        subcategory,
        quantity: Number(quantity),
        date,
        status,
      });

      alert('Order added successfully!');

      generateOrderId();
      setForm({
        orderId: form.orderId,
        companyName: '',
        productName: '',
        category: '',
        subcategory: '',
        quantity: '',
        date: '',
        status: 'Pending',
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('❌ Failed to add order. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 700, padding: 32, background: '#fff', borderRadius: 12 }}>
      <h2 className="mb-4 text-center">Add Order</h2>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-3"
          name="orderId"
          value={form.orderId}
          readOnly
          aria-label="Order ID"
        />

        <select
          className="form-control mb-3"
          name="companyName"
          value={form.companyName}
          onChange={handleChange}
          required
          aria-label="Supplier"
        >
          <option value="">Select Supplier</option>
          {suppliers.map(s => (
            <option key={s._id} value={s.supplierName}>{s.supplierName}</option>
          ))}
        </select>

        <input
          className="form-control mb-3"
          name="productName"
          value={form.productName}
          onChange={handleChange}
          placeholder="Product Name"
          required
          aria-label="Product Name"
        />

        <div className="d-flex gap-3 mb-3">
          <select
            className="form-control w-50"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            aria-label="Category"
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.categoryName}</option>
            ))}
          </select>

          <select
            className="form-control w-50"
            name="subcategory"
            value={form.subcategory}
            onChange={handleChange}
            required
            aria-label="Subcategory"
          >
            <option value="">Select Subcategory</option>
            {subcategories.map(sub => (
              <option key={sub._id} value={sub._id}>{sub.subcategoryName}</option>
            ))}
          </select>
        </div>

        <input
          type="number"
          className="form-control mb-3"
          name="quantity"
          placeholder="Quantity"
          value={form.quantity}
          onChange={handleChange}
          min={1}
          required
          aria-label="Quantity"
        />

        <input
          type="date"
          className="form-control mb-3"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          aria-label="Date"
        />

        <select
          className="form-control mb-4"
          name="status"
          value={form.status}
          onChange={handleChange}
          required
          aria-label="Status"
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancel">Cancel</option>
        </select>

        <button className="btn btn-primary w-100" type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Add Order'}
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
