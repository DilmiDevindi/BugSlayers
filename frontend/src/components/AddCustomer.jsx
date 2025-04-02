import { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons"; 

const AddCustomer = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !address || !contact || !email) {
      alert("All fields are required!");
      return;
    }

    // Validate contact number (should be exactly 10 digits)
    if (!/^[0-9]{10}$/.test(contact)) {
      alert("Please enter a valid 10-digit contact number!");
      return;
    }

    try {
      // Check if customer already exists by email
      const checkResponse = await axios.get('http://localhost:5000/api/customers');
      const existingCustomer = checkResponse.data.find(c => c.email === email);
      
      if (existingCustomer) {
        alert("Customer with this email already exists!");
        return;
      }

      const newCustomer = { name, address, contact, email };

      console.log("Sending new customer:", newCustomer); // Debugging log

      const response = await axios.post('http://localhost:5000/api/customers', newCustomer, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 201) {
        alert("Customer added successfully!");
        setName('');
        setAddress('');
        setContact('');
        setEmail('');
      } else {
        alert("Error adding customer. Please try again.");
      }
    } catch (error) {
      console.error("Error Details:", error.response?.data || error.message);
      alert("This email is existing. Please try again with a different email.");
    }
  };

  return (
    <div className="container mt-4">
      <h4 className='addCusTitle'><FontAwesomeIcon icon={faPlusSquare} className="addCus" />Add New Customer</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contact" className="form-label">Contact</label>
          <input
            type="text"
            className="form-control"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;
