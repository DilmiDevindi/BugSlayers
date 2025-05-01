import { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageSales.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPenToSquare, faClipboardList } from '@fortawesome/free-solid-svg-icons';

const ManageSales = () => {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermDate, setSearchTermDate] = useState('');
  const [editingSale, setEditingSale] = useState(null);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('/api/sales/');
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales records:', error);
    }
  };

  const deleteSale = async (id) => {
    try {
      await axios.delete(`/api/sales/${id}`);
      setSales(sales.filter((sale) => sale._id !== id));
      alert('Sale record deleted successfully!');
    } catch (error) {
      console.error('Error deleting sale record:', error);
    }
  };

  const handleEditClick = (sale) => {
    setEditingSale({ ...sale });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingSale((prev) => {
      const updatedSale = { ...prev, [name]: value };
      if (name === 'quantity' || name === 'price') {
        updatedSale.totalAmount = updatedSale.quantity * updatedSale.price;
      }
      return updatedSale;
    });
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
      (sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.productName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (searchTermDate
        ? new Date(sale.date).toLocaleDateString() === new Date(searchTermDate).toLocaleDateString()
        : true)
  );

  return (
    <div className="container mt-4">
      <h3><FontAwesomeIcon icon={faClipboardList} className="ms-icon" /> Manage Sales Records</h3>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by customer or product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <input
          type="date"
          className="form-control"
          value={searchTermDate}
          onChange={(e) => setSearchTermDate(e.target.value)}
        />
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer Name</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Amount</th>
            <th>Remark</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.map((sale) => (
            <tr key={sale._id}>
              <td>{sale._id}</td>
              <td>{sale.customerName}</td>
              <td>{sale.productName}</td>
              <td>{sale.quantity}</td>
              <td>{sale.price}</td>
              <td>{sale.totalAmount}</td>
              <td>{sale.remark}</td>
              <td>{new Date(sale.date).toLocaleDateString()}</td>
              <td>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditClick(sale)}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteSale(sale._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingSale && (
        <form onSubmit={handleEditSubmit} className="mb-4 border p-3 rounded">
          <h3><FontAwesomeIcon icon={faPenToSquare} className="ms-icon" /> Edit Sale</h3>
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
              type="number"
              name="totalAmount"
              value={editingSale.totalAmount}
              className="form-control"
              placeholder="Total Amount"
              readOnly
            />
          </div>
          <div className="mb-2">
            <input
              type="text"
              name="remark"
              value={editingSale.remark}
              onChange={handleEditChange}
              className="form-control"
              placeholder="Remark"
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
          <button type="submit" className="btn btn-primary me-2">Update</button>
          <button type="button" className="btn btn-secondary" onClick={() => setEditingSale(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
};

export default ManageSales;
