import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Assuming you'll put custom styles here
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Card, Table } from 'react-bootstrap';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalCategories, setTotalCategory] = useState(0);
  const [categoryStock, setCategoryStock] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const suppliersResponse = await axios.get('http://localhost:5001/api/suppliers');
      setTotalSuppliers(suppliersResponse.data.length);

      const customersResponse = await axios.get('http://localhost:5001/api/customers');
      setTotalCustomers(customersResponse.data.length);

      const inventoryResponse = await axios.get('http://localhost:5001/api/inventory');
      setTotalInventory(inventoryResponse.data.length);

      const categoryResponse = await axios.get('http://localhost:5001/api/category');
      setTotalCategory(categoryResponse.data.length);

      // Aggregate stock levels by category
      const categoryMap = {};
      inventoryResponse.data.forEach((item) => {
        const stockCount = Number(item.quantity) || 0; // Ensure it's a valid number
        if (categoryMap[item.category]) {
          categoryMap[item.category] += stockCount;
        } else {
          categoryMap[item.category] = stockCount;
        }
      });

      // Convert the map to an array for the graph
      const categoryStockData = Object.keys(categoryMap).map((category) => ({
        category,
        inStock: categoryMap[category],
      }));
      setCategoryStock(categoryStockData);
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
          <div className="col-md-10">
            <div className="container-fluid mt-4 px-3">
              <div className="row mt-5">
                <div className="col-md-3">
                  <Card className="custom-card-1 text-center mb-4">
                    <Card.Body>
                      <Card.Title className="mt-3">Total Suppliers</Card.Title>
                      <Card.Text>{totalSuppliers}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="custom-card-2 text-center mb-4">
                    <Card.Body>
                      <Card.Title className="mt-3">Total Customers</Card.Title>
                      <Card.Text>{totalCustomers}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="custom-card-3 text-center mb-4">
                    <Card.Body>
                      <Card.Title className="mt-3">Total Inventory</Card.Title>
                      <Card.Text>{totalInventory}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="custom-card-4 text-center mb-4">
                    <Card.Body>
                      <Card.Title className="mt-3">Total Categories</Card.Title>
                      <Card.Text>{totalCategories}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              {/* Category-based Inventory Report */}
              <div className="row">
                <div className="col-md-6">
                  <Card className="mt-4">
                    <Card.Body>
                      <Card.Title>Inventory Stock by Category</Card.Title>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>Category</th>
                            <th>Stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categoryStock.map((item, index) => (
                            <tr key={item.category}>
                              <td>{index + 1}</td>
                              <td>{item.category}</td>
                              <td>{item.inStock}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </div>

                {/* Inventory Bar Chart by Category */}
                <div className="col-md-6">
                  <Card className="mt-5">
                    <Card.Body>
                      <Card.Title>Inventory Stock Levels by Category</Card.Title>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryStock}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="inStock" fill="#A86566" />
                        </BarChart>
                      </ResponsiveContainer>
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
