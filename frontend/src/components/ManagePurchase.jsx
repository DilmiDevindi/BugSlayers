import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManagePurchases.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faClipboardList } from "@fortawesome/free-solid-svg-icons";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const ManagePurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    fetchPurchases();
    axios.get(`${BASE_URL}/api/category`).then(res => setCategories(res.data));
    axios.get(`${BASE_URL}/api/suppliers`).then(res => setSuppliers(res.data));
    axios.get(`${BASE_URL}/api/subcategories`).then(res => setAllSubcategories(res.data));
  }, []);

  useEffect(() => {
    if (editingPurchase?.category) {
      axios
        .get(`${BASE_URL}/api/subcategories/by-category/${editingPurchase.category}`)
        .then((res) => setSubcategories(res.data))
        .catch(() => setSubcategories([]));
    } else {
      setSubcategories([]);
    }
  }, [editingPurchase?.category]);

  const fetchPurchases = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/purchase`);
      setPurchases(res.data);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this purchase?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/purchase/${id}`);
      setPurchases(purchases.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Error deleting purchase:", error);
    }
  };

  const handleEditClick = (purchase) => {
    const dateStr = purchase.date ? purchase.date.slice(0, 10) : "";
    setEditingPurchase({
      ...purchase,
      date: dateStr,
      discount: purchase.discount?.replace("%", "") ?? 0,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingPurchase((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const {
      supplier,
      product,
      category,
      subcategory,
      quantity,
      price,
      discount,
      date,
      _id,
    } = editingPurchase;

    if (!supplier || !product || !category || !subcategory || !quantity || !price || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    const qty = Number(quantity);
    const unitPrice = Number(price);
    const discountValue = Number(discount) || 0;
    const subtotal = qty * unitPrice;
    const discountAmount = (subtotal * discountValue) / 100;
    const total = subtotal - discountAmount;

    try {
      await axios.put(`${BASE_URL}/api/purchase/${_id}`, {
        supplier,
        product,
        category,
        subcategory,
        quantity: qty,
        price: unitPrice,
        discount: `${discountValue}%`,
        total,
        date,
      });
      setEditingPurchase(null);
      fetchPurchases();
    } catch (error) {
      console.error("Error updating purchase:", error);
      alert("Failed to update purchase. Please try again.");
    }
  };

  const calculateTotal = (purchase) => {
    const qty = Number(purchase.quantity) || 0;
    const price = Number(purchase.price) || 0;
    const discount = Number(purchase.discount?.replace("%", "")) || 0;
    const subtotal = qty * price;
    const discountAmount = (subtotal * discount) / 100;
    return Math.max(0, subtotal - discountAmount);
  };

  // Remove filtering by date here, only filter by searchTerm (supplier/product)
  const filteredPurchases = purchases.filter((purchase) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      purchase.supplier?.toLowerCase().includes(searchLower) ||
      purchase.product?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="manage-purchases-container">
      <h2>
        <FontAwesomeIcon icon={faClipboardList} className="ms-icon" /> Manage Purchases Records
      </h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by supplier or product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Removed date filter input */}

      <table className="purchases-table table table-striped table-bordered text-center">
        <thead>
          <tr>
            <th>Purchase ID</th>
            <th>Supplier</th>
            <th>Product</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Quantity</th>
            <th>Price (Rs.)</th>
            <th>Discount (%)</th>
            <th>Total Purchase (Rs.)</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPurchases.map((purchase, index) => {
            const total = calculateTotal(purchase);
            const discount = purchase.discount?.replace("%", "") || 0;

            return (
              <tr key={purchase._id}>
                <td>{purchase.purchaseId || `PUR-${String(index + 1).padStart(3, "0")}`}</td>
                <td>{purchase.supplier}</td>
                <td>{purchase.product}</td>
                <td>{categories.find(c => c._id === purchase.category)?.categoryName || purchase.category}</td>
                <td>{allSubcategories.find(s => s._id === purchase.subcategory)?.subcategoryName || purchase.subcategory}</td>
                <td>{purchase.quantity}</td>
                <td>{Number(purchase.price).toFixed(2)}</td>
                <td>{discount > 0 ? `${discount}%` : "-"}</td>
                <td>{total.toFixed(2)}</td>
                <td>{new Date(purchase.date).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2 justify-content-center">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleEditClick(purchase)}
                    >
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(purchase._id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {filteredPurchases.length === 0 && (
            <tr>
              <td colSpan="11" className="text-center">
                No purchases found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingPurchase && (
        <div className="edit-form-container mt-4">
          <form onSubmit={handleEditSubmit} className="form">
            <h4 className="form-title mb-4 text-lg font-semibold">
              <FontAwesomeIcon icon={faEdit} /> Edit Purchase
            </h4>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label>Supplier Name</label>
                <select
                  name="supplier"
                  value={editingPurchase.supplier}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((s) => (
                    <option key={s._id} value={s.supplierName}>
                      {s.supplierName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label>Product Name</label>
                <input
                  type="text"
                  name="product"
                  value={editingPurchase.product}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Category</label>
                <select
                  name="category"
                  value={editingPurchase.category}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label>Subcategory</label>
                <select
                  name="subcategory"
                  value={editingPurchase.subcategory}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.subcategoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={editingPurchase.quantity}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={editingPurchase.price}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="flex flex-col">
                <label>Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={editingPurchase.discount}
                  onChange={handleEditChange}
                  min="0"
                  max="100"
                />
              </div>

              <div className="flex flex-col">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={editingPurchase.date}
                  onChange={handleEditChange}
                  required
                />
              </div>
            </div>

            <div className="total mt-3">
              <strong>Total:</strong> Rs. {calculateTotal(editingPurchase).toFixed(2)}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button type="submit" className="btnUpdate">
                Update
              </button>
              <button
                type="button"
                className="btnClose"
                onClick={() => setEditingPurchase(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManagePurchases;
