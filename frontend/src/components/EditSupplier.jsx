// components/EditSupplier.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState({
    date: new Date().toISOString().split('T')[0], // Default to today's date
    supplierName: '',
    phone1: '',
    phone2:'',
    fax: '',
    email: '',
    address: '',
    supplyProducts: '',
    paymentTerms: ''
  });

  useEffect(() => {
    if (id) {
      const fetchSupplier = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/suppliers/${id}`);
          setSupplier(response.data);
        } catch (error) {
          console.error('Error fetching supplier:', error);
        }
      };
      fetchSupplier();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === 'phone1' || name === 'fax') && isNaN(value)) {
      return;
    }

    setSupplier({ ...supplier, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number length if entered
    if (supplier.phone1 && supplier.phone2.length !== 10) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    // Validate that date is not in the future
    if (new Date(supplier.date) > new Date()) {
      alert('Date cannot be in the future.');
      return;
    }

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/suppliers/${id}`, supplier);
        alert('Supplier updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/suppliers', supplier);
        alert('Supplier added successfully!');
      }
      navigate('/dashboard/suppliers/manage'); // Redirect after successful update
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Error saving supplier. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>{id ? 'Edit Supplier' : 'Add New Supplier'}</h2>
      <form onSubmit={handleSubmit}>

        {/* Date Field with validation for future dates */}
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={supplier.date}
            onChange={handleChange}
            required
            max={new Date().toISOString().split('T')[0]} // Prevent future date selection
          />
        </div>

        {/* Supplier Name */}
        <div className="mb-3">
          <label className="form-label">Supplier Name</label>
          <input
            type="text"
            className="form-control"
            name="supplierName"
            value={supplier.supplierName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label className="form-label">Phone1</label>
          <input
            type="text"
            className="form-control"
            name="phone1"
            value={supplier.phone1}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone2</label>
          <input
            type="text"
            className="form-control"
            name="phone2"
            value={supplier.phone2}
            onChange={handleChange}
          />
        </div>

        {/* Other fields ... */}
        
        <button type="submit" className="btn btn-primary">
          {id ? 'Update Supplier' : 'Add Supplier'}
        </button>
      </form>
    </div>
  );
};

export default EditSupplier;
