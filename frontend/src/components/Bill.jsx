import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Bill.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import logo from "../assets/furniture-log.png";

// Helper function to convert 24-hour time to 12-hour with AM/PM
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
  const [time, setTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });

  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [cashReceived, setCashReceived] = useState(0);
  const [balance, setBalance] = useState(0);

  const [showInvoice, setShowInvoice] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const debounceRef = useRef(null);
  const invoiceRef = useRef(null); // For printing only invoice

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
        } catch (error) {
          setName('');
          setAddress('');
          setEmail('');
          setFetchError('Customer not found');
        }
      }, 500);
    } else {
      setName('');
      setAddress('');
      setEmail('');
      setFetchError('');
    }

    return () => clearTimeout(debounceRef.current);
  }, [contact]);

  const handleItemCodeChange = async (e) => {
    const code = e.target.value.trim();
    setItemCode(code);
    if (code) {
      try {
        const res = await axios.get(`http://localhost:5000/api/bill/inventoryitems/${code}`);
        const item = res.data;
        setItemName(item.name || '');
        setItemPrice(parseFloat(item.price).toFixed(2) || '');
      } catch (err) {
        setItemName('');
        setItemPrice('');
      }
    } else {
      setItemName('');
      setItemPrice('');
    }
  };

  const calculatePrice = () => {
    const price = parseFloat(itemPrice || 0);
    return (price * quantity).toFixed(2);
  };

  const calculateAmount = () => {
    const total = parseFloat(calculatePrice());
    const disc = parseFloat(discount || 0);
    return (total - disc).toFixed(2);
  };

  useEffect(() => {
    const amount = parseFloat(calculateAmount());
    const cash = parseFloat(cashReceived || 0);
    const bal = cash - amount;
    setBalance(bal >= 0 ? bal : 0);
  }, [cashReceived, discount, quantity, itemPrice]);

  const handleGenerateInvoice = async () => {
    if (!name || !email) {
      alert('Please enter a valid 10-digit contact number to fetch customer details.');
      return;
    }

    const invoiceData = {
      date,
      time,
      contact,
      name,
      address,
      email,
      itemName,
      itemCode,
      itemPrice,
      quantity,
      price: calculatePrice(),
      discount,
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
    printWindow.document.write('<style>body{font-family: Arial; padding: 20px;} hr{border: 1px solid #000;} img{max-width:80px;}</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printContents);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const toggleInvoiceView = () => {
    setShowInvoice(!showInvoice);
  };

  return (
    <div className="invoice-container">
      <div className="form-section">
        <h3 className='bill-topic'>
          <FontAwesomeIcon icon={faFileInvoice} className="bill-icon" /> Generate Invoice
        </h3>

        <form onSubmit={(e) => e.preventDefault()}>
          <h4>Customer Details</h4>
          <div className="inline-field">
            <label>Date:</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <label style={{ marginLeft: '10px' }}>Time:</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div className="inline-field">
            <label>Contact:</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').substring(0, 10).trim();
                setContact(val);
              }}
              maxLength={10}
              placeholder="Enter 10-digit contact"
            />
          </div>
          {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}

          <div className="inline-field">
            <label>Customer Name:</label>
            <input type="text" value={name} readOnly />
          </div>
          <div className="inline-field">
            <label>Address:</label>
            <input type="text" value={address} readOnly />
          </div>
          <div className="inline-field">
            <label>Email:</label>
            <input type="text" value={email} readOnly />
          </div>

          <hr />
          <h4>Item Details</h4>
          <div className="inline-field">
            <label>Item Code:</label>
            <input type="text" value={itemCode} onChange={handleItemCodeChange} />
          </div>
          <div className="inline-field">
            <label>Item Name:</label>
            <input type="text" value={itemName} readOnly />
          </div>
          <div className="inline-field">
            <label>Item Price:</label>
            <input type="text" value={itemPrice} readOnly />
          </div>
          <div className="inline-field">
            <label>Quantity:</label>
            <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>
          <div className="inline-field">
            <label>Price:</label>
            <input type="text" value={calculatePrice()} readOnly />
          </div>
          <div className="inline-field">
            <label>Discount:</label>
            <input type="number" min="0" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          </div>
          <div className="inline-field">
            <label>Amount:</label>
            <input type="text" value={calculateAmount()} readOnly />
          </div>
          <div className="inline-field">
            <label>Cash Received:</label>
            <input type="number" min="0" value={cashReceived} onChange={(e) => setCashReceived(Number(e.target.value))} />
          </div>
          <div className="inline-field">
            <label>Balance:</label>
            <input type="text" value={balance.toFixed(2)} readOnly />
          </div>

          <div style={{ marginTop: '15px' }}>
            <button type="button" onClick={handleGenerateInvoice}>Generate Invoice</button>
            <button type="button" onClick={toggleInvoiceView} style={{ marginLeft: '10px' }}>
              {showInvoice ? 'Hide Invoice' : 'View Invoice'}
            </button>
          </div>
        </form>
      </div>

      <div className="preview-section">
        {showInvoice && (
          <div className="invoice-preview" ref={invoiceRef}>
            <div style={{ textAlign: 'center' }}>
              <img src={logo} alt="Sisira Furnitures Logo" style={{ width: '80px', marginBottom: '8px' }} />
              <h3>SISIRA FURNITURES</h3>
              <p>No.156, Matara Road, Kamburupitiya<br />Tel: 041-2292785 / 0718006485</p>
            </div>
            <p><strong>Invoice #:</strong> 000789</p>
            <p><strong>Date:</strong> {date} {formatTimeToAMPM(time)}</p>
            <hr />
            <p><strong>Customer Name:</strong> {name}</p>
            <p><strong>Contact:</strong> {contact}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Email:</strong> {email}</p>
            <hr />
            <p><strong>Item:</strong> {itemName}</p>
            <p><strong>Quantity:</strong> {quantity}</p>
            <p><strong>Item Price:</strong> Rs. {itemPrice}</p>
            <p><strong>Price:</strong> Rs. {calculatePrice()}</p>
            <p><strong>Discount:</strong> Rs. {discount}</p>
            <p><strong>Amount:</strong> Rs. {calculateAmount()}</p>
            <p><strong>Cash Received:</strong> Rs. {cashReceived}</p>
            <p><strong>Balance:</strong> Rs. {balance.toFixed(2)}</p>
            <hr />
            <p><strong>Total Qty:</strong> {quantity}</p>
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
    </div>
  );
}

export default BillForm;
