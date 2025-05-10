import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";

const AddCustomer = () => {
  const [date, setDate] = useState('');  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  const validateFields = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!/^[0-9]{10}$/.test(contact)) newErrors.contact = "Enter a valid 10-digit contact number";
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) newErrors.email = "Enter a valid @gmail.com email address";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const checkResponse = await axios.get('http://localhost:5002/api/customers');
      if (checkResponse.data.some(c => c.email === email)) {
        alert("Customer with this email already exists!");
        return;
      }

      const newCustomer = { date, name, address, contact, email };  // Ensure date is included
      const response = await axios.post('http://localhost:5002/api/customers', newCustomer, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        alert("Customer added successfully!");
        setName('');
        setAddress('');
        setContact('');
        setEmail('');
        setDate('');  
        setErrors({});
      } else {
        alert("Error adding customer. Please try again.");
      }
    } catch (error) {
      console.error("Error Details:", error.response?.data || error.message);
      alert("Error adding customer. Please try again.");
    }
  };

  return (
    <div className="container-c">
      <h4 className="add-title" style={{ textAlign: "left" }}>
        <FontAwesomeIcon icon={faPlusSquare} className="addCus" /> Add New Customer
      </h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}  
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <div className="alert alert-danger">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} />
          {errors.address && <div className="alert alert-danger">{errors.address}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Contact</label>
          <input type="text" className="form-control" value={contact} onChange={(e) => setContact(e.target.value)} />
          {errors.contact && <div className="alert alert-danger">{errors.contact}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} />
          {errors.email && <div className="alert alert-danger">{errors.email}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;
