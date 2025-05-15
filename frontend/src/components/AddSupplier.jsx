import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck } from '@fortawesome/free-solid-svg-icons';
import './Supplier.css';

const ManageSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    _id: '',
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/suppliers');
      setSuppliers(res.data.reverse());
    } catch (err) {
      console.error('Error fetching suppliers:', err);
      alert('Failed to fetch suppliers.');
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone2.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    try {
      await axios.delete(`/api/suppliers/${id}`);
      fetchSuppliers();
    } catch (err) {
      console.error('Error deleting supplier:', err);
      alert('Failed to delete supplier.');
    }
  };

  const handleEdit = (supplier) => {
    setEditingSupplier(supplier._id);
    setFormData({ ...supplier });
  };

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);
  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.supplierName || !formData.phone1 || !formData.address) {
      alert('Supplier name, contact number and address are required!');
      return;
    }

    if (!validatePhoneNumber(formData.phone1)) {
      alert('Primary contact must be a 10-digit number');
      return;
    }

    if (formData.phone2 && formData.phone2 === formData.phone1) {
      alert('Primary and Secondary Contact Numbers must not be the same');
      return;
    }

    if (formData.email && !validateEmail(formData.email)) {
      alert('Email must be a valid @gmail.com address');
      return;
    }

    try {
      await axios.put(`/api/suppliers/${editingSupplier}`, formData);
      setEditingSupplier(null);
      setFormData({
        _id: '',
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
      fetchSuppliers();
      alert('Supplier updated successfully!');
    } catch (err) {
      console.error('Error updating supplier:', err);
      alert('Failed to update supplier.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container1">
      <h4 className="manage-title">
        <FontAwesomeIcon icon={faTruck} className="cus-icon" /> Manage Suppliers
      </h4>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name, contact, or address"
        value={searchTerm}
        onChange={handleSearch}
      />

      {loading ? <p>Loading suppliers...</p> : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Supplier Name</th>
              <th>Primary Contact</th>
              <th>Secondary Contact</th>
              <th>Email</th>
              <th>Address</th>
              <th>Products</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.length > 0 ? (
              filteredSuppliers.map((supplier, index) => (
                <tr key={supplier._id}>
                  <td>{index + 1}</td>
                  <td>{supplier.supplierName}</td>
                  <td>{supplier.phone1}</td>
                  <td>{supplier.phone2}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.address}</td>
                  <td>{supplier.supplyProducts}</td>
                  <td>{supplier.paymentTerms}</td>
                  <td>
                    <button className="btn1" onClick={() => handleEdit(supplier)}><FaEdit /></button>
                    <button className="btn2" onClick={() => handleDelete(supplier._id)}><FaTrash /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-danger">No Matching Supplier Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {editingSupplier && (
        <div className="edit-form-container">
          <form onSubmit={handleUpdate}>
            <h4 className="add-title"><FontAwesomeIcon icon={faEdit} /> Edit Supplier</h4>
            <div className="mb-3">
              <label>Supplier Name</label>
              <input type="text" name="supplierName" value={formData.supplierName} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Primary Contact</label>
              <input type="text" name="phone1" value={formData.phone1} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Secondary Contact</label>
              <input type="text" name="phone2" value={formData.phone2} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Fax</label>
              <input type="text" name="fax" value={formData.fax} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label>Supply Products</label>
              <input type="text" name="supplyProducts" value={formData.supplyProducts} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Payment Terms</label>
              <input type="text" name="paymentTerms" value={formData.paymentTerms} onChange={handleChange} />
            </div>
            <button type="submit" className="btnUpdate">Update</button>
            <button type="button" className="btnClose" onClick={() => setEditingSupplier(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageSupplier;
