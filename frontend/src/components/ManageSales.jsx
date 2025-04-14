import { useState, useEffect } from 'react';
import axios from 'axios';

const ManageSales = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSale, setEditingSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/sales/');
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales records:', error);
    }
  };

  const deleteSale = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/sales/${id}`);
      setSales(sales.filter((sale) => sale._id !== id));
      alert('Sale record deleted successfully!');
    } catch (error) {
      console.error('Error deleting sale record:', error);
    }
  };

  const handleEditClick = (sale) => {
    setEditingSale({ ...sale }); // Set current sale for editing
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingSale((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/sales/${editingSale._id}`, editingSale);
      fetchSales();
      setEditingSale(null);
      alert('Sale record updated successfully!');
    } catch (error) {
      console.error('Error updating sale record:', error);
    }
  };

  const filteredSales = sales.filter(
    (sale) =>
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h3>Manage Sales Records</h3>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by customer or product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Edit Sale Form */}
      {editingSale && (
        <form onSubmit={handleEditSubmit} className="mb-4 border p-3 rounded">
          <h5>Edit Sale</h5>
          <div className="mb-2">
            <input
              type="text"
              name="customerName"
              value={editingSale.customerName}
              onChange={handleEditChange}
              className="form-control"
              placeholder="Customer Name"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              name="productName"
              value={editingSale.productName}
              onChange={handleEditChange}
              className="form-control"
              placeholder="Product Name"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="number"
              name="quantity"
              value={editingSale.quantity}
              onChange={handleEditChange}
              className="form-control"
              placeholder="Quantity"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="number"
              name="price"
              value={editingSale.price}
              onChange={handleEditChange}
              className="form-control"
              placeholder="Price"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="date"
              name="date"
              value={editingSale.date.slice(0, 10)}
              onChange={handleEditChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary me-2">
            Update
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => setEditingSale(null)}>
            Cancel
          </button>
        </form>
      )}

      {/* Sales Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale._id}>
              <td>{sale.customerName}</td>
              <td>{sale.productName}</td>
              <td>{sale.quantity}</td>
              <td>{sale.price}</td>
              <td>{new Date(sale.date).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditClick(sale)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteSale(sale._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSales;
