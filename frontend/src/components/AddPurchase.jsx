// ✅ AddPurchase.jsx (updated with Selling Price field)
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";
import "./AddPurchases.css";

const AddPurchase = () => {
  const [purchase, setPurchase] = useState({
    supplier: "",
    product: "",
    category: "",
    subcategory: "",
    quantity: "",
    price: "",
    sellingPrice: "",
    discount: "",
    date: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    axios.get(`${BASE_URL}/api/suppliers`)
      .then(res => setSuppliers(res.data))
      .catch(err => console.error("Error fetching suppliers:", err));

    axios.get(`${BASE_URL}/api/category`)
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (purchase.category) {
      axios.get(`${BASE_URL}/api/subcategories/by-category/${purchase.category}`)
        .then(res => setSubcategories(res.data))
        .catch(err => {
          console.error("Error fetching subcategories:", err);
          setSubcategories([]);
        });
    } else {
      setSubcategories([]);
    }
  }, [purchase.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchase(prev => ({
      ...prev,
      [name]: value,
      ...(name === "category" && { subcategory: "" }),
    }));
  };

  const calculateTotal = () => {
    const qty = Number(purchase.quantity);
    const unitPrice = Number(purchase.price);
    const discountPercent = Number(purchase.discount) || 0;

    if (isNaN(qty) || isNaN(unitPrice)) return 0;

    const subtotal = qty * unitPrice;
    const discountAmount = (subtotal * discountPercent) / 100;

    return subtotal - discountAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      supplier,
      product,
      category,
      subcategory,
      quantity,
      price,
      sellingPrice,
      discount,
      date,
    } = purchase;

    if (!supplier || !product || !category || !subcategory || !quantity || !price || !sellingPrice || !date) {
      alert("Please fill all required fields");
      return;
    }

    const total = calculateTotal();

    try {
      await axios.post(`${BASE_URL}/api/purchase`, {
        supplier,
        product,
        category,
        subcategory,
        quantity: Number(quantity),
        price: Number(price),
        sellingPrice: Number(sellingPrice),
        discount: discount ? `${discount}%` : "0%",
        total,
        date,
      });

      alert("Purchase added successfully!");
      setPurchase({
        supplier: "",
        product: "",
        category: "",
        subcategory: "",
        quantity: "",
        price: "",
        sellingPrice: "",
        discount: "",
        date: "",
      });
    } catch (error) {
      console.error("Error adding purchase:", error.response?.data || error.message);
      alert("Failed to add purchase. Please try again.");
    }
  };

  return (
    <div className="add-purchase-container">
      <div className="title">
        <FontAwesomeIcon icon={faSquarePlus} /> Add Purchase
      </div>

      <form onSubmit={handleSubmit} className="add-purchase-form">
        <select name="supplier" value={purchase.supplier} onChange={handleChange} required>
          <option value="">Select Supplier</option>
          {suppliers.map(s => (
            <option key={s._id} value={s.supplierName}>{s.supplierName}</option>
          ))}
        </select>

        <input
          type="text"
          name="product"
          value={purchase.product}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />

        <div className="row-input-group">
          <select name="category" value={purchase.category} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.categoryName}</option>
            ))}
          </select>

          <select name="subcategory" value={purchase.subcategory} onChange={handleChange} required>
            <option value="">Select Subcategory</option>
            {subcategories.map(s => (
              <option key={s._id} value={s._id}>{s.subcategoryName}</option>
            ))}
          </select>
        </div>

        <input
          type="number"
          name="quantity"
          value={purchase.quantity}
          onChange={handleChange}
          placeholder="Quantity"
          required
          min="1"
        />

        <input
          type="number"
          name="price"
          value={purchase.price}
          onChange={handleChange}
          placeholder="Unit Price (Rs.)"
          required
          min="0"
          step="0.01"
        />

        <input
          type="number"
          name="sellingPrice"
          value={purchase.sellingPrice}
          onChange={handleChange}
          placeholder="Selling Price (Rs.)"
          required
          min="0"
          step="0.01"
        />

        <input
          type="number"
          name="discount"
          value={purchase.discount}
          onChange={handleChange}
          placeholder="Discount (%)"
          min="0"
          max="100"
          step="0.01"
        />

        <input
          type="date"
          name="date"
          value={purchase.date}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary">
          Add New Record
        </button>
      </form>
    </div>
  );
};

export default AddPurchase;
