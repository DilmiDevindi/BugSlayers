import { useState, useEffect } from "react";
import axios from "axios";

const Sales = () => {
  const [date, setDate] = useState("");
  const [salesName, setSalesName] = useState("");
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerDetails, setCustomerDetails] = useState({
    address: "",
    contact: "",
    email: "",
  });

  const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);

  // Constant for Sales
  const sales = {
    salesName,
    date,
    selectedCustomer,
    items: [],
    totalAmount: 0,
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      const customer = customers.find((c) => c.name === selectedCustomer);
      if (customer) {
        setCustomerDetails({
          address: customer.address,
          contact: customer.contact,
          email: customer.email,
        });
      }
    }
  }, [selectedCustomer, customers]);

  useEffect(() => {
    if (category) {
      fetchItems(category);
    }
  }, [category]);

  useEffect(() => {
    if (selectedItem) {
      const item = items.find((i) => i.name === selectedItem);
      if (item) {
        setPrice(item.price);
        setTotal(item.price * quantity);
      }
    }
  }, [selectedItem, items, quantity]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers", error);
    }
  };

  const fetchItems = async (category) => {
    try {
      const response = await axios.get(`http://localhost:5002/api/items?category=${category}`);
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items", error);
    }
  };

  const handleDiscount = () => {
    if (!discountApplied) {
      setTotal((prevTotal) => prevTotal * 0.9);
      setDiscountApplied(true);
    }
  };

  // Add items to the sales constant
  const addItemToSale = () => {
    const item = items.find((i) => i.name === selectedItem);
    if (item) {
      sales.items.push({
        itemName: item.name,
        price: item.price,
        quantity,
        total: item.price * quantity,
      });
      sales.totalAmount = sales.items.reduce((total, saleItem) => total + saleItem.total, 0);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Sales</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Sales Name:</label>
          <input
            type="text"
            className="form-control"
            value={salesName}
            onChange={(e) => setSalesName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Date:</label>
          <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Customer Name:</label>
          <select className="form-control" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} required>
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer._id} value={customer.name}>
                {customer.name}
              </option>
            ))}
          </select>
        </div>

        {selectedCustomer && (
          <>
            <div className="mb-3">
              <label className="form-label">Address:</label>
              <input type="text" className="form-control" value={customerDetails.address} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label">Contact:</label>
              <input type="text" className="form-control" value={customerDetails.contact} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input type="email" className="form-control" value={customerDetails.email} disabled />
            </div>
          </>
        )}

        <div className="mb-3">
          <label className="form-label">Category:</label>
          <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="">Select Category</option>
            <option value="Table">Table</option>
            <option value="Chair">Chair</option>
            <option value="Sofa">Sofa</option>
          </select>
        </div>

        {category && (
          <div className="mb-3">
            <label className="form-label">Item:</label>
            <select className="form-control" value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)} required>
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name} - ${item.price}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedItem && (
          <>
            <div className="mb-3">
              <label className="form-label">Quantity:</label>
              <input type="number" className="form-control" value={quantity} min="1" onChange={(e) => setQuantity(Number(e.target.value))} required />
            </div>

            <div className="mb-3">
              <label className="form-label">Price per Item:</label>
              <input type="text" className="form-control" value={`$${price}`} disabled />
            </div>

            <div className="mb-3">
              <label className="form-label">Total Amount:</label>
              <input type="text" className="form-control" value={`$${total.toFixed(2)}`} disabled />
            </div>

            <button type="button" className="btn btn-primary" onClick={handleDiscount} disabled={discountApplied}>
              {discountApplied ? "Discount Applied" : "Add Discount"}
            </button>

            {/* Button to add item to sales */}
            <button type="button" className="btn btn-success mt-2" onClick={addItemToSale}>
              Add Item to Sale
            </button>
          </>
        )}
      </form>

      {/* Display sales details */}
      <div className="mt-4">
        <h3>Sales Details:</h3>
        <p>Sales Name: {sales.salesName}</p>
        <p>Date: {sales.date}</p>
        <p>Customer: {sales.selectedCustomer}</p>
        <ul>
          {sales.items.map((item, index) => (
            <li key={index}>
              {item.itemName} - Quantity: {item.quantity}, Total: ${item.total.toFixed(2)}
            </li>
          ))}
        </ul>
        <p>Total Amount: ${sales.totalAmount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Sales;
