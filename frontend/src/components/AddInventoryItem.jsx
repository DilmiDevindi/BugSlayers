import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSquarePlus, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Inventory.css';

const AddInventoryItem = () => {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyingPrice, setBuyingPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [dateAdded, setDateAdded] = useState('');
  const [image, setImage] = useState(null);
  const [availableForOffer, setAvailableForOffer] = useState('no');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/category');
        setCategories(response.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  // Load subcategories when category changes, reset subcategory selection
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (category) {
        try {
          const response = await axios.get(`/api/subcategories/by-category/${category}`);
          setSubcategories(response.data);
          setSubcategory(''); // reset subcategory when category changes
        } catch (err) {
          console.error('Failed to fetch subcategories', err);
          setSubcategories([]);
          setSubcategory('');
        }
      } else {
        setSubcategories([]);
        setSubcategory('');
      }
    };
    fetchSubcategories();
  }, [category]);

  // Validate inputs
  const validateFields = () => {
    const errors = {};
    if (!productName.trim()) errors.productName = 'Product name is required';
    if (!category) errors.category = 'Category is required';
    if (!subcategory) errors.subcategory = 'Subcategory is required';
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0)
      errors.quantity = 'Enter a valid quantity';
    if (!buyingPrice || isNaN(buyingPrice) || Number(buyingPrice) < 0)
      errors.buyingPrice = 'Enter a valid buying price';
    if (!sellingPrice || isNaN(sellingPrice) || Number(sellingPrice) < 0)
      errors.sellingPrice = 'Enter a valid selling price';
    if (!dateAdded) errors.dateAdded = 'Date is required';
    if (!image) errors.image = 'Product image is required';
    return errors;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneratedCode('');
    setError('');
    const errors = validateFields();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('category', category);
    formData.append('subcategory', subcategory);
    formData.append('quantity', Number(quantity));
    formData.append('buyingPrice', parseFloat(buyingPrice).toFixed(2));
    formData.append('sellingPrice', parseFloat(sellingPrice).toFixed(2));
    formData.append('dateAdded', dateAdded);
    formData.append('image', image);
    formData.append('availableForOffer', availableForOffer);

    try {
      const response = await axios.post('/api/inventory/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const addedItem = response.data;
      setGeneratedCode(addedItem.code || 'Code not returned');

      // Reset form
      setProductName('');
      setCategory('');
      setSubcategory('');
      setQuantity('');
      setBuyingPrice('');
      setSellingPrice('');
      setDateAdded('');
      setImage(null);
      setAvailableForOffer('no');
      alert('Item added successfully!');
    } catch (err) {
      console.error('Error adding item:', err);
      setError(err.response?.data?.error || 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-i mt-4">
      <div className="form-title-i">
        <span className="form-icon-i"><FontAwesomeIcon icon={faSquarePlus} /></span> Add New Product
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group-i">
          <input
            type="text"
            className="form-control"
            placeholder="Product Title"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          {fieldErrors.productName && <div className="text-danger">{fieldErrors.productName}</div>}
        </div>

        <div className="form-group-i">
          <select
            className="form-control-i"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          {fieldErrors.category && <div className="text-danger">{fieldErrors.category}</div>}
        </div>

        <div className="form-group-i">
          <select
            className="form-control-i"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            disabled={!category}
            required
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.subcategoryName}
              </option>
            ))}
          </select>
          {fieldErrors.subcategory && <div className="text-danger">{fieldErrors.subcategory}</div>}
        </div>

        <div className="form-row-i">
          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faShoppingCart} /></span>
            <input
              type="number"
              className="form-control-i"
              placeholder="Product Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {fieldErrors.quantity && <div className="text-danger">{fieldErrors.quantity}</div>}
          </div>
        </div>

        <div className="form-row-i">
          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faDollarSign} /></span>
            <input
              type="number"
              className="form-control-i"
              placeholder="Buying Price"
              min="0"
              step="0.01"
              value={buyingPrice}
              onChange={(e) => setBuyingPrice(e.target.value)}
            />
            {fieldErrors.buyingPrice && <div className="text-danger">{fieldErrors.buyingPrice}</div>}
          </div>
          <div className="form-group-i input-icon-i">
            <span className="icon"><FontAwesomeIcon icon={faDollarSign} /></span>
            <input
              type="number"
              className="form-control-i"
              placeholder="Selling Price"
              min="0"
              step="0.01"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
            />
            {fieldErrors.sellingPrice && <div className="text-danger">{fieldErrors.sellingPrice}</div>}
          </div>
        </div>

        <div className="form-group-i">
          <input
            type="date"
            className="form-control"
            value={dateAdded}
            onChange={(e) => setDateAdded(e.target.value)}
          />
          {fieldErrors.dateAdded && <div className="text-danger">{fieldErrors.dateAdded}</div>}
        </div>

        <div className="form-group-i">
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {fieldErrors.image && <div className="text-danger">{fieldErrors.image}</div>}
        </div>

        <div className="form-row-i">
          <div className="form-group-i">
            <label className="mb-1 d-block">Availability for offer a discount:</label>
          </div>
          <div className="form-group-i">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="offerAvailable"
                id="offerYes"
                value="yes"
                checked={availableForOffer === 'yes'}
                onChange={(e) => setAvailableForOffer(e.target.value)}
              />
              <label className="form-check-label" htmlFor="offerYes">
                Yes
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="offerAvailable"
                id="offerNo"
                value="no"
                checked={availableForOffer === 'no'}
                onChange={(e) => setAvailableForOffer(e.target.value)}
              />
              <label className="form-check-label" htmlFor="offerNo">
                No
              </label>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary-i" disabled={loading}>
          {loading ? 'Adding...' : 'Add Product'}
        </button>

        {error && <div className="alert alert-danger-i mt-3">{error}</div>}
        {generatedCode && (
          <div className="alert alert-success-i mt-3">
            <strong>Generated Code:</strong> {generatedCode}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddInventoryItem;
