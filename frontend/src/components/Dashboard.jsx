import { useState, useEffect } from 'react';
import { Card, Spinner, Table } from 'react-bootstrap';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Pie } from 'react-chartjs-2'; // Import Pie chart from react-chartjs-2
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const Dashboard = () => {
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [totalInventory, setTotalInventory] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [inventoryCategories, setInventoryCategories] = useState([]); // Categorized inventory
  const [supplierCategories, setSupplierCategories] = useState([]); // Supplier categorization data
  const [customers, setCustomers] = useState([]); // Customer data
  const [loading, setLoading] = useState(true);

  // Fetch inventory data from your API or database
  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory'); // Fetch inventory data from backend
      const data = await response.json();

      setTotalInventory(data.length); // Set total inventory

      // Categorize inventory by product type
      const categoryMap = {
        table: 0,
        chair: 0,
        sofa: 0,
        mattress: 0,
        cupboard: 0,
      };

      // Categorize items based on their type
      data.forEach((item) => {
        const category = item.category.toLowerCase(); // Assuming each item has a 'category' field
        if (categoryMap[category] !== undefined) {
          categoryMap[category] += 1;
        }
      });

      // Prepare data for the inventory table
      const categorizedData = Object.keys(categoryMap).map((key) => ({
        category: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize category names
        count: categoryMap[key],
      }));

      setInventoryCategories(categorizedData); // Set categorized inventory data
    } catch (error) {
      console.error('Error fetching inventory data:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch total customers from the API or database
  const fetchCustomerData = async () => {
    try {
      const response = await fetch('http://localhost:5002/api/customers'); // Fetch customer data
      const data = await response.json();
      setCustomers(data); // Set customer data
      setTotalCustomers(data.length); // Set total customers
    } catch (error) {
      console.error('Error fetching customer data:', error.message || error);
    }
  };

  // Fetch supplier data for categorization
  const fetchSupplierData = async () => {
    try {
      const response = await fetch('/api/suppliers'); // Fetch supplier data
      const data = await response.json();

      // Assuming data has categories (e.g., Supplier Type)
      const supplierCategoryCount = {
        local: 0,
        international: 0,
        regional: 0,
      };

      // Categorize suppliers based on their type
      data.forEach((supplier) => {
        const category = supplier.supplierType.toLowerCase(); // Assuming each supplier has a 'supplierType' field
        if (supplierCategoryCount[category] !== undefined) {
          supplierCategoryCount[category] += 1;
        }
      });

      // Prepare data for the Pie chart
      setSupplierCategories(supplierCategoryCount);
      setTotalSuppliers(data.length); // Set total suppliers
    } catch (error) {
      console.error('Error fetching supplier data:', error.message || error);
    }
  };

  useEffect(() => {
    fetchInventoryData();
    fetchCustomerData();
    fetchSupplierData();
  }, []);

  // Pie Chart Data for Supplier Categorization
  const supplierChartData = {
    labels: Object.keys(supplierCategories),
    datasets: [
      {
        data: Object.values(supplierCategories),
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe'],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 p-0 bg-dark vh-100" style={{ position: 'fixed', left: 0, top: 0, overflowY: 'auto' }}>
            <Sidebar />
          </div>

          <div className="col-md-10" style={{ marginLeft: '16.67%', marginTop: '10px' }}>
            <div className="container-fluid mt-4 px-3">
              <div className="row mt-5">
                {/* Total Cards */}
                <div className="col-md-4 mb-4">
                  <Card className="shadow-lg border-0 text-center rounded-3 bg-primary text-white">
                    <Card.Body>
                      <i className="bi bi-person-lines-fill fs-2 mb-3"></i>
                      <Card.Title>Total Suppliers</Card.Title>
                      {loading ? (
                        <Spinner animation="border" variant="light" />
                      ) : (
                        <Card.Text className="fs-3">{totalSuppliers}</Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-4 mb-4">
                  <Card className="shadow-lg border-0 text-center rounded-3 bg-success text-white">
                    <Card.Body>
                      <i className="bi bi-boxes fs-2 mb-3"></i>
                      <Card.Title>Total Inventory</Card.Title>
                      {loading ? (
                        <Spinner animation="border" variant="light" />
                      ) : (
                        <Card.Text className="fs-3">{totalInventory}</Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-4 mb-4">
                  <Card className="shadow-lg border-0 text-center rounded-3 bg-warning text-dark">
                    <Card.Body>
                      <i className="bi bi-person-circle fs-2 mb-3"></i>
                      <Card.Title>Total Customers</Card.Title>
                      {loading ? (
                        <Spinner animation="border" variant="dark" />
                      ) : (
                        <Card.Text className="fs-3">{totalCustomers}</Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <div className="row mt-4">
                {/* Supplier Categorization Pie Chart */}
                <div className="col-md-6 mb-4">
                  <Card className="shadow-sm border-light">
                    <Card.Body>
                      <h5 className="text-center">Supplier Categorization</h5>
                      {loading ? (
                        <Spinner animation="border" variant="primary" />
                      ) : (
                        <Pie data={supplierChartData} options={{ responsive: true, plugins: { legend: { position: 'top' }, tooltip: { callbacks: { label: (tooltipItem) => tooltipItem.raw + ' suppliers' } } } }} />
                      )}
                    </Card.Body>
                  </Card>
                </div>

                {/* Inventory Categorized Table */}
                <div className="col-lg-6 col-md-12 mb-4">
                  <Card className="shadow-sm border-light">
                    <Card.Body>
                      <h5 className="text-center">Inventory Categorization</h5>
                      {loading ? (
                        <Spinner animation="border" variant="primary" />
                      ) : (
                        <Table striped bordered hover responsive>
                          <thead>
                            <tr>
                              <th>Category</th>
                              <th>Item Count</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inventoryCategories.map((category, index) => (
                              <tr key={index}>
                                <td>{category.category}</td>
                                <td>{category.count}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      )}
                    </Card.Body>
                  </Card>
                </div>

                {/* Customer Table */}
                <div className="col-md-12 mb-4">
                  <Card className="shadow-sm border-light">
                    <Card.Body>
                      <h5 className="text-center">Customer Table</h5>
                      {loading ? (
                        <Spinner animation="border" variant="primary" />
                      ) : (
                        <>
                          <p className="text-center">
                            <strong>Total Customers: {totalCustomers}</strong>
                          </p>
                          <Table striped bordered hover responsive>
                            <thead>
                              <tr>
                                <th>Customer ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                              </tr>
                            </thead>
                            <tbody>
                              {customers.map((customer, index) => (
                                <tr key={index}>
                                  <td>{customer.id}</td>
                                  <td>{customer.name}</td>
                                  <td>{customer.email}</td>
                                  <td>{customer.phone}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </>
                      )}
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
