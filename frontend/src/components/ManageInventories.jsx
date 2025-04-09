import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsProgress, faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Inventory.css';

const ManageInventories = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/inventory');
      setItems(Array.isArray(response.data) ? response.data.reverse() : []);
    } catch (err) {
      setError('Error fetching inventory items');
      console.error('Error fetching inventory items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== id)); // Optimistic update
      alert('Item deleted successfully!');
    } catch (err) {
      setError('Error deleting item');
      console.error('Error deleting item:', err);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/inventory/${editItem._id}`, editItem);
      setItems((prevItems) =>
      [editItem, ...prevItems.filter(item => item.id !== editItem._id)]
      ); // Optimistic update
      setEditItem(null);
      alert('Item updated successfully!');
    } catch (err) {
      setError('Error updating item');
      console.error('Error updating item:', err);
    }
  };

  const filteredItems = items.filter((item) =>
    item.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid mt-4 inventory-container">
      <div className='inventory-title'>
        <span className='inventory-title-icon'><FontAwesomeIcon icon={faBarsProgress} /></span> Add New Product
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
              <th>Quantity</th>
              <th>Buying Price</th>
              <th>Selling Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, index) => (
              <tr key={item._id}>
                <td>{index + 1}</td>
                <td>{item.productName}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{parseFloat(item.buyingPrice).toFixed(2)}</td>
                <td>{parseFloat(item.sellingPrice).toFixed(2)}</td>
                <td>
                <span className='inventory-edit-icon' onClick={() => handleEdit(item)}><FontAwesomeIcon icon={faEdit} /></span>
                <span className='inventory-delete-icon' onClick={() => handleDelete(item._id)}><FontAwesomeIcon icon={faRemove} /></span>    
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>

      {editItem && (
        <div className="edit-form mt-4">
          <h4>Edit Item</h4>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label  className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"

                value={editItem.productName}
                onChange={(e) =>
                  setEditItem({ ...editItem, productName: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                
                value={editItem.category}
                onChange={(e) =>
                  setEditItem({ ...editItem, category: e.target.value })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                
                value={editItem.quantity}
                onChange={(e) =>
                  setEditItem({ ...editItem, quantity: Number(e.target.value) })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Buying Price</label>
              <input
                type="number"
                className="form-control"
                
                min="0"
                step="0.01"
                value={editItem.buyingPrice}
                onChange={(e) => setEditItem({...editItem, buyingPrice: Number(e.target.value) })}
                required
                />
            </div>
            <div className="mb-3">
            <label className="form-label">Selling Price</label>
              <input
                type="number"
                className="form-control"
                
                value={editItem.sellingPrice}
                onChange={(e) => setEditItem({...editItem, sellingPrice: Number(e.target.value) })}
                required
                />
            </div>
            <button type="submit" className="btn btn-success">Update Item</button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => setEditItem(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageInventories;