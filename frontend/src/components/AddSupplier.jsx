

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const AddSupplier = () => {
  const [supplier, setSupplier] = useState({
    date: new Date().toISOString().split('T')[0],
    supplierName: '',
    phone: '',
    phone2: '',
    fax: '',
    email: '',
    address: '',
    supplyProducts: '',
    paymentTerms: '',
  });

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supplier.date) {
      alert('Date is required.');
      return;
    }

    if (!validatePhoneNumber(supplier.phone)) {
      alert('Primary Contact Number must be exactly 10 digits.');
      return;
    }

    if (supplier.phone2 && !validatePhoneNumber(supplier.phone2)) {
      alert('Secondary Contact Number must be exactly 10 digits.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/suppliers', supplier);
      alert('Supplier added successfully');
      setSupplier({
        date: new Date().toISOString().split('T')[0],
        supplierName: '',
        phone: '',
        phone2: '',
        fax: '',
        email: '',
        address: '',
        supplyProducts: '',
        paymentTerms: '',
      });
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSupplier({ ...supplier, [name]: value });
  };

  return (
    <div className="container form-container" style={{ maxWidth: '50%' }}>
      <div className='text-center' style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
        <FontAwesomeIcon icon={faSquarePlus} /> Add Supplier
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label className="form-label">Date</label>
          <input type="date" className="form-control" name="date" value={supplier.date} onChange={handleInputChange} required />
        </div>

        {[{ label: "Supplier Name", key: "supplierName" }, 
          { label: "Contact Number (Primary)", key: "phone", required: true }, 
          { label: "Contact Number (Secondary)", key: "phone2", required: false }, 
          { label: "Fax Number", key: "fax" }, 
          { label: "Email Address", key: "email" }, 
          { label: "Address", key: "address" }].map(field => (
          <div key={field.key} className="form-group">
            <label className="form-label">{field.label}</label>
            <input type="text" className="form-control" name={field.key} value={supplier[field.key]} onChange={handleInputChange} required={field.required || false} />
          </div>
        ))}

        <div className="form-group">
          <label className="form-label">Supply Products</label>
          <select className="form-control" name="supplyProducts" value={supplier.supplyProducts} onChange={handleInputChange} required>
            <option value="" disabled>Select a product</option>
            <option value="Mattress">Mattress</option>
            <option value="Cupboard">Cupboard</option>
            <option value="Scupboard">Steel Melamine Cupboard</option>
            <option value="Chair">Chair</option>
            <option value="Pchair">Plastic Chair</option>
            <option value="Table">Table</option>
            <option value="Wtable">Writing Table</option>
            <option value="Iron Board">Iron Board</option>
            <option value="Clothes Rack">Clothes Rack</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label"><FontAwesomeIcon icon={faDollarSign} /> Payment Method</label>
          <select className="form-control" name="paymentTerms" value={supplier.paymentTerms} onChange={handleInputChange} required>
            <option value="" disabled>Select a payment method</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Add Supplier</button>
      </form>
    </div>
  );
};

export default AddSupplier;
