import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsProgress, faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import '../Inventory.css';

const ManageInventories = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [productStatusOptions, setProductStatusOptions] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchItems();
    fetchCategories();
    fetchSubcategories();
    fetchProductStatuses();
    fetchSuppliers();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/inventory');
      setItems(Array.isArray(response.data) ? response.data.reverse() : []);
    } catch (err) {
      setError('Error fetching inventory items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/category');
      setCategories(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/subcategory');
      setSubcategories(response.data);
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const fetchProductStatuses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/product-status');
      setProductStatusOptions(response.data);
    } catch (err) {
      console.error('Error fetching product statuses:', err);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/supplier');
      setSuppliers(response.data);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.categoryName : 'Unknown';
  };

  const getSubcategoryName = (subcategoryId) => {
    const subcategory = subcategories.find(sub => sub._id === subcategoryId);
    return subcategory ? subcategory.subcategoryName : 'Unknown';
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id));
      alert('Item deleted successfully!');
    } catch (err) {
      setError('Error deleting item');
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setNewImage(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productName', editItem.productName);
    formData.append('category', editItem.category);
    formData.append('subcategory', editItem.subcategory); // added subcategory
    formData.append('quantity', Number(editItem.quantity));
    formData.append('buyingPrice', parseFloat(editItem.buyingPrice).toFixed(2));
    formData.append('sellingPrice', parseFloat(editItem.sellingPrice).toFixed(2));
    formData.append('dateAdded', editItem.dateAdded);
    formData.append('ProductStatus', editItem.ProductStatus || '');
    formData.append('supplier', editItem.supplier || '');
    if (newImage) formData.append('image', newImage);

    try {
      await axios.put(`http://localhost:5000/api/inventory/${editItem._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchItems();
      setEditItem(null);
      alert('Item updated successfully!');
    } catch (err) {
      setError('Error updating item');
      console.error(err);
    }
  };

  const filteredItems = items.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid mt-4 inventory-container">
      <div className='inventory-title'>
        <span className='inventory-title-icon'><FontAwesomeIcon icon={faBarsProgress} /></span> Manage Inventory
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="table-responsive inventory-table-container">
          {loading ? (
            <div>Loading...</div>
          ) : filteredItems.length === 0 ? (
            <div className='no-items'>No items found</div>
          ) : (
            <table className="table table-striped table-bordered inventory-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Subcategory</th> {/* Added */}
                  <th>Supplier</th>
                  <th>Product Code</th>
                  <th>Quantity</th>
                  <th>Buying Price</th>
                  <th>Selling Price</th>
                  <th>Date Added</th>
                  <th>Status</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.productName}</td>
                    <td>{getCategoryName(item.category)}</td>
                    <td>{getSubcategoryName(item.subcategory)}</td> {/* Added */}
                    <td>{item.supplier?.supplierName || 'No Supplier'}</td>
                    <td>{item.code || 'N/A'}</td>
                    <td>{item.quantity}</td>
                    <td>{parseFloat(item.buyingPrice).toFixed(2)}</td>
                    <td>{parseFloat(item.sellingPrice).toFixed(2)}</td>
                    <td>{item.dateAdded ? new Date(item.dateAdded).toLocaleDateString() : 'N/A'}</td>
                    <td>{item.ProductStatus || 'N/A'}</td>
                    <td>{item.image || 'No image'}</td>
                    <td>
                      <span className='inventory-edit-icon' onClick={() => handleEdit(item)}>
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                      <span className='inventory-delete-icon' onClick={() => handleDelete(item._id)}>
                        <FontAwesomeIcon icon={faRemove} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editItem && (
        <div className="inventory-form-container edit-form mt-4">
          <span className="form-icon-i"><FontAwesomeIcon icon={faEdit} /></span>Update Product
          <form onSubmit={handleUpdate}>
            <div className="inventory-row">
              <label className="inventory-form-label">Product Name</label>
              <input
                type="text"
                className="inventory-form-control"
                value={editItem.productName}
                onChange={(e) => setEditItem({ ...editItem, productName: e.target.value })}
                required
              />
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Category</label>
              <select
                className="inventory-form-control"
                value={editItem.category}
                onChange={(e) => setEditItem({ ...editItem, category: e.target.value, subcategory: '' })} // reset subcategory on category change
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                ))}
              </select>
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Subcategory</label>
              <select
                className="inventory-form-control"
                value={editItem.subcategory || ''}
                onChange={(e) => setEditItem({ ...editItem, subcategory: e.target.value })}
                required
              >
                <option value="">Select Subcategory</option>
                {subcategories
                  .filter(sub => sub.parentCategoryId === editItem.category) // Adjust property name as needed
                  .map((sub) => (
                    <option key={sub._id} value={sub._id}>{sub.subcategoryName}</option>
                ))}
              </select>
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Supplier</label>
              <select
                className="inventory-form-control"
                value={editItem.supplier || ''}
                onChange={(e) => setEditItem({ ...editItem, supplier: e.target.value })}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>{supplier.supplierName}</option>
                ))}
              </select>
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Product Status</label>
              <select
                className="inventory-form-control"
                value={editItem.ProductStatus || ''}
                onChange={(e) => setEditItem({ ...editItem, ProductStatus: e.target.value })}
              >
                <option value="">Select Status</option>
                {productStatusOptions.map((status, index) => (
                  <option key={index} value={status}>{status}</option>
                ))}
              </select>
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Quantity</label>
              <input
                type="number"
                className="inventory-form-control"
                value={editItem.quantity}
                onChange={(e) => setEditItem({ ...editItem, quantity: Number(e.target.value) })}
                required
              />
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Buying Price</label>
              <input
                type="number"
                className="inventory-form-control"
                min="0"
                step="0.01"
                value={parseFloat(editItem.buyingPrice).toFixed(2)}
                onChange={(e) => setEditItem({ ...editItem, buyingPrice: Number(e.target.value) })}
                required
              />
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Selling Price</label>
              <input
                type="number"
                className="inventory-form-control"
                value={editItem.sellingPrice}
                onChange={(e) => setEditItem({ ...editItem, sellingPrice: Number(e.target.value) })}
                required
              />
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Date Added</label>
              <input
                type="date"
                className="inventory-form-control"
                value={editItem.dateAdded ? editItem.dateAdded.substring(0, 10) : ''}
                onChange={(e) => setEditItem({ ...editItem, dateAdded: e.target.value })}
                required
              />
            </div>

            <div className="inventory-row">
              <label className="inventory-form-label">Update Image (optional)</label>
              <input
                type="file"
                accept="image/*"
                className="inventory-form-control"
                onChange={(e) => setNewImage(e.target.files[0])}
              />
            </div>

            <div className="inventory-row">
              <button type="submit" className="btn btn-success">Update Item</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setEditItem(null)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageInventories;
