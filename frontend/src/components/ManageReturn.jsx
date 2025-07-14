import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUndo, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


const ManageReturn = () => {
  const [returns, setReturns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subAllcategories, setSubAllcategories] = useState([]);

  const [formData, setFormData] = useState({
    return_id: '',
    supplier: '',
    date: '',
    product: '',
    category: '',
    subcategory: '',
    quantity: '',
    product_price: '',
    status: 'Pending',
    note: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 1000;

  useEffect(() => {
    fetchSuppliers();
    fetchCategories();
    fetchAllSubcategories();
    fetchReturns();
    generateReturnId();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/suppliers`);
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error.message);
      setError('Failed to fetch suppliers');
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/category`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      setError('Failed to fetch categories');
    }
    setLoading(false);
  };

  const fetchSubcategories = async (categoryId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/subcategories/by-category/${categoryId}`);
      setSubcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error.message);
      setSubcategories([]);
      setError('Failed to fetch subcategories');
    }
    setLoading(false);
  };

   const fetchAllSubcategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/subcategories`);
      setSubAllcategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error.message);
      setSubAllcategories([]);
      setError('Failed to fetch subcategories');
    }
    setLoading(false);
  };
  

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/returns`);
      setReturns(response.data.reverse());
    } catch (error) {
      console.error('Error fetching returns:', error.message);
      setError('Failed to fetch returns');
    }
    setLoading(false);
  };

  const generateReturnId = async (retryCount = 0) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/returns/last-id`);
      let lastId = response.data.last_id || 'RET-000';
      if (lastId && !/^RET-\d{3}$/.test(lastId)) {
        console.warn(`Invalid return_id format from API: ${lastId}`);
        throw new Error('Invalid return_id format');
      }
      const number = parseInt(lastId.split('-')[1] || '0') + 1;
      const newId = `RET-${String(number).padStart(3, '0')}`;
      setFormData((prev) => ({ ...prev, return_id: newId }));
      setError('');
      console.log(`Generated return_id: ${newId}`);
    } catch (error) {
      console.error(`Error generating return ID (Attempt ${retryCount + 1}/${MAX_RETRIES}):`, error.message);
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY * (retryCount + 1)}ms...`);
        setTimeout(() => generateReturnId(retryCount + 1), RETRY_DELAY * (retryCount + 1));
      } else {
        // Fallback to fetching all return IDs
        try {
          const response = await axios.get(`${BASE_URL}/api/returns/ids`);
          const validIds = response.data.return_ids.filter(id => /^RET-\d{3}$/.test(id));
          if (validIds.length > 0) {
            const lastNumber = validIds
              .map(id => parseInt(id.split('-')[1]))
              .reduce((max, num) => Math.max(max, num), 0);
            const newId = `RET-${String(lastNumber + 1).padStart(3, '0')}`;
            setFormData((prev) => ({ ...prev, return_id: newId }));
            setError('Failed to fetch last return ID. Generated ID from available data.');
            console.log(`Generated return_id from all IDs: ${newId}`);
          } else {
            setFormData((prev) => ({ ...prev, return_id: 'RET-001' }));
            setError('Failed to fetch return IDs. Starting with RET-001.');
            console.log('No valid return IDs found. Using RET-001.');
          }
        } catch (fallbackError) {
          console.error('Fallback fetch failed:', fallbackError.message);
          // Use local returns state as last resort
          if (returns.length > 0) {
            const validReturns = returns.filter(r => /^RET-\d{3}$/.test(r.return_id));
            const lastNumber = validReturns.length > 0
              ? validReturns
                .map(r => parseInt(r.return_id.split('-')[1]))
                .reduce((max, num) => Math.max(max, num), 0)
              : 0;
            const newId = `RET-${String(lastNumber + 1).padStart(3, '0')}`;
            setFormData((prev) => ({ ...prev, return_id: newId }));
            setError('Failed to fetch return IDs. Generated ID from local data.');
            console.log(`Generated return_id from local data: ${newId}`);
          } else {
            setFormData((prev) => ({ ...prev, return_id: 'RET-001' }));
            setError('All attempts to generate return ID failed. Starting with RET-001.');
            console.log('No data available. Using RET-001.');
          }
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'category' && value) {
      fetchSubcategories(value);
      setFormData((prev) => ({ ...prev, category: value, subcategory: '' }));
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { supplier, product, category, subcategory, quantity, product_price, date, status, note } = formData;


    if (!supplier || !product || !category || !subcategory || !quantity || !product_price || !date) {
      setError('Please fill all required fields');
      setLoading(false);
      return;
    }

    if (product.trim() === '') {
      setError('Product name cannot be empty');
      setLoading(false);
      return;
    }

    if (Number(quantity) < 1) {
      setError('Quantity must be at least 1');
      setLoading(false);
      return;
    }

    if (Number(product_price) < 0) {
      setError('Product price cannot be negative');
      setLoading(false);
      return;
    }

    console.log('Submitting form data:', formData);

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/returns/${editingId}`, formData);
        setSuccessMessage('Return updated successfully');
      } else {
        await axios.post(`${BASE_URL}/api/returns`, formData);
        setSuccessMessage('Return added successfully');
      }
      setFormData({
        return_id: '',
        supplier: '',
        date: '',
        product: '',
        category: '',
        subcategory: '',
        quantity: '',
        product_price: '',
        status: 'Pending',
        note: '',
      });
      setEditingId(null);
      setSubcategories([]);
      fetchReturns();
      generateReturnId();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error(`Error ${editingId ? 'updating' : 'adding'} return:`, error.message);
      if (error.response?.data?.message.includes('E11000 duplicate key')) {

        setError('Return ID already exists. Generating a new ID.');
        generateReturnId();
      } else {
        setError(`Failed to ${editingId ? 'update' : 'add'} return: ${error.response?.data?.message || error.message}`);
      }
    }
    setLoading(false);
  };


  const handleEdit = (returnItem) => {
    setFormData({
      return_id: returnItem.return_id,
      supplier: returnItem.supplier,
      date: returnItem.date,
      product: returnItem.product || '',
      category: returnItem.category,
      subcategory: returnItem.subcategory,
      quantity: returnItem.quantity,
      product_price: returnItem.product_price,
      status: returnItem.status,
      note: returnItem.note || '',
    });
    setEditingId(returnItem._id);
    fetchSubcategories(returnItem.category);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this return?')) {
      setLoading(true);
      try {
        await axios.delete(`${BASE_URL}/api/returns/${id}`);
        fetchReturns();
      } catch (error) {
        console.error('Error deleting return:', error.message);
        setError('Failed to delete return');
      }
      setLoading(false);
    }
  };

  return (
    <div className="add-purchase-container">
      <div className="title">
        <FontAwesomeIcon icon={faUndo} /> Manage Returns
      </div>

      <button
        className="btn btn-primary mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Show Returns' : 'Add Return'}
      </button>

      {successMessage && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : showForm ? (
        <form onSubmit={handleSubmit} className="add-purchase-form">
          <input
            type="text"
            name="return_id"
            value={formData.return_id}
            readOnly
            placeholder="Return ID"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s.supplierName}>
                {s.supplierName}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            name="product"
            value={formData.product}
            onChange={handleInputChange}
            placeholder="Product Name"
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <div className="row-input-group">
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
            <select
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              required
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.subcategoryName}
                </option>
              ))}
            </select>
          </div>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Quantity"
            required
            min="1"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="number"
            name="product_price"
            value={formData.product_price}
            onChange={handleInputChange}
            placeholder="Product Price (LKR)"
            required
            min="0"
            step="0.01"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            required
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="Pending">Pending</option>
            <option value="Returned">Returned</option>
            <option value="Cancel">Cancel</option>
          </select>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            placeholder="Note (Optional)"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {editingId ? 'Update Return' : 'Add Return'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    return_id: '',
                    supplier: '',
                    date: '',
                    product: '',
                    category: '',
                    subcategory: '',
                    quantity: '',
                    product_price: '',
                    status: 'Pending',
                    note: '',
                  });
                  generateReturnId();
                  setSubcategories([]);
                  setError('');
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : (
        <div>
          <h4 className="text-lg font-semibold mb-2">Returns Table</h4>
          <table className="table table-striped w-full">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Return ID</th>
                <th className="border p-2">Supplier</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Category</th>
                <th className="border p-2">Subcategory</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Price (LKR)</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Note</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {returns.length > 0 ? (
                returns.map((returnItem) => (
                  <tr key={returnItem._id}>
                    <td className="border p-2">{returnItem.return_id}</td>
                    <td className="border p-2">{returnItem.supplier || '-'}</td>
                    <td className="border p-2">{returnItem.date}</td>
                    <td className="border p-2">{returnItem.product || '-'}</td>
                    <td className="border p-2">
                      {categories.find((c) => c._id === returnItem.category)?.categoryName || '-'}
                    </td>
                    <td className="border p-2">
                      {subAllcategories.find((s) => s._id === returnItem.subcategory)?.subcategoryName || '-'}
                    </td>
                    <td className="border p-2">{returnItem.quantity}</td>
                    <td className="border p-2">{returnItem.product_price}</td>
                    <td className="border p-2">{returnItem.status}</td>
                    <td className="border p-2">{returnItem.note || '-'}</td>
                    <td className="border p-2">
                      <button
                        className="btn btn-warning mr-2"
                        onClick={() => handleEdit(returnItem)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(returnItem._id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center text-danger">
                    No Returns Found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageReturn;