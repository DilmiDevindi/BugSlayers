import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
//import '../Inventory.css';

const ManagePurchases = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [image, setImage] = useState(null);
  const [availableForOffer, setAvailableForOffer] = useState('no');
  const [ProductStatus, setProductStatus] = useState('Out-Side'); // default changed
  const [supplier, setSupplier] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [search, setSearch] = useState('');  // <-- Added search state

  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (category) fetchSubcategories(category);
    else setSubcategories([]);
  }, [category]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/inventory?status=Out-Side');
      const filtered = Array.isArray(res.data)
        ? res.data.filter(item => item.ProductStatus === 'Out-Side') // filter changed here
        : [];
      setItems(filtered.reverse());
    } catch (err) {
      setError('Failed to load purchases');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/category');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchSubcategories = async (catId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/subcategories/by-category/${catId}`);
      setSubcategories(res.data);
    } catch {
      setSubcategories([]);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Failed to fetch suppliers', err);
    }
  };

  const validateFields = () => {
    const errors = {};
    if (!productName.trim()) errors.productName = 'Product name is required';
    if (!category) errors.category = 'Category is required';
    if (!subcategory) errors.subcategory = 'Subcategory is required';
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) errors.quantity = 'Enter a valid quantity';
    if (!buyingPrice || isNaN(buyingPrice) || Number(buyingPrice) < 0) errors.buyingPrice = 'Enter a valid buying price';
    if (!sellingPrice || isNaN(sellingPrice) || Number(sellingPrice) < 0) errors.sellingPrice = 'Enter a valid selling price';
    if (!dateAdded) errors.dateAdded = 'Date is required';
    if (!supplier) errors.supplier = 'Supplier is required';
    if (!ProductStatus) errors.ProductStatus = 'Product status is required';
    return errors;
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setProductName(item.productName || '');
    setCategory(item.category?._id || item.category || '');
    setSubcategory(item.subcategory?._id || item.subcategory || '');
    setQuantity(item.quantity || '');
    setBuyingPrice(item.buyingPrice || '');
    setSellingPrice(item.sellingPrice || '');
    setDateAdded(item.dateAdded ? item.dateAdded.substring(0, 10) : '');
    setAvailableForOffer(item.availableForOffer || 'no');
    setProductStatus(item.ProductStatus || 'Out-Side'); // default changed
    setSupplier(item.supplier?._id || item.supplier || '');
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure to delete this purchase?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      setItems(items.filter(i => i._id !== id));
      alert('Purchase deleted successfully');
    } catch {
      alert('Failed to delete purchase');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('category', category);
      formData.append('subcategory', subcategory);
      formData.append('quantity', Number(quantity));
      formData.append('buyingPrice', parseFloat(buyingPrice).toFixed(2));
      formData.append('sellingPrice', parseFloat(sellingPrice).toFixed(2));
      formData.append('dateAdded', dateAdded);
      if (image) formData.append('image', image);
      formData.append('availableForOffer', availableForOffer);
      formData.append('ProductStatus', ProductStatus);
      formData.append('supplier', supplier);

      await axios.put(`http://localhost:5000/api/inventory/${editItem._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Purchase updated successfully!');
      setEditItem(null);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update purchase');
    } finally {
      setLoading(false);
    }
  };

  const onCategoryChange = (catId) => {
    setCategory(catId);
    setSubcategory('');
    fetchSubcategories(catId);
  };

  // Filter items by search term (product name)
  const filteredItems = items.filter(item =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-i mt-4">
      <h3 className="mb-4">Manage Purchases (Out-Side)</h3>

      {/* Search input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by product name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="table-responsive mb-4">
        {loading && !editItem ? (
          <p>Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p>No purchases found.</p>
        ) : (
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Buying Price</th>
                <th>Selling Price</th>
                <th>Date Added</th>
                <th>Status</th>
                <th>Offer</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, i) => (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>{item.productName}</td>
                  <td>{item.category?.categoryName || 'N/A'}</td>
                  <td>{item.subcategory?.subcategoryName || 'N/A'}</td>
                  <td>{item.supplier?.supplierName || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>{parseFloat(item.buyingPrice).toFixed(2)}</td>
                  <td>{parseFloat(item.sellingPrice).toFixed(2)}</td>
                  <td>{item.dateAdded ? new Date(item.dateAdded).toLocaleDateString() : 'N/A'}</td>
                  <td>{item.ProductStatus}</td>
                  <td>{item.availableForOffer === 'yes' ? 'Yes' : 'No'}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(item)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editItem && (
        <>
          <style>{`
            .edit-form-container {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 6px;
              margin-top: 30px;
            }
          `}</style>

          <div className="edit-form-container">
            <h4>Edit Purchase</h4>
            <form onSubmit={handleUpdate} encType="multipart/form-data" noValidate>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label>Product Title</label>
                    <input
                      type="text"
                      className={`form-control ${fieldErrors.productName ? 'is-invalid' : ''}`}
                      value={productName}
                      onChange={e => setProductName(e.target.value)}
                    />
                    <div className="invalid-feedback">{fieldErrors.productName}</div>
                  </div>
                  <div className="mb-3">
                    <label>Category</label>
                    <select
                      className={`form-select ${fieldErrors.category ? 'is-invalid' : ''}`}
                      value={category}
                      onChange={e => onCategoryChange(e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat._id} value={cat._id}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">{fieldErrors.category}</div>
                  </div>
                  <div className="mb-3">
                    <label>Subcategory</label>
                    <select
                      className={`form-select ${fieldErrors.subcategory ? 'is-invalid' : ''}`}
                      value={subcategory}
                      onChange={e => setSubcategory(e.target.value)}
                      disabled={!category}
                    >
                      <option value="">Select Subcategory</option>
                      {subcategories.map(sub => (
                        <option key={sub._id} value={sub._id}>
                          {sub.subcategoryName}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">{fieldErrors.subcategory}</div>
                  </div>
                  <div className="mb-3">
                    <label>Supplier</label>
                    <select
                      className={`form-select ${fieldErrors.supplier ? 'is-invalid' : ''}`}
                      value={supplier}
                      onChange={e => setSupplier(e.target.value)}
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map(sup => (
                        <option key={sup._id} value={sup._id}>
                          {sup.supplierName}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">{fieldErrors.supplier}</div>
                  </div>
                  <div className="mb-3">
                    <label>Product Status</label>
                    <select
                      className={`form-select ${fieldErrors.ProductStatus ? 'is-invalid' : ''}`}
                      value={ProductStatus}
                      onChange={e => setProductStatus(e.target.value)}
                    >
                      <option value="">Select Option</option>
                      <option value="In-Side">In-Side</option>
                      <option value="Out-Side">Out-Side</option>
                    </select>
                    <div className="invalid-feedback">{fieldErrors.ProductStatus}</div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label>Quantity</label>
                    <input
                      type="number"
                      className={`form-control ${fieldErrors.quantity ? 'is-invalid' : ''}`}
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                    />
                    <div className="invalid-feedback">{fieldErrors.quantity}</div>
                  </div>
                  <div className="mb-3">
                    <label>Buying Price</label>
                    <input
                      type="number"
                      className={`form-control ${fieldErrors.buyingPrice ? 'is-invalid' : ''}`}
                      value={buyingPrice}
                      onChange={e => setBuyingPrice(e.target.value)}
                    />
                    <div className="invalid-feedback">{fieldErrors.buyingPrice}</div>
                  </div>
                  <div className="mb-3">
                    <label>Selling Price</label>
                    <input
                      type="number"
                      className={`form-control ${fieldErrors.sellingPrice ? 'is-invalid' : ''}`}
                      value={sellingPrice}
                      onChange={e => setSellingPrice(e.target.value)}
                    />
                    <div className="invalid-feedback">{fieldErrors.sellingPrice}</div>
                  </div>
                  <div className="mb-3">
                    <label>Date Added</label>
                    <input
                      type="date"
                      className={`form-control ${fieldErrors.dateAdded ? 'is-invalid' : ''}`}
                      value={dateAdded}
                      onChange={e => setDateAdded(e.target.value)}
                    />
                    <div className="invalid-feedback">{fieldErrors.dateAdded}</div>
                  </div>
                  <div className="mb-3">
                    <label>Update Image (optional)</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={e => setImage(e.target.files[0])}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label d-block">Availability for Offer Discount</label>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="availableForOffer"
                        id="offerYes"
                        value="yes"
                        checked={availableForOffer === 'yes'}
                        onChange={e => setAvailableForOffer(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="offerYes">
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="availableForOffer"
                        id="offerNo"
                        value="no"
                        checked={availableForOffer === 'no'}
                        onChange={e => setAvailableForOffer(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="offerNo">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Purchase'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditItem(null)} disabled={loading}>
                  Cancel
                </button>
              </div>

              {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default ManagePurchases;
