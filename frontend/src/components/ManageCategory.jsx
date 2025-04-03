import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsProgress, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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
      setCategory(response.data.reverse());
    } catch (error) {
      setError('Error fetching categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/category/${id}`);
      fetchCategory(); // Refresh list after deletion
      alert('Category deleted successfully!');
    } catch (err) {
      setError('Error deleting category');
      console.error('Error deleting category:', err);
    }
  };

  const handleEdit = (category) => {
    console.log("Editing category:", category);
    setEditCategory(category);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // Send the update request
      await axios.put(`http://localhost:5000/api/category/${editCategory._id}`, editCategory);
      fetchCategory();
      setEditCategory(null);
      alert('Category updated successfully!');
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
        <span className='inventory-title-icon'><FontAwesomeIcon icon={faBarsProgress} /></span> Manage Categories
      </div>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive inventory-table-container">
        {loading ? (
          <div>Loading...</div>
        ) : filteredCategory.length === 0 ? (
          <div className='no-items'>No categories found</div>
        ) : (
          <table className="table table-striped table-bordered inventory-table">
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
                  <td>{category.categoryName}</td>
                  <td>
                    <span className='inventory-edit-icon' onClick={() => handleEdit(category)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </span>

                    <span className='inventory-delete-icon' onClick={() => handleDelete(category._id)}>
                      <FontAwesomeIcon icon={faTrash} />
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
              <label className="form-label">Category Name</label>
              <input
                type="text"
                className="form-control"
                value={editCategory.categoryName}
                onChange={(e) =>
                  setEditCategory({ ...editCategory, categoryName: e.target.value })
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
