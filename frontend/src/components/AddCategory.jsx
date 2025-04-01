import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddCategory = () => {
    const [CategoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const newCategory = { CategoryName };
            await axios.post('http://localhost:5000/api/category/', newCategory);
            setCategoryName('');
            alert('Category added successfully!');
        } catch (error) {
            console.error('Error adding category:', error);
            setError('Failed to add category. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/category');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    React.useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className='container-i mt-4'>
            <div className="row">
                <div className='col-12 col-md-6'>
                <div className='form-title-i'>
                    <span className='form-icon-i'><FontAwesomeIcon icon={faSquarePlus} /></span> Add New Category
                </div>
                <form onSubmit = {handleSubmit}>
                <div className='form-group-i'>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="category Name"
                    value={CategoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    />
                </div>

                <button type='submit' className='btn btn-primary-i' disabled={loading}>
                    {loading ? 'Adding...' : 'Add Category'}
                </button>
                {error && <div className='alert alert-danger-i mt-3'>{error}</div>}
            </form>
            </div>

            <div className='col-12 col-md-6'>
                <h3>All Categories</h3>
                <table className='table'>
                    <thread>
                        <tr>
                            <th>#</th>
                            <th>Categories</th>
                            <th>Actions</th>
                        </tr>
                    </thread>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={category.id}>
                                <td>{index + 1}</td>
                                <td>{category.CategoryName}</td>
                                <td>
                                    <button className='btn btn-sm btn-warning'>Edit</button>
                                    <button className='btn btn-sm btn-danger'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>
    </div>
    );
};
export default AddCategory;

