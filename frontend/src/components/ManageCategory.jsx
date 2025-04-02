import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsProgress, faEdit, faRemove } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const ManageCategory = () => {
  const [category, setCategory] = useState([]);
  const [search, setSearch] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/category');
      const groupedCategory = response.data.reduce((acc, category) => {
        if (!acc[category.categorytName]) {
          acc[category.categoryName] = { ...category };
        } 
        return acc;
      }, {});

      setCategory(Object.values(groupedCategory).reverse());
    } catch (err) {
      setError('Error fetching inventory items');
      console.error('Error fetching inventory items:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/inventory/${id}`);
      fetchCategory(); // Refresh list after deletion
      alert('Category deleted successfully!');
    } catch (err) {
      setError('Error deleting category');
      console.error('Error deleting category:', err);
    }
  };

  const handleEdit = (category) => {
    setEditCategory(category);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/category/${editCategory._id}`, editCategory);
      fetchCategory(); // Refresh after update
      setEditCategory(null);
      alert('Item updated successfully!');
    } catch (err) {
      setError('Error updating category');
      console.error('Error updating category:', err);
    }
  };

  const filteredCategory = category.filter((category) =>
    category.categoryName.toLowerCase().includes(search.toLowerCase())
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
      </div>

      <div className="table-responsive inventory-table-container">
        {loading ? (
          <div>Loading...</div>
        ) : filteredCategory.length === 0 ? (
          <div className='no-category'>No category found</div>
        ) : (
          <table className="table table-striped table-bordered category-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategory.map((category, index) => (
                <tr key={category._id}>
                  <td>{index + 1}</td>
                  <td>{category.categorytName}</td>
                  <td>
                    <span className='inventory-edit-icon' onClick={() => handleEdit(category)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                    <span className='inventory-delete-icon' onClick={() => handleDelete(category._id)}>
                      <FontAwesomeIcon icon={faRemove} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editCategory && (
        <div className="edit-form mt-4">
          <h4>Edit Category</h4>
          <form onSubmit={handleUpdate}>
            <div className="mb-3">
              <label  className="form-label">Catelog Name</label>
              <input
                type="text"
                className="form-control"

                value={editCategory.productName}
                onChange={(e) =>
                  setEditCategory({  })
                }
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                
                value={editCategory.category}
                onChange={(e) =>
                  setEditCategory({ ...editCategory })
                }
                required
              />
            </div>
            
            <button type="submit" className="btn btn-success">Update Category</button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => setEditCategory(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageCategory;
