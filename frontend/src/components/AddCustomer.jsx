import { useState } from 'react';
import axios from 'axios';

const AddCustomer = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Check if the customer name already exists
      const checkResponse = await axios.get(`http://localhost:5000/api/customers/check-name?name=${name}`);
      const nameExists = checkResponse.data.exists;

      if (nameExists) {
        alert("Customer already exists!");
        return; // Stop further execution
      }

      // Add the new customer
      const newCustomer = { name, address, contact, email };
      const addResponse = await axios.post(
        'http://localhost:5000/api/customers',
        newCustomer,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (addResponse.data.success) {
        alert("Customer added successfully!");
        setName('');
        setAddress('');
        setContact('');
        setEmail('');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong. Please try again!");
      console.error('Error adding customer:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add New Customer</h3>
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
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;
