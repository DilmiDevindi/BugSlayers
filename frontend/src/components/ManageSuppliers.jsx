import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const ManageSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [showTable, setShowTable] = useState(false); // State to toggle table visibility

  useEffect(() => {
    if (showTable) {
      fetchSuppliers();
    }
  }, [showTable, search, filter]);

  // Function to fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/suppliers', {
        params: { search, filter }
      });
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error.response ? error.response.data : error.message);
    }
  };

  // Function to delete a supplier
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
      setSuppliers(suppliers.filter(supplier => supplier._id !== id)); // Update UI
    } catch (error) {
      console.error('Error deleting supplier:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Manage Suppliers</h2>

      {/* Form Section */}
      <div className="card p-3 mb-3">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by products..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {/* View/Hide Button */}
        <div className="mb-3 text-center">
          <button className="btn btn-info" onClick={() => setShowTable(!showTable)}>
            {showTable ? 'Hide' : 'View'}
          </button>
        </div>
      </div>

      {/* Display Table Below the Button */}
      {showTable && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Date</th> {/* New Date Column */}
              <th>Supplier Name</th>
              <th>Phone</th>
              <th>Fax</th> {/* Added Fax Column */}
              <th>Email</th>
              <th>Address</th>
              <th>Supply Products</th>
              <th>Payment Terms</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.length > 0 ? (
              suppliers.map(supplier => (
                <tr key={supplier._id}>
                  <td>{supplier.date ? new Date(supplier.date).toLocaleDateString() : 'N/A'}</td> {/* Date Column */}
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.phone}</td>
                  <td>{supplier.fax || 'N/A'}</td> {/* Fax Column (Displays "N/A" if empty) */}
                  <td>{supplier.email}</td>
                  <td>{supplier.address}</td>
                  <td>{supplier.supplyProducts}</td>
                  <td>{supplier.paymentTerms}</td>
                  <td>
                    <Link to={`/dashboard/suppliers/edit/${supplier._id}`} className="btn btn-warning me-2">Edit</Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(supplier._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">No suppliers found</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageSuppliers;
