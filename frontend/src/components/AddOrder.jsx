import React, { useState, useEffect } from "react";
import axios from "axios";

const AddOrder = () => {
  const [form, setForm] = useState({
    orderId: "",
    companyName: "",
    quantity: "",
    discount: "",
    date: "",
  });
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState("");
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchSuppliers();
    generateOrderId();
  }, []);

  // Generate next orderId (e.g., ORD001, ORD002...)
  const generateOrderId = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders`);
      const orders = res.data;
      let maxNum = 0;
      orders.forEach((o) => {
        const match = o.orderId && o.orderId.match(/ORD(\d+)/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNum) maxNum = num;
        }
      });
      const nextNum = (maxNum + 1).toString().padStart(3, "0");
      setForm((prev) => ({ ...prev, orderId: `ORD${nextNum}` }));
    } catch (err) {
      setForm((prev) => ({ ...prev, orderId: "ORD001" }));
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers`);
      setSuppliers(res.data);
    } catch {
      console.error("Error fetching suppliers");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/orders`, {
        ...form,
        quantity: Number(form.quantity),
        discount: Number(form.discount),
      });
      setMessage("Order added successfully!");
      setForm({
        orderId: "",
        companyName: "",
        quantity: "",
        discount: "",
        date: "",
      });
      generateOrderId(); // Generate next orderId after successful add
    } catch {
      setMessage("Error adding order. Make sure Order ID is unique.");
    }
  };

  return (
    <div
      className="container mt-5"
      style={{
        maxWidth: 500,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
        padding: 32,
      }}
    >
      <h2
        className="mb-4 text-center"
        style={{ fontWeight: 600, letterSpacing: 1 }}
      >
        Add New Order
      </h2>
      {message && (
        <div
          className="alert alert-info text-center"
          style={{ borderRadius: 8 }}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="orderId">
            Order ID
          </label>
          <input
            className="form-control"
            id="orderId"
            placeholder="Order ID"
            name="orderId"
            value={form.orderId}
            onChange={handleChange}
            required
            readOnly // Make orderId read-only
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="companyName">
            Supplier
          </label>
          <select
            className="form-control"
            id="companyName"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Supplier --</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s.supplierName}>
                {s.supplierName}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="quantity">
            Quantity
          </label>
          <input
            className="form-control"
            id="quantity"
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            min={1}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="discount">
            Discount
          </label>
          <input
            className="form-control"
            id="discount"
            type="number"
            name="discount"
            placeholder="Discount"
            value={form.discount}
            onChange={handleChange}
            min={0}
            required
          />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="date">
            Date
          </label>
          <input
            className="form-control"
            id="date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <button
          className="btn btn-primary w-100"
          style={{
            fontWeight: 500,
            letterSpacing: 1,
            borderRadius: 8,
            transition: "background 0.2s",
          }}
          type="submit"
        >
          Add Order
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
