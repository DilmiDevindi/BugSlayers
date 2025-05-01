import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Supplier.css';

const AddSupplier = () => {
  const getEmptySupplier = () => ({
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

  const [supplier, setSupplier] = useState(getEmptySupplier());
  const [errors, setErrors] = useState({});

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const validateAllFields = () => {
    const newErrors = {};
    const { supplierName, phone1, phone2, email, address, supplyProducts, paymentTerms } = supplier;

    if (!supplierName.trim()) newErrors.supplierName = 'Supplier name is required';
    if (!validatePhoneNumber(phone1)) newErrors.phone1 = 'Primary phone must be exactly 10 digits';
    if (phone2) {
      if (!validatePhoneNumber(phone2)) newErrors.phone2 = 'Secondary phone must be 10 digits';
      else if (phone2 === phone1) newErrors.phone2 = 'Secondary phone must be different from primary';
    }
    if (email && !validateEmail(email)) newErrors.email = 'Email must be a valid @gmail.com address';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!supplyProducts) newErrors.supplyProducts = 'Please select a product';
    if (!paymentTerms) newErrors.paymentTerms = 'Please select a payment method';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      console.warn('Validation failed', errors);
      return;
    }

    try {
      console.log('Sending supplier data:', supplier); // DEBUG
      const res = await axios.post('/api/suppliers', supplier);
      console.log('Response:', res.data);

      alert('✅ Supplier added successfully!');
      setSupplier(getEmptySupplier());
      setErrors({});
    } catch (err) {
      console.error(' Error adding supplier:', err);
      alert(' Failed to add supplier. Check console and backend API.');
    }
  };

  return (
    <div className="container-i form-container-i" style={{ maxWidth: '60%' }}>
      <div className="text-center" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
        <FontAwesomeIcon icon={faSquarePlus} /> Add Supplier
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group-i">
          <input
            type="date"
            className="form-control"
            name="date"
            value={supplier.date}
            onChange={handleInputChange}
            required
          />
        </div>

        {[{ label: 'Supplier Name', key: 'supplierName' },
          { label: 'Primary Contact Number', key: 'phone1' },
          { label: 'Secondary Contact Number', key: 'phone2' },
          { label: 'Fax Number', key: 'fax' },
          { label: 'Email Address', key: 'email' },
          { label: 'Address', key: 'address' }
        ].map((field) => (
          <div key={field.key} className="form-group-i">
            <input
              type="text"
              className="form-control"
              name={field.key}
              value={supplier[field.key]}
              onChange={handleInputChange}
              placeholder={field.label}
              required={['supplierName', 'phone1', 'address'].includes(field.key)}
            />
            {errors[field.key] && <div className="alert alert-danger">{errors[field.key]}</div>}
          </div>
        ))}

        <div className="form-group-i">
          <select
            className="form-control"
            name="supplyProducts"
            value={supplier.supplyProducts}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select a product</option>
            <option value="Mattress">Mattress</option>
            <option value="Cupboard">Cupboard</option>
            <option value="Chair">Chair</option>
            <option value="Table">Table</option>
            <option value="Iron Board">Iron Board</option>
            <option value="Carrom Board">Carrom Board</option>
            <option value="Clothes Rack">Clothes Rack</option>
          </select>
          {errors.supplyProducts && <div className="alert alert-danger">{errors.supplyProducts}</div>}
        </div>

        <div className="form-group-i">
          <select
            className="form-control"
            name="paymentTerms"
            value={supplier.paymentTerms}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>Select a payment method</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
          {errors.paymentTerms && <div className="alert alert-danger">{errors.paymentTerms}</div>}
        </div>

        <button type="submit" className="btn btn-primary-i">Add Supplier</button>
      </form>
    </div>
  );
};

export default AddSupplier;
