// BillForm.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Bill.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import logo from "../assets/furniture-log.png";

function formatTimeToAMPM(time24) {
  if (!time24) return '';
  const [hourStr, minute] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12;
  hour = hour === 0 ? 12 : hour;
  return `${hour}:${minute} ${ampm}`;
}

function BillForm() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));
  const [discount, setDiscount] = useState('');
  const [cashReceived, setCashReceived] = useState('');
  const [balance, setBalance] = useState(0);
  const [items, setItems] = useState([
    { itemCode: '', itemName: '', itemPrice: '', quantity: 1 }
  ]);
  const [showInvoice, setShowInvoice] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const debounceRef = useRef(null);
  const invoiceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const cleanContact = contact.trim();
    if (cleanContact.length === 10) {
      debounceRef.current = setTimeout(async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/customers/contact/${cleanContact}`);
          const customer = res.data;
          setName(customer.name || '');
          setAddress(customer.address || '');
          setEmail(customer.email || '');
          setFetchError('');
        } catch {
          setName(''); setAddress(''); setEmail('');
          setFetchError('Customer not found');
        }
      }, 500);
    } else {
      setName(''); setAddress(''); setEmail(''); setFetchError('');
    }
    return () => clearTimeout(debounceRef.current);
  }, [contact]);

  const handleItemChange = async (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    if (field === 'itemCode') {
      try {
        const res = await axios.get(`http://localhost:5000/api/bill/inventoryitems/${value}`);
        updatedItems[index].itemName = res.data.name || '';
        updatedItems[index].itemPrice = parseFloat(res.data.price).toFixed(2) || '';
      } catch {
        updatedItems[index].itemName = '';
        updatedItems[index].itemPrice = '';
      }
    }
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { itemCode: '', itemName: '', itemPrice: '', quantity: 1 }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.itemPrice || 0);
    const qty = parseInt(item.quantity || 1);
    return (price * qty).toFixed(2);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + parseFloat(calculateItemTotal(item)), 0).toFixed(2);
  };

  const calculateAmount = () => {
    const subtotal = parseFloat(calculateSubtotal());
    const disc = parseFloat(discount || 0);
    return (subtotal - disc).toFixed(2);
  };

  useEffect(() => {
    const amount = parseFloat(calculateAmount());
    const cash = parseFloat(cashReceived || 0);
    const bal = cash - amount;
    setBalance(bal >= 0 ? bal : 0);
  }, [cashReceived, discount, items]);

  const handleSaveInvoice = async () => {
    if (!name || !email) {
      alert('Please enter a valid 10-digit contact number to fetch customer details.');
      return;
    }
    const invoiceData = {
      date, time, contact, name, address, email,
      items,
      discount,
      subtotal: calculateSubtotal(),
      amount: calculateAmount(),
      cashReceived,
      balance: balance.toFixed(2),
    };

    try {
      await axios.post('http://localhost:5000/api/invoices', invoiceData);
      alert("Invoice saved successfully!");
      setShowInvoice(true);
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice. Please try again.");
    }
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printContents = invoiceRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=700,width=900');
    printWindow.document.write('<html><head><title>Invoice</title>');
    printWindow.document.write(`<style>@page { size: A4; margin: 10mm; } body { font-family: Arial; } .invoice-preview { font-size: 12pt; } .print-hide { display: none !important; }</style>`);
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div className="invoice-container">
      <div className="form-section">
        <h3 className='bill-topic'><FontAwesomeIcon icon={faFileInvoice} className="bill-icon" /> Generate Invoice</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <h4>Customer Details</h4>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          <input type="text" value={contact} onChange={(e) => setContact(e.target.value.replace(/\D/g, '').substring(0, 10))} placeholder="Contact (10 digits)" />
          {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
          <input type="text" value={name} readOnly placeholder="Customer Name" />
          <input type="text" value={address} readOnly placeholder="Address" />
          <input type="text" value={email} readOnly placeholder="Email" />

          <h4>Item Details</h4>
          {items.map((item, index) => (
            <div key={index} className="item-box">
              <input type="text" value={item.itemCode} onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)} placeholder="Item Code" />
              <input type="text" value={item.itemName} readOnly placeholder="Item Name" />
              <input type="text" value={item.itemPrice} readOnly placeholder="Item Price" />
              <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} min="1" />
              <input type="text" value={calculateItemTotal(item)} readOnly placeholder="Total" />
              {items.length > 1 && <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>}
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>+ Add Another Item</button>

          <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} placeholder="Discount" />
          <input type="number" value={cashReceived} onChange={(e) => setCashReceived(Number(e.target.value))} placeholder="Cash Received" />
          <input type="text" value={balance.toFixed(2)} readOnly placeholder="Balance" />

          <button type="button" onClick={handleSaveInvoice}>Save Invoice</button>
          <button type="button" onClick={() => setShowInvoice(!showInvoice)}>{showInvoice ? 'Hide Invoice' : 'View Invoice'}</button>
        </form>
      </div>

      {showInvoice && (
        <div className="preview-section" ref={invoiceRef}>
          <div style={{ textAlign: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: '80px' }} />
            <h2>SISIRA FURNITURES</h2>
            <p>No.156, Matara Road, Kamburupitiya</p>
            <p>Tel: 041-2292785 / 0718006485</p>
          </div>
          <hr />
          <p><strong>Invoice #:</strong> 000789</p>
          <p><strong>Date:</strong> {date} {formatTimeToAMPM(time)}</p>
          <h4>Customer</h4>
          <p>Name: {name}</p>
          <p>Contact: {contact}</p>
          <p>Address: {address}</p>
          <p>Email: {email}</p>
          <h4>Items</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {item.itemPrice}</td>
                  <td>Rs. {calculateItemTotal(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <p><strong>Discount:</strong> Rs. {discount}</p>
          <p><strong>Amount:</strong> Rs. {calculateAmount()}</p>
          <p><strong>Cash Received:</strong> Rs. {cashReceived}</p>
          <p><strong>Balance:</strong> Rs. {balance.toFixed(2)}</p>
          <p style={{ textAlign: 'center' }}>* {Math.floor(Math.random() * 999999).toString().padStart(6, '0')} *</p>
          <p style={{ fontSize: '12px', textAlign: 'center' }}>
            Thank you for choosing Sisira Furnitures!<br />We appreciate your trust and support.
          </p>
          <p style={{ fontSize: '11px', textAlign: 'center' }}>
            Software & Technical Support by:<br />BugSlayers © 2025
          </p>
          <button onClick={handlePrint} className="print-hide">Print</button>
        </div>
      )}
    </div>
  );
}

export default BillForm;