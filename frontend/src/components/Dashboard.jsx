import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Assuming you'll put custom styles here
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Card, Table } from 'react-bootstrap';
import axios from 'axios';


const Dashboard = () => {
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [latestSuppliers, setLatestSuppliers] = useState([]);
  const [latestCustomers, setLatestCustomers] = useState([]);
  const [latestInventory, setLatestInventory] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch suppliers data from the manage supplier endpoint
      const suppliersResponse = await axios.get('http://localhost:5001/api/suppliers');
      setTotalSuppliers(suppliersResponse.data.length);
      setLatestSuppliers(suppliersResponse.data.slice(0, 5)); // Fetch latest 5 suppliers

      // Fetch inventory data from the manage inventory endpoint
      const inventoryResponse = await axios.get('http://localhost:5001/api/inventory');
      setTotalInventory(inventoryResponse.data.length);
      setLatestInventory(inventoryResponse.data.slice(0, 5)); // Fetch latest 5 inventory items

      // Fetch customers data from the manage customer endpoint
      const customersResponse = await axios.get('http://localhost:5001/api/customers');
      setTotalCustomers(customersResponse.data.length);
      setLatestCustomers(customersResponse.data.slice(0, 5)); // Fetch latest 5 customers

    } catch (error) {
      console.error('Error fetching dashboard data:', error.message || error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-2 p-0 bg-dark vh-100" style={{ position: 'fixed', left: 0, top: 0, overflowY: 'auto' }}>
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="col-md-10" style={{ marginLeft: '16.67%', marginTop: '10px' }}>
            <div className="container-fluid mt-4 px-3">
              <div className="row mt-5">
                <div className="col-md-3">
                  <Card className="custom-card-1 text-center mb-4" style={{ backgroundColor: '#007bff', color: 'white', padding: '20px' }}>
                    <Card.Body>
                      {/* Supplier Section Icon */}
                      <i className="bi bi-truck" style={{ fontSize: '50px' }}></i>
                      <Card.Title className="mt-3">Total Suppliers</Card.Title>
                      <Card.Text>{totalSuppliers}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="custom-card-2 text-center mb-4" style={{ backgroundColor: '#28a745', color: 'white', padding: '20px' }}>
                    <Card.Body>
                      {/* Inventory Section Icon */}
                      <i className="bi bi-boxes" style={{ fontSize: '50px' }}></i>
                      <Card.Title className="mt-3">Total Inventory</Card.Title>
                      <Card.Text>{totalInventory}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="custom-card-3 text-center mb-4" style={{ backgroundColor: '#ffc107', color: 'white', padding: '20px' }}>
                    <Card.Body>
                      {/* Customer Section Icon */}
                      <i className="bi bi-person-lines-fill" style={{ fontSize: '50px' }}></i>
                      <Card.Title className="mt-3">Total Customers</Card.Title>
                      <Card.Text>{totalCustomers}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              {/* Supplier Report Table */}
              <div className="row">
                <div className="col-md-12">
                  <Card className="custom-card-1 mb-4">
                    <Card.Body>
                      <Card.Title>Supplier Report (Latest 5)</Card.Title>
                      <Table striped bordered hover responsive>
                        <thead className="table-dark">
                          <tr>
                            <th>Date</th>
                            <th>Supplier Name</th>
                            <th>Contact Number</th>
                            <th>Supply Products</th>
                          </tr>
                        </thead>
                        <tbody>
                          {latestSuppliers.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="text-center">No suppliers found</td>
                            </tr>
                          ) : (
                            latestSuppliers.map(supplier => (
                              <tr key={supplier._id}>
                                <td>{new Date(supplier.date).toLocaleDateString()}</td>
                                <td>{supplier.supplierName}</td>
                                <td>{supplier.phone1}</td>
                                <td>{supplier.supplyProducts}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              {/* Customer Report Table */}
              <div className="row">
                <div className="col-md-12">
                  <Card className="custom-card-2 mb-4">
                    <Card.Body>
                      <Card.Title>Customer Report (Latest 5)</Card.Title>
                      <Table striped bordered hover responsive>
                        <thead className="table-dark">
                          <tr>
                            <th>Date</th>
                            <th>Customer Name</th>
                            <th>Contact Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {latestCustomers.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-center">No customers found</td>
                            </tr>
                          ) : (
                            latestCustomers.map(customer => (
                              <tr key={customer._id}>
                                <td>{new Date(customer.date).toLocaleDateString()}</td>
                                <td>{customer.customerName}</td>
                                <td>{customer.contactNumber}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              {/* Inventory Report Table */}
              <div className="row">
                <div className="col-md-12">
                  <Card className="custom-card-3 mb-4">
                    <Card.Body>
                      <Card.Title>Inventory Report (Latest 5)</Card.Title>
                      <Table striped bordered hover responsive>
                        <thead className="table-dark">
                          <tr>
                            <th>Product Category</th>
                            <th>Product Title</th>
                            <th>Product Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {latestInventory.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="text-center">No inventory found</td>
                            </tr>
                          ) : (
                            latestInventory.map(item => (
                              <tr key={item._id}>
                                <td>{item.productCategory}</td>
                                <td>{item.productTitle}</td>
                                <td>{item.productQuantity}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;