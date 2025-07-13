import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const ManageReturn = () => {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const [returns, setReturns] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    returnId: "",
    supplierName: "",
    date: "",
    category: "",
    subcategory: "",
    product: "",
    quantity: "",
    productPrice: "",
    status: "",
    note: "",
  });

  // Fetch all returns
  const fetchReturns = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/returns`);
      setReturns(res.data);
    } catch (err) {
      console.error("Failed to fetch returns:", err);
      setMessage("Failed to fetch returns: " + (err.response?.data?.message || err.message));
    }
  };

  // Fetch suppliers
  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers`);
      setSuppliers(res.data);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      setMessage("Failed to fetch suppliers: " + (err.response?.data?.message || err.message));
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/category`);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setMessage("Failed to fetch categories: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    fetchReturns();
    fetchSuppliers();
    fetchCategories();
  }, []);

  // Fetch subcategories based on selected category
  useEffect(() => {
    if (form.category) {
      axios
        .get(`${BASE_URL}/api/subcategories/by-category/${form.category}`)
        .then((res) => {
          setSubcategories(res.data);
          // Reset subcategory if not in new list
          if (!res.data.find((sub) => sub._id === form.subcategory)) {
            setForm((prev) => ({ ...prev, subcategory: "" }));
          }
        })
        .catch((err) => {
          console.error("Error fetching subcategories:", err);
          setMessage("Failed to fetch subcategories: " + (err.response?.data?.message || err.message));
        });
    } else {
      setSubcategories([]);
      setForm((prev) => ({ ...prev, subcategory: "" }));
    }
  }, [form.category]);

  // Auto-generate next Return ID (only when not editing)
  useEffect(() => {
    if (!editingId) {
      generateNextReturnId().then((newId) => {
        setForm((prev) => ({ ...prev, returnId: newId }));
      });
    }
  }, [returns, editingId]);

  // Generate next returnId like RET-001, RET-002 ...
  const generateNextReturnId = async () => {
    if (editingId) return form.returnId; // don't change when editing
    try {
      const res = await axios.get(`${BASE_URL}/api/returns`);
      const returns = res.data;
      if (!returns || returns.length === 0) return "RET-001";
      const numbers = returns
        .map((r) => {
          const match = r.returnId?.match(/^RET-(\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((n) => !isNaN(n));
      const maxNumber = numbers.length > 0 ? Math.max(...numbers) : 0;
      return `RET-${(maxNumber + 1).toString().padStart(3, "0")}`;
    } catch (err) {
      console.error("Error generating returnId:", err);
      setMessage("Failed to generate unique return ID: " + (err.response?.data?.message || err.message));
      return "RET-001";
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numeric input for quantity and productPrice
    if (
      (name === "productPrice" || name === "quantity") &&
      value !== "" &&
      !/^\d*\.?\d*$/.test(value)
    )
      return;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Calculate total price helper
  const calculateTotal = (price, qty) => {
    const p = parseFloat(price);
    const q = parseFloat(qty);
    return isNaN(p) || isNaN(q) ? 0 : p * q;
  };

  // Submit form handler (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Validate required fields
    const requiredFields = [
      "returnId",
      "supplierName",
      "date",
      "category",
      "subcategory",
      "product",
      "quantity",
      "productPrice",
      "status",
    ];
    for (const field of requiredFields) {
      if (!form[field]) {
        setMessage(`Please fill required field: ${field}`);
        return;
      }
    }

    // Validate date format
    if (isNaN(Date.parse(form.date))) {
      setMessage("Invalid date format. Use YYYY-MM-DD.");
      return;
    }

    // Validate category and subcategory selected
    const selectedCategory = categories.find((cat) => cat._id === form.category);
    if (!selectedCategory) {
      setMessage("Selected category is invalid.");
      return;
    }
    const selectedSubcategory = subcategories.find((sub) => sub._id === form.subcategory);
    if (!selectedSubcategory) {
      setMessage("Selected subcategory is invalid.");
      return;
    }

    // Prepare payload with category and subcategory names (backend expects strings)
    const payload = {
      returnId: form.returnId,
      supplierName: form.supplierName,
      date: form.date,
      category: selectedCategory.categoryName,
      subcategory: selectedSubcategory.subcategoryName,
      product: form.product,
      quantity: Number(form.quantity),
      productPrice: Number(form.productPrice),
      status: form.status,
      note: form.note || "",
    };

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/returns/${editingId}`, payload);
        setMessage("Return updated successfully.");
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/api/returns`, payload);
        setMessage("Return added successfully.");
      }

      setForm({
        returnId: await generateNextReturnId(),
        supplierName: "",
        date: "",
        category: "",
        subcategory: "",
        product: "",
        quantity: "",
        productPrice: "",
        status: "",
        note: "",
      });

      fetchReturns();
    } catch (err) {
      console.error("Save error:", err.response?.data || err.message);
      setMessage("Failed to save return: " + (err.response?.data?.message || err.message));
    }
  };

  // Edit button handler
  const handleEdit = (ret) => {
    setEditingId(ret._id);

    // Find category and subcategory IDs by matching names from return object
    const cat = categories.find((c) => c.categoryName === ret.category);
    const sub = subcategories.find((s) => s.subcategoryName === ret.subcategory);

    setForm({
      returnId: ret.returnId,
      supplierName: ret.supplierName || "",
      date: ret.date ? new Date(ret.date).toISOString().split("T")[0] : "",
      category: cat ? cat._id : "",
      subcategory: sub ? sub._id : "",
      product: ret.product,
      quantity: ret.quantity?.toString() || "",
      productPrice: ret.productPrice?.toString() || "",
      status: ret.status,
      note: ret.note || "",
    });
  };

  // Delete button handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this return?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/returns/${id}`);
      setMessage("Return deleted.");
      fetchReturns();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
      setMessage("Failed to delete return: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="container1" style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      <h4 className="manage-title" style={{ marginBottom: "20px" }}>Manage Returns</h4>

      {message && (
        <div
          className="alert alert-info"
          style={{
            marginBottom: "20px",
            padding: "10px",
            backgroundColor: "#d1ecf1",
            borderRadius: "4px",
            color: "#0c5460",
          }}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-6" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
          {/* Return ID */}
          <div className="flex flex-col">
            <label>Return ID</label>
            <input
              type="text"
              name="returnId"
              value={form.returnId}
              disabled
              className="border border-gray-300 bg-gray-100 px-3 py-2 rounded-md cursor-not-allowed"
              style={{ padding: "8px", borderRadius: "4px" }}
            />
          </div>

          {/* Supplier */}
          <div className="flex flex-col">
            <label>Supplier</label>
            <select
              name="supplierName"
              value={form.supplierName}
              onChange={handleChange}
              required
              className="border border-gray-300 px-3 py-2 rounded-md"
              style={{ padding: "8px", borderRadius: "4px" }}
            >
              <option value="">-- Select Supplier --</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s.supplierName}>
                  {s.supplierName}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="flex flex-col">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              required
              style={{ padding: "8px", borderRadius: "4px" }}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label>Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              required
              style={{ padding: "8px", borderRadius: "4px" }}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory */}
          <div className="flex flex-col">
            <label>Subcategory</label>
            <select
              name="subcategory"
              value={form.subcategory}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              required
              style={{ padding: "8px", borderRadius: "4px" }}
            >
              <option value="">-- Select Subcategory --</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.subcategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Product */}
          <div className="flex flex-col">
            <label>Product</label>
            <input
              type="text"
              name="product"
              value={form.product}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              placeholder="Product"
              required
              style={{ padding: "8px", borderRadius: "4px" }}
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="1"
              className="border border-gray-300 px-3 py-2 rounded-md"
              placeholder="Quantity"
              required
              style={{ padding: "8px", borderRadius: "4px" }}
            />
          </div>

          {/* Product Price */}
          <div className="flex flex-col">
            <label>Product Price (Rs.)</label>
            <input
              type="text"
              name="productPrice"
              value={form.productPrice}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              placeholder="Price"
              required
              style={{ padding: "8px", borderRadius: "4px" }}
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-md"
              required
              style={{ padding: "8px", borderRadius: "4px" }}
            >
              <option value="">-- Select Status --</option>
              <option value="Pending">Pending</option>
              <option value="Returned">Returned</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>

          {/* Note (full width) */}
          <div className="flex flex-col" style={{ gridColumn: "1 / -1" }}>
            <label>Note</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              rows="3"
              className="border border-gray-300 px-3 py-2 rounded-md"
              placeholder="Optional note..."
              style={{ padding: "8px", borderRadius: "4px", resize: "vertical" }}
            />
          </div>
        </div>

        <div
          className="flex justify-end gap-3 mt-6"
          style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1.5rem" }}
        >
          <button
            type="submit"
            className="btnUpdate px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            style={{ cursor: "pointer" }}
          >
            {editingId ? "Update Return" : "Add Return"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btnClose px-5 py-2 rounded-md bg-gray-300 text-gray-800 hover:bg-gray-400"
              onClick={() => {
                setEditingId(null);
                generateNextReturnId().then((newId) => {
                  setForm({
                    returnId: newId,
                    supplierName: "",
                    date: "",
                    category: "",
                    subcategory: "",
                    product: "",
                    quantity: "",
                    productPrice: "",
                    status: "",
                    note: "",
                  });
                  setMessage("");
                });
              }}
              style={{ cursor: "pointer" }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Returns Table */}
      <table
        className="table table-striped mt-6"
        style={{ width: "100%", marginTop: "2rem", borderCollapse: "collapse" }}
      >
        <thead style={{ backgroundColor: "#f3f3f3" }}>
          <tr>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Return ID</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Supplier</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Date</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Category</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Subcategory</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Product</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Qty</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Price</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Total</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Status</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Note</th>
            <th style={{ padding: "8px", border: "1px solid #ccc" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {returns.length > 0 ? (
            returns.map((ret) => (
              <tr key={ret._id}>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{ret.returnId}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{ret.supplierName}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  {new Date(ret.date).toLocaleDateString()}
                </td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{ret.category}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{ret.subcategory}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{ret.product}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{ret.quantity}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{ret.productPrice}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{ret.totalReturnPrice}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{ret.status}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>{ret.note}</td>
                <td style={{ padding: "8px", border: "1px solid #ccc" }}>
                  <button
                    onClick={() => handleEdit(ret)}
                    title="Edit"
                    style={{ marginRight: "0.5rem", cursor: "pointer", color: "blue", border: "none", background: "none" }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(ret._id)}
                    title="Delete"
                    style={{ cursor: "pointer", color: "red", border: "none", background: "none" }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" style={{ textAlign: "center", padding: "10px" }}>
                No returns found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageReturn;
