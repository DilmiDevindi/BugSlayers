import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faTrash,
  faSave,
  faTimes,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./ManageOrders.css";

function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editSubcategories, setEditSubcategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]); // New: suppliers list
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    orderId: "",
    companyName: "",  // This will now be selected supplier's companyName
    productName: "",
    category: "",
    subcategory: "",
    quantity: "",
    date: "",
    status: "Pending",
  });
  const [successMsg, setSuccessMsg] = useState("");

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [ordersRes, categoriesRes, subcategoriesRes, suppliersRes] =
        await Promise.all([
          axios.get(`${BASE_URL}/api/orders`),
          axios.get(`${BASE_URL}/api/category`),
          axios.get(`${BASE_URL}/api/subcategories`),
          axios.get(`${BASE_URL}/api/suppliers`), // Fetch suppliers
        ]);

      setOrders(ordersRes.data);
      setCategories(categoriesRes.data);
      setSubcategories(subcategoriesRes.data);
      setSuppliers(suppliersRes.data); // Set suppliers here
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (cat) => {
    if (!cat) return "-";
    if (typeof cat === "string") {
      const found = categories.find((c) => c._id === cat);
      return found ? found.categoryName : "-";
    }
    return cat.categoryName || "-";
  };

  const getSubcategoryName = (subcat) => {
    if (!subcat) return "-";
    if (typeof subcat === "string") {
      const found = subcategories.find((s) => s._id === subcat);
      return found ? found.subcategoryName : "-";
    }
    return subcat.subcategoryName || "-";
  };

  const fetchSubcategoriesByCategory = async (categoryId) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/subcategories/by-category/${categoryId}`
      );
      setEditSubcategories(res.data);
    } catch (err) {
      console.error("Fetch edit subcategories failed:", err);
      setEditSubcategories([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this order?")) {
      try {
        await axios.delete(`${BASE_URL}/api/orders/${id}`);
        setOrders((prev) => prev.filter((o) => o._id !== id));
      } catch {
        alert("Delete failed.");
      }
    }
  };

  const handleEdit = (order) => {
    setEditId(order._id);
    setEditForm({
      orderId: order.orderId,
      companyName: order.companyName, // will match supplier name in dropdown
      productName: order.productName,
      category: order.category?._id || order.category || "",
      subcategory: order.subcategory?._id || order.subcategory || "",
      quantity: order.quantity,
      date: order.date?.slice(0, 10) || "",
      status: order.status || "Pending",
    });

    fetchSubcategoriesByCategory(order.category?._id || order.category);

    setSuccessMsg("");
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));

    if (name === "category") {
      fetchSubcategoriesByCategory(value);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${BASE_URL}/api/orders/${editId}`, {
        ...editForm,
        quantity: Number(editForm.quantity),
      });

      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === editId ? res.data : order))
      );
      setEditId(null);
      setSuccessMsg("Order updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      alert("Update failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Manage Orders</h2>

      {successMsg && (
        <div className="alert alert-success text-center">{successMsg}</div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Supplier</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) =>
                  editId === order._id ? (
                    <tr key={order._id}>
                      <td>
                        <input
                          name="orderId"
                          value={editForm.orderId}
                          className="form-control"
                          readOnly
                        />
                      </td>
                      <td>
                        {/* Supplier select dropdown */}
                        <select
                          name="companyName"
                          value={editForm.companyName}
                          onChange={handleEditChange}
                          className="form-control"
                          required
                        >
                          <option value="">Select Supplier</option>
                          {suppliers.map((sup) => (
                            <option key={sup._id} value={sup.companyName || sup.supplierName}>
                              {sup.companyName || sup.supplierName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          name="productName"
                          value={editForm.productName}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <select
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          className="form-control"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.categoryName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          name="subcategory"
                          value={editForm.subcategory}
                          onChange={handleEditChange}
                          className="form-control"
                          required
                        >
                          <option value="">Select Subcategory</option>
                          {editSubcategories.map((s) => (
                            <option key={s._id} value={s._id}>
                              {s.subcategoryName}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          name="quantity"
                          value={editForm.quantity}
                          onChange={handleEditChange}
                          className="form-control"
                          min={1}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          name="date"
                          value={editForm.date}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleEditChange}
                          className="form-control"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cancel">Cancel</option>
                        </select>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-success btn-sm"
                            onClick={handleEditSubmit}
                            title="Save"
                          >
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => setEditId(null)}
                            title="Cancel"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={order._id}>
                      <td>{order.orderId}</td>
                      <td>{order.companyName}</td>
                      <td>{order.productName}</td>
                      <td>{getCategoryName(order.category)}</td>
                      <td>{getSubcategoryName(order.subcategory)}</td>
                      <td>{order.quantity}</td>
                      <td>{order.date?.slice(0, 10)}</td>
                      <td>{order.status}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(order)}
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(order._id)}
                            title="Delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-end">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate("/dashboard/orders/report")}
            >
              <FontAwesomeIcon icon={faEye} /> View Report
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ManageOrders;
