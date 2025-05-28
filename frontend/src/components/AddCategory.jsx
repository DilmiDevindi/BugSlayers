import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Inventory.css';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [subCategoryInput, setSubCategoryInput] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddSubCategory = () => {
    if (subCategoryInput.trim() !== '') {
      setSubCategories([...subCategories, subCategoryInput.trim()]);
      setSubCategoryInput('');
    }
  };

  const handleRemoveSubCategory = (index) => {
    const updated = subCategories.filter((_, i) => i !== index);
    setSubCategories(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newCategory = { categoryName, subCategories };
      await axios.post('http://localhost:5000/api/category/add', newCategory);
      setCategoryName('');
      setSubCategories([]);
      alert('Category and subcategories added successfully!');
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-i mt-4">
      <div className='form-title-i'>
        <span className='form-icon-i'><FontAwesomeIcon icon={faFolderPlus} /></span> Add New Category
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group-i">
          <input
            type="text"
            className="form-control"
            placeholder="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>

        <div className="form-group-i mb-2 d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Subcategory Name"
            value={subCategoryInput}
            onChange={(e) => setSubCategoryInput(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddSubCategory}
          >
            <FontAwesomeIcon icon={faPlus} /> Add
          </button>
        </div>

        <button type="submit" className="btn btn-primary-i" disabled={loading}>
          {loading ? 'Adding...' : 'Add Category'}
        </button>
        {error && <div className="alert alert-danger-i mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default AddCategory;
