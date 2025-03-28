import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Assuming you'll put custom styles here
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Card } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = () => {
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const suppliersResponse = await axios.get('http://localhost:5000/api/suppliers');
      setTotalSuppliers(suppliersResponse.data.length);

      const inventoryResponse = await axios.get('http://localhost:5000/api/inventory');
      setTotalInventory(inventoryResponse.data.length);

      const employeesResponse = await axios.get('http://localhost:5000/api/employees');
      setTotalEmployees(employeesResponse.data.length);

      const customersResponse = await axios.get('http://localhost:5000/api/customers');
      setTotalCustomers(customersResponse.data.length);

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
                  <Card className="custom-card-1 text-center mb-4">
                    <Card.Body>
                      <Card.Title>Total Suppliers</Card.Title>
                      <Card.Text>{totalSuppliers}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="custom-card-2 text-center mb-4">
                    <Card.Body>
                      <Card.Title>Total Inventory</Card.Title>
                      <Card.Text>{totalInventory}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="custom-card-3 text-center mb-4">
                    <Card.Body>
                      <Card.Title>Total Employees</Card.Title>
                      <Card.Text>{totalEmployees}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="custom-card-3 text-center mb-4">
                    <Card.Body>
                      <Card.Title>Total Customers</Card.Title>
                      <Card.Text>{totalCustomers}</Card.Text>
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


