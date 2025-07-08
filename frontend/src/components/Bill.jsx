import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Bill.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/furniture-log.png';

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
  const [invoiceIdInput, setInvoiceIdInput] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => new Date().toTimeString().slice(0, 5));
  const [cashReceived, setCashReceived] = useState('');
  const [balance, setBalance] = useState(0);
  const [items, setItems] = useState([{ itemCode: '', itemName: '', itemPrice: '', quantity: 1, discount: 0 }]);
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
    setItems([...items, { itemCode: '', itemName: '', itemPrice: '', quantity: 1, discount: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const calculateItemTotal = (item) => {
    const price = parseFloat(item.itemPrice || 0);
    const qty = parseInt(item.quantity || 1);
    const disc = parseFloat(item.discount || 0);
    return (price * qty - disc).toFixed(2);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (parseFloat(item.itemPrice || 0) * parseInt(item.quantity || 1)), 0).toFixed(2);
  };

  const calculateAmount = () => {
    return items.reduce((total, item) => total + parseFloat(calculateItemTotal(item)), 0).toFixed(2);
  };

  useEffect(() => {
    const amount = parseFloat(calculateAmount());
    const cash = parseFloat(cashReceived || 0);
    const bal = cash - amount;
    setBalance(bal >= 0 ? bal : 0);
  }, [cashReceived, items]);

  const handleSaveInvoice = async () => {
    if (!name || !email) {
      alert('Please enter a valid 10-digit contact number to fetch customer details.');
      return;
    }

    const payload = {
      invoiceId: invoiceId || 'INV-' + Date.now(),
      date, time, contact, name, address, email,
      items,
      subtotal: calculateSubtotal(),
      amount: calculateAmount(),
      cashReceived: String(cashReceived),
      balance: balance.toFixed(2),
    };

    try {
      if (invoiceId) {
        await axios.put(`http://localhost:5000/api/invoices/${invoiceId}`, payload);
        alert("Invoice updated successfully!");
      } else {
        const res = await axios.post('http://localhost:5000/api/invoices', payload);
        setInvoiceId(res.data.invoiceId);
        alert("Invoice created successfully!");
      }
      setShowInvoice(true);
    } catch (err) {
      alert("Failed to save invoice.");
      console.error(err);
    }
  };

  const handleFetchInvoice = async () => {
    if (!invoiceIdInput) return alert('Enter an invoice ID');
    try {
      const res = await axios.get(`http://localhost:5000/api/invoices/${invoiceIdInput}`);
      const inv = res.data;
      setInvoiceId(inv.invoiceId);
      setDate(inv.date);
      setTime(inv.time);
      setContact(inv.contact);
      setName(inv.name);
      setAddress(inv.address);
      setEmail(inv.email);
      setItems(inv.items);
      setCashReceived(inv.cashReceived);
      setBalance(parseFloat(inv.balance));
      alert('Invoice loaded for editing.');
    } catch (err) {
      alert('Invoice not found.');
      console.error(err);
    }
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceIdInput) return alert('Enter an invoice ID');
    const confirm = window.confirm('Are you sure you want to delete this invoice?');
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5000/api/invoices/${invoiceIdInput}`);
      alert('Invoice deleted.');
      window.location.reload();
    } catch (err) {
      alert('Error deleting invoice.');
      console.error(err);
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
        <h3 className='bill-topic'><FontAwesomeIcon icon={faFileInvoice} className="bill-icon" /> Invoice Manager</h3>

        {/* Edit/Delete Input */}
        <div className="form-row">
          <label>Invoice ID:</label>
          <input type="text" value={invoiceIdInput} onChange={(e) => setInvoiceIdInput(e.target.value)} />
          <button onClick={handleFetchInvoice}>Edit</button>
          <button onClick={handleDeleteInvoice}>Delete</button>
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()}>
          <h4>Customer Details</h4>
          <div className="form-row"><label>Date:</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <div className="form-row"><label>Time:</label><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
          <div className="form-row"><label>Contact:</label><input type="text" value={contact} onChange={(e) => setContact(e.target.value.replace(/\D/g, '').substring(0, 10))} /></div>
          {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
          <div className="form-row"><label>Name:</label><input type="text" value={name} readOnly /></div>
          <div className="form-row"><label>Address:</label><input type="text" value={address} readOnly /></div>
          <div className="form-row"><label>Email:</label><input type="text" value={email} readOnly /></div>

          <h4>Item Details</h4>
          {items.map((item, index) => (
            <div key={index} className="item-box">
              <div className="form-row"><label>Item Code:</label><input type="text" value={item.itemCode} onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)} /></div>
              <div className="form-row"><label>Item Name:</label><input type="text" value={item.itemName} readOnly /></div>
              <div className="form-row"><label>Price:</label><input type="text" value={item.itemPrice} readOnly /></div>
              <div className="form-row"><label>Qty:</label><input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} /></div>
              <div className="form-row"><label>Discount:</label><input type="number" value={item.discount} onChange={(e) => handleItemChange(index, 'discount', e.target.value)} /></div>
              <div className="form-row"><label>Total:</label><input type="text" value={calculateItemTotal(item)} readOnly /></div>
              {items.length > 1 && <button type="button" onClick={() => handleRemoveItem(index)}>Remove</button>}
            </div>
          ))}
          <button type="button" onClick={handleAddItem}>+ Add Item</button>
          <div className="form-row"><label>Cash Received:</label><input type="number" value={cashReceived} onChange={(e) => setCashReceived(Number(e.target.value))} /></div>
          <div className="form-row"><label>Balance:</label><input type="text" value={balance.toFixed(2)} readOnly /></div>
          <button type="button" onClick={handleSaveInvoice}>{invoiceId ? 'Update Invoice' : 'Save Invoice'}</button>
          <button type="button" onClick={() => setShowInvoice(!showInvoice)}>{showInvoice ? 'Hide Invoice' : 'View Invoice'}</button>
        </form>
      </div>

      {showInvoice && (
        <div className="preview-section invoice-preview" ref={invoiceRef}>
          <div style={{ textAlign: 'center' }}>
            <img src={logo} alt="Logo" style={{ width: '80px' }} />
            <h2>SISIRA FURNITURES</h2>
            <p>No.156, Matara Road, Kamburupitiya</p>
            <p>Tel: 041-2292785 / 0718006485</p>
          </div>
          <hr />
          <p><strong>Invoice ID:</strong> {invoiceId}</p>
          <p><strong>Date:</strong> {date} {formatTimeToAMPM(time)}</p>
          <h4>Customer</h4>
          <p>Name: {name}</p>
          <p>Contact: {contact}</p>
          <p>Address: {address}</p>
          <p>Email: {email}</p>
          <h4>Items</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Item</th><th>Qty</th><th>Price</th><th>Discount</th><th>Total</th></tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {item.itemPrice}</td>
                  <td>Rs. {item.discount}</td>
                  <td>Rs. {calculateItemTotal(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <p><strong>Subtotal:</strong> Rs. {calculateSubtotal()}</p>
          <p><strong>Amount:</strong> Rs. {calculateAmount()}</p>
          <p><strong>Cash Received:</strong> Rs. {cashReceived}</p>
          <p><strong>Balance:</strong> Rs. {balance.toFixed(2)}</p>
          <p style={{ textAlign: 'center' }}>* {Math.floor(Math.random() * 999999).toString().padStart(6, '0')} *</p>
          <p style={{ fontSize: '12px', textAlign: 'center' }}>Thank you for choosing Sisira Furnitures!<br />We appreciate your trust and support.</p>
          <p style={{ fontSize: '11px', textAlign: 'center' }}>Software & Technical Support by:<br />BugSlayers © 2025</p>
          <button onClick={handlePrint} className="print-hide">Print</button>
        </div>
      )}
    </div>
  );
}

export default BillForm;
