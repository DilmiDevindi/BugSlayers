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
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const suppliersResponse = await axios.get('/api/suppliers');
      setTotalSuppliers(suppliersResponse.data.length);
  
      const inventoryResponse = await axios.get('/api/inventory');
      setTotalInventory(inventoryResponse.data.length);
  
      const customersResponse = await axios.get('/api/customers');
      setTotalCustomers(customersResponse.data.length);
  
      const categoryResponse = await axios.get('/api/category');
      setTotalCategory(categoryResponse.data.length);
  
      const categoryList = categoryResponse.data; // [{ _id, name }]
  
      // Aggregate stock levels by category ID
      const categoryMap = {};
      inventoryResponse.data.forEach((item) => {
        const stockCount = Number(item.quantity) || 0;
        if (categoryMap[item.category]) {
          categoryMap[item.category] += stockCount;
        } else {
          categoryMap[item.category] = stockCount;
        }
      });
  
      const categoryStockData = Object.keys(categoryMap).map((categoryId) => {
        const category = categoryList.find((cat) => cat._id === categoryId);
        return {
          category: category ? category.categoryName : categoryId, // use category.categoryName instead of category.name
          inStock: categoryMap[categoryId],
        };
      });
      setCategoryStock(categoryStockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message || error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Dummy sales data
      const dummySalesData = [
        { month: 'January', sales: 500 },
        { month: 'February', sales: 700 },
        { month: 'March', sales: 800 },
        { month: 'April', sales: 600 },
        { month: 'May', sales: 900 },
        { month: 'June', sales: 750 },
        { month: 'July', sales: 650 },
        { month: 'August', sales: 850 },
        { month: 'September', sales: 700 },
        { month: 'October', sales: 950 },
        { month: 'November', sales: 900 },
        { month: 'December', sales: 1100 },
      ];
      setSalesData(dummySalesData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error.message || error);
    }
  };
  
const salesChartData = {
labels: salesData.map((data) => data.month),
datasets: [
  {
    label: 'Sales',
    backgroundColor: 'rgba(75, 192, 192, 0.6)',
    borderColor: 'rgba(75, 192, 192, 1)',
    borderWidth: 1,
    hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)',
    hoverBorderColor: 'rgba(75, 192, 192, 1)',
    data: salesData.map((data) => data.sales),
  },
],
};

  
return (
  <>
    <Navbar />
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        <div
          className="col-md-2 p-0 bg-dark vh-100"
          style={{ position: 'fixed', left: 0, top: 0, overflowY: 'auto' }}
        >
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
                    <Card.Title>Total Customers</Card.Title>
                    <Card.Text>{totalCustomers}</Card.Text>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-3">
                <Card className="custom-card-4 text-center mb-4">
                  <Card.Body>
                    <Card.Title>Total Categories</Card.Title>
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

            {/* Sales Chart Section */}
            <div className="row mt-4">
              <div className="col-12">
                <h3>Sales</h3>
                <Card className="mt-3">
                  <Card.Body>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#4BC0C0" />
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


