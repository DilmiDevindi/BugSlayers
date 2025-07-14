import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Form, Button, Alert } from "react-bootstrap";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const ManageReturn = () => {
  const [formData, setFormData] = useState({
    supplier: "",
    date: "",
    product: "",
    category: "",
    subcategory: "",
    quantity: "",
    price: "",
    status: "Pending",
    note: ""
  });
  const [returnId, setReturnId] = useState("RET-001");
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [returns, setReturns] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [supplierRes, categoryRes, returnRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/suppliers`),
        axios.get(`${BASE_URL}/categories`),
        axios.get(`${BASE_URL}/returns`)
      ]);

      setSuppliers(supplierRes.data);
      setCategories(categoryRes.data);
      setReturns(returnRes.data);

      if (returnRes.data.length > 0) {
        const last = returnRes.data[0].returnId;
        const lastNum = parseInt(last.split("-")[1]) + 1;
        setReturnId(`RET-${lastNum.toString().padStart(3, "0")}`);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleCategoryChange = async (e) => {
    const selectedCategory = e.target.value;
    setFormData({ ...formData, category: selectedCategory, subcategory: "" });
    try {
      const res = await axios.get(`${BASE_URL}/subcategories/byCategory/${selectedCategory}`);
      setSubcategories(res.data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/returns/${editingId}`, formData);
        setSuccessMessage("Return updated successfully.");
      } else {
        await axios.post(`${BASE_URL}/returns`, formData);
        setSuccessMessage("Return added successfully.");
      }

      setFormData({
        supplier: "",
        date: "",
        product: "",
        category: "",
        subcategory: "",
        quantity: "",
        price: "",
        status: "Pending",
        note: ""
      });
      setEditingId(null);
      fetchInitialData();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving return:", error);
      alert("Failed to save return.");
    }
  };

  const handleEdit = (ret) => {
    setFormData({
      supplier: ret.supplier,
      date: ret.date?.substring(0, 10),
      product: ret.product,
      category: ret.category.categoryName,
      subcategory: ret.subcategory.subcategoryName,
      quantity: ret.quantity,
      price: ret.price,
      status: ret.status,
      note: ret.note
    });
    setEditingId(ret._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this return?")) {
      await axios.delete(`${BASE_URL}/returns/${id}`);
      fetchInitialData();
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Manage Returns</h3>
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSubmit} className="border p-4 rounded mb-4 bg-light">
        <Form.Group className="mb-2">
          <Form.Label>Return ID</Form.Label>
          <Form.Control type="text" value={editingId ? "Editing..." : returnId} readOnly />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Supplier</Form.Label>
          <Form.Select name="supplier" value={formData.supplier} onChange={handleChange} required>
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s.supplierName}>{s.supplierName}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Product</Form.Label>
          <Form.Control type="text" name="product" value={formData.product} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Category</Form.Label>
          <Form.Select name="category" value={formData.category} onChange={handleCategoryChange} required>
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c.categoryName}>{c.categoryName}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Subcategory</Form.Label>
          <Form.Select name="subcategory" value={formData.subcategory} onChange={handleChange} required>
            <option value="">Select Subcategory</option>
            {subcategories.map((s) => (
              <option key={s._id} value={s.subcategoryName}>{s.subcategoryName}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Quantity</Form.Label>
          <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Product Price (LKR)</Form.Label>
          <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Status</Form.Label>
          <Form.Select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Returned">Returned</option>
            <option value="Cancel">Cancel</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Note (Optional)</Form.Label>
          <Form.Control as="textarea" name="note" value={formData.note} onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          {editingId ? "Update Return" : "Add Return"}
        </Button>
      </Form>

      <h4>Return Records</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Return ID</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Product</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Qty</th>
            <th>Price (LKR)</th>
            <th>Total</th>
            <th>Status</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {returns.map((ret) => (
            <tr key={ret._id}>
              <td>{ret.returnId}</td>
              <td>{ret.supplier}</td>
              <td>{new Date(ret.date).toLocaleDateString()}</td>
              <td>{ret.product}</td>
              <td>{ret.category?.categoryName}</td>
              <td>{ret.subcategory?.subcategoryName}</td>
              <td>{ret.quantity}</td>
              <td>{ret.price}</td>
              <td>{ret.quantity * ret.price}</td>
              <td>{ret.status}</td>
              <td>{ret.note}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(ret)}>Edit</Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(ret._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageReturn;
