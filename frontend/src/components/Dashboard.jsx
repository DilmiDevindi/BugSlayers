import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Assuming you'll put custom styles here
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Card} from 'react-bootstrap';
import axios from 'axios';

// Register components
const Dashboard = () => {
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalCategories, setTotalCategory] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get total suppliers
      const suppliersResponse = await axios.get('http://localhost:5000/api/suppliers');
      setTotalSuppliers(suppliersResponse.data.length);

      // Get total inventory items
      const inventoryResponse = await axios.get('http://localhost:5000/api/inventory');
      setTotalInventory(inventoryResponse.data.length);

      // Get total inventory items
      const categoryResponse = await axios.get('http://localhost:5000/api/inventory');
      setTotalCategory(categoryResponse.data.length);

      // Get total employees and employee data
      const employeesResponse = await axios.get('http://localhost:5000/api/employees');
      setTotalEmployees(employeesResponse.data.length);
     
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message || error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 p-0 vh-100 bg-dark" style={{ position: 'fixed', left: 0, top: 0 }}>
            <Sidebar />
          </div>

          <div className="col-md-10 offset-md-2" style={{ marginTop: '10px' }}>
            <div className="mt-4 px-3">

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
                      <Card.Title>Total Categories</Card.Title>
                      <Card.Text>{totalCategories}</Card.Text>
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
