import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Card, Table } from "react-bootstrap";
import axios from "axios";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [latestSuppliers, setLatestSuppliers] = useState([]);
  const [totalInventory, setTotalInventory] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalCategories, setTotalCategory] = useState(0);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const suppliersResponse = await axios.get("http://localhost:5001/api/suppliers");
      const suppliers = suppliersResponse.data;
      setTotalSuppliers(suppliers.length);
      setLatestSuppliers(suppliers.slice(0, 5)); // latest 5

      // Group by supplierName
      const supplierNameMap = {};
      suppliers.forEach((supplier) => {
        const name = supplier.supplierName || "Unknown";
        supplierNameMap[name] = (supplierNameMap[name] || 0) + 1;
      });

      const formattedPieData = Object.entries(supplierNameMap).map(([name, value]) => ({
        name,
        value,
      }));
      setPieData(formattedPieData);

      const inventoryResponse = await axios.get("http://localhost:5001/api/inventory");
      setTotalInventory(inventoryResponse.data.length);

      const customersResponse = await axios.get("http://localhost:5001/api/customers");
      setTotalCustomers(customersResponse.data.length);

      const categoryResponse = await axios.get("http://localhost:5001/api/category");
      setTotalCategory(categoryResponse.data.length);

    } catch (error) {
      console.error("Error fetching dashboard data:", error.message || error);
    }
  };

  const COLORS = ["#007bff", "#28a745", "#ffc107", "#dc3545", "#17a2b8", "#6c757d", "#20c997", "#6610f2", "#fd7e14"];

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2 p-0 bg-dark vh-100" style={{ position: "fixed", left: 0, top: 0, overflowY: "auto" }}>
            <Sidebar />
          </div>

          <div className="col-md-10" style={{ marginLeft: "16.67%", marginTop: "10px" }}>
            <div className="container-fluid mt-4 px-3">
              <div className="row mt-5">
                <div className="col-md-3">
                  <Card className="text-center mb-4" style={{ backgroundColor: "#007bff", color: "white", padding: "1px" }}>
                    <Card.Body>
                      <i className="bi bi-truck" style={{ fontSize: "50px" }}></i>
                      <Card.Title className="mt-3">Total Suppliers</Card.Title>
                      <Card.Text>{totalSuppliers}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="text-center mb-4" style={{ backgroundColor: "#28a745", color: "white", padding: "1px" }}>
                    <Card.Body>
                      <i className="bi bi-boxes" style={{ fontSize: "50px" }}></i>
                      <Card.Title className="mt-3">Total Inventory</Card.Title>
                      <Card.Text>{totalInventory}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="text-center mb-4" style={{ backgroundColor: "#ffc107", color: "white", padding: "1px" }}>
                    <Card.Body>
                      <i className="bi bi-person-lines-fill" style={{ fontSize: "50px" }}></i>
                      <Card.Title className="mt-3">Total Customers</Card.Title>
                      <Card.Text>{totalCustomers}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
                <div className="col-md-3">
                  <Card className="text-center mb-4" style={{ backgroundColor: "#dc3545", color: "white", padding: "1px" }}>
                    <Card.Body>
                      <i className="bi bi-list" style={{ fontSize: "50px" }}></i>
                      <Card.Title className="mt-3">Total Categories</Card.Title>
                      <Card.Text>{totalCategories}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Card className="mb-4">
                    <Card.Body>
                      <Card.Title>Recently Added Suppliers</Card.Title>
                      <Table striped bordered hover responsive>
                        <thead className="table-white">
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
                            latestSuppliers.map((supplier) => (
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

                <div className="col-md-6 d-flex align-items-center justify-content-center">
  <Card className="mb-4" style={{ width: "100%", height: "400px" }}>
    <Card.Body>
      <Card.Title className="text-center mb-3" style={{ fontSize: "16px" }}>Supplier Category Distribution</Card.Title>
      <div className="d-flex align-items-center justify-content-center" style={{ height: "90%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
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
