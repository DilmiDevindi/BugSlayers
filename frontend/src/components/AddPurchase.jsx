import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePlus } from '@fortawesome/free-solid-svg-icons';
import "./AddPurchases.css";

const AddPurchase = () => {
  const [purchase, setPurchase] = useState({
    supplierName: "",
    productName: "",
    category: "",
    subcategory: "",
    quantity: "",
    price: "",
    discountValue: "",
    discountType: "%", // % or Rs
    date: "",
  });

  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    axios.get("/api/suppliers")
      .then(res => setSuppliers(res.data))
      .catch(err => console.error("Error fetching suppliers:", err));
  }, []);

  useEffect(() => {
    axios.get("/api/category")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (purchase.category) {
      axios.get(`/api/subcategories/by-category/${purchase.category}`)
        .then(res => setSubcategories(res.data))
        .catch(err => console.error("Error fetching subcategories:", err));
    } else {
      setSubcategories([]);
    }
  }, [purchase.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "discountValue" && isNaN(value)) return;

    setPurchase(prev => ({
      ...prev,
      [name]: value,
      ...(name === "category" && { subcategory: "" })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      supplierName, productName, category, subcategory,
      quantity, price, discountValue, discountType, date
    } = purchase;

    if (!supplierName || !productName || !category || !subcategory ||
        !quantity || !price || !date) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await axios.post("/api/purchase", {
        supplierName,
        productName,
        category,
        subcategory,
        quantity: Number(quantity),
        price: Number(price),
        discount: {
          value: discountValue ? Number(discountValue) : 0,
          type: discountType
        },
        date
      });
      alert("Purchase added successfully!");
      setPurchase({
        supplierName: "",
        productName: "",
        category: "",
        subcategory: "",
        quantity: "",
        price: "",
        discountValue: "",
        discountType: "%",
        date: "",
      });
    } catch (error) {
      console.error("Error adding purchase:", error);
      alert("Failed to add purchase. Please try again.");
    }
  };

  return (
    <div className="add-purchase-container">
      <div className="title">
        <FontAwesomeIcon icon={faSquarePlus} /> Add Purchase
      </div>

      <form onSubmit={handleSubmit} className="add-purchase-form">
        <select
          name="supplierName"
          value={purchase.supplierName}
          onChange={handleChange}
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map(s => (
            <option key={s._id} value={s.supplierName}>{s.supplierName}</option>
          ))}
        </select>

        <input
          type="text"
          name="productName"
          value={purchase.productName}
          onChange={handleChange}
          placeholder="Product Title"
          required
        />

        <div className="row-input-group">
          <select
            name="category"
            value={purchase.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.categoryName}</option>
            ))}
          </select>

          <select
            name="subcategory"
            value={purchase.subcategory}
            onChange={handleChange}
            required
          >
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
          placeholder="Price"
          required
          min="0"
          step="0.01"
        />

        <div className="row-input-group">
          <input
            type="number"
            name="discountValue"
            value={purchase.discountValue}
            onChange={handleChange}
            placeholder="Discount"
            min="0"
            step="1"
          />

          <select
            name="discountType"
            value={purchase.discountType}
            onChange={handleChange}
          >
            <option value="%">%</option>
            <option value="Rs">Rs</option>
          </select>
        </div>

        <input
          type="date"
          name="date"
          value={purchase.date}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-primary">Add New Record</button>
      </form>
    </div>
  );
};

export default AddPurchase;
