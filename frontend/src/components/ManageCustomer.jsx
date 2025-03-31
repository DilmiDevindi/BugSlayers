import { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import { FaEdit, FaTrash } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons"; 


const ManageCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ _id: '', name: '', address: '', contact: '', email: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Fetch customers from the backend
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/customers');
      setCustomers(response.data.reverse()); // Show latest first
    } catch (error) {
      console.error('Error fetching customers:', error);
      alert('Failed to fetch customers');
    }
    setLoading(false);
  };

  // Search function
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCustomers = customers.filter(customer =>
    customer._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete a customer
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer');
    }
  };

  // Edit a customer
  const handleEdit = (customer) => {
    setEditingCustomer(customer._id);
    setFormData({
      _id: customer._id,
      name: customer.name,
      address: customer.address,
      contact: customer.contact,
      email: customer.email,
    });
  };

  // Update customer details
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.contact || !formData.email) {
      alert('All fields are required!');
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/customers/${editingCustomer}`, formData);
      setEditingCustomer(null);
      setFormData({ _id: '', name: '', address: '', contact: '', email: '' });
      fetchCustomers();
      alert('Customer updated successfully.');
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer');
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container1">
      <h3><FontAwesomeIcon icon={faUsers} className="cus-icon"/>Manage Customers</h3>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by ID, name, address, contact, or email"
        value={searchTerm}
        onChange={handleSearch}
      />

      {loading ? <p>Loading customers...</p> : (
        <>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Address</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer, index) => (
                  <tr key={customer._id}>
                    <td>{index + 1}</td>
                    <td>{customer.name}</td>
                    <td>{customer.address}</td>
                    <td>{customer.contact}</td>
                    <td>{customer.email}</td>
                    <td>
                      <button className="btn1" onClick={() => handleEdit(customer)}>
                      <FaEdit/>
                      </button>
                      <button className="btn2" onClick={() => handleDelete(customer._id)}>
                      <FaTrash/>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-danger">Customer Not Found</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {editingCustomer && (
        <form onSubmit={handleUpdate} className="container1 mt-4">
          <h4>Edit Customer</h4>
          <div className="mb-3">
            <label htmlFor="name" className="form-label1">Name</label>
            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label1">Address</label>
            <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="contact" className="form-label1">Contact</label>
            <input type="number" className="form-control" id="contact" name="contact" value={formData.contact} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label1">Email</label>
            <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <button type="submit" className="btnUpdate">Update</button>
          <button type="button" className="btnCancle" onClick={() => { setEditingCustomer(null); setFormData({ _id: '', name: '', address: '', contact: '', email: '' }); }}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default ManageCustomer;
