import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Supplier.css';

const AddSupplier = () => {
  const [supplier, setSupplier] = useState({
    date: new Date().toISOString().split('T')[0],
    supplierName: '',
    phone1: '',
    phone2: '',
    fax: '',
    email: '',
    address: '',
    supplyProducts: '',
    paymentTerms: '',
  });

  const [errors, setErrors] = useState({});
  const [existingSupplierNames, setExistingSupplierNames] = useState([]);
  const [isNameAvailable, setIsNameAvailable] = useState(false);

  useEffect(() => {
    const fetchSupplierNames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/suppliers');
        const names = response.data.map((s) => s.supplierName?.toLowerCase());
        setExistingSupplierNames(names);
      } catch (error) {
        console.error('Failed to fetch suppliers:', error);
      }
    };

    fetchSupplierNames();
  }, []);

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const validateFields = (name, value) => {
    let error = '';

    if (name === 'phone1' || name === 'phone2') {
      value = value.replace(/\D/g, '');
      if (value.length > 10) {
        alert('Contact number must not exceed 10 digits');
        value = value.slice(0, 10);
      }
      if (!validatePhoneNumber(value)) {
        error = 'Contact number must be exactly 10 digits and numeric';
      } else if (name === 'phone2' && value === supplier.phone1) {
        error = 'Primary and Secondary Contact Numbers must not be the same';
      }
    }

    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        error = 'Email must be a valid @gmail.com address';
      }
    }

    if (name === 'address' && !value.trim()) {
      error = 'Address cannot be empty';
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return value;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const validatedValue = validateFields(name, value);
    setSupplier({ ...supplier, [name]: validatedValue });
  };

  const handleNameCheck = () => {
    const name = supplier.supplierName.trim().toLowerCase();
    if (!name) return alert("Please enter a supplier name to check.");

    if (existingSupplierNames.includes(name)) {
      alert("Already exists");
      setIsNameAvailable(false);
    } else {
      alert("Add the new supplier");
      setIsNameAvailable(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    Object.entries(supplier).forEach(([key, value]) => {
      const validated = validateFields(key, value);
      if (errors[key]) hasErrors = true;
    });

    if (Object.values(errors).some((err) => err) || hasErrors) {
      alert("Please fix the validation errors.");
      return;
    }

    if (!isNameAvailable) {
      alert("Please check the supplier name before submitting.");
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/suppliers/add', supplier);
      alert('Supplier added successfully');

      setSupplier({
        date: new Date().toISOString().split('T')[0],
        supplierName: '',
        phone1: '',
        phone2: '',
        fax: '',
        email: '',
        address: '',
        supplyProducts: '',
        paymentTerms: '',
      });

      setErrors({});
      setIsNameAvailable(false);
    } catch (error) {
      console.error('Error adding supplier:', error);
      alert('Failed to add supplier. Please try again.');
    }
  };

  return (
    <div className="page-top-center-container">
      <div className="container-i form-container-i" style={{ maxWidth: '700px' }}>
        <div className="text-center">
          <FontAwesomeIcon icon={faSquarePlus} /> Add Supplier
        </div>

        {/* Supplier Name and Check button same height and aligned */}
        <form onSubmit={handleSubmit} autoComplete="off" className="two-column-form">
          <div className="supplier-name-check">
            <input
              type="text"
              className="form-control supplier-name-input"
              name="supplierName"
              value={supplier.supplierName}
              onChange={handleInputChange}
              placeholder="Supplier Name"
              required
            />
            <button
              type="button"
              className="btn btn-secondary check-btn"
              onClick={handleNameCheck}
            >
              <FontAwesomeIcon icon={faSearch} /> Check
            </button>
          </div>

          <div className="form-group-i form-field date-field">
            <label className="field-label date-label">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={supplier.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group-i form-field phone1-field">
            <label className="field-label phone1-label">Contact Number (Primary)</label>
            <input
              type="text"
              className="form-control"
              name="phone1"
              value={supplier.phone1}
              onChange={handleInputChange}
              placeholder="Primary Contact Number"
              required
            />
            {errors.phone1 && <div className="alert alert-danger">{errors.phone1}</div>}
          </div>

          <div className="form-group-i form-field phone2-field">
            <label className="field-label phone2-label">Contact Number (Secondary)</label>
            <input
              type="text"
              className="form-control"
              name="phone2"
              value={supplier.phone2}
              onChange={handleInputChange}
              placeholder="Secondary Contact Number"
            />
            {errors.phone2 && <div className="alert alert-danger">{errors.phone2}</div>}
          </div>

          <div className="form-group-i form-field fax-field">
            <label className="field-label fax-label">Fax Number</label>
            <input
              type="text"
              className="form-control"
              name="fax"
              value={supplier.fax}
              onChange={handleInputChange}
              placeholder="Fax Number"
            />
          </div>

          <div className="form-group-i form-field email-field">
            <label className="field-label email-label">Email Address</label>
            <input
              type="text"
              className="form-control"
              name="email"
              value={supplier.email}
              onChange={handleInputChange}
              placeholder="Email Address"
            />
            {errors.email && <div className="alert alert-danger">{errors.email}</div>}
          </div>

          <div className="form-group-i form-field address-field">
            <label className="field-label address-label">Address</label>
            <input
              type="text"
              className="form-control"
              name="address"
              value={supplier.address}
              onChange={handleInputChange}
              placeholder="Address"
              required
            />
            {errors.address && <div className="alert alert-danger">{errors.address}</div>}
          </div>

          <div className="form-group-i form-field supplyProducts-field">
            <label className="field-label supplyProducts-label">Supply Products</label>
            <select
              className="form-control"
              name="supplyProducts"
              value={supplier.supplyProducts}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select a product
              </option>
              <option value="Mattress">Mattress</option>
              <option value="Cupboard">Cupboard</option>
              <option value="Chair">Chair</option>
              <option value="Table">Table</option>
              <option value="Iron Board">Iron Board</option>
              <option value="Carrom Board">Carrom Board</option>
              <option value="Clothes Rack">Clothes Rack</option>
            </select>
          </div>

          <div className="form-group-i form-field paymentTerms-field">
            <label className="field-label paymentTerms-label">Payment Terms</label>
            <select
              className="form-control"
              name="paymentTerms"
              value={supplier.paymentTerms}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select a payment method
              </option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>

          <div className="submit-btn-wrapper">
            <button type="submit" className="btn btn-primary-i">
              Add Supplier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
