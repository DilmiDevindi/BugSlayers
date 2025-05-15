import { useState } from 'react';
import axios from 'axios';

function BillForm() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);

  const [cashReceived, setCashReceived] = useState(0);
  const [balance, setBalance] = useState(0);

  const [showInvoice, setShowInvoice] = useState(false);

  const handleNameChange = async (e) => {
    const enteredName = e.target.value;
    setName(enteredName);

    try {
      const res = await axios.get(`/api/customers/name/${enteredName}`);
      const customer = res.data;
      setAddress(customer.address || '');
      setContact(customer.contact || '');
      setEmail(customer.email || '');
    } catch {
      setAddress('');
      setContact('');
      setEmail('');
    }
  };

  const handleItemCodeChange = async (e) => {
    const code = e.target.value;
    setItemCode(code);

    try {
      const res = await axios.get(`/api/items/code/${code}`);
      const item = res.data;
      setItemName(item.name || '');
      setItemPrice(item.price || '');
    } catch {
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
    return (total - discount).toFixed(2);
  };

  const calculateBalance = () => {
    const amount = parseFloat(calculateAmount());
    const balanceAmt = cashReceived - amount;
    setBalance(balanceAmt >= 0 ? balanceAmt : 0);
  };

  const handleGenerateInvoice = () => {
    setShowInvoice(true);
    calculateBalance();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <h2>Invoice</h2>
      <form>
        <h3>Customer Details</h3>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <br />
        <label>
          Customer Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <br />
        <label>
          Address:
          <input type="text" value={address} readOnly />
        </label>
        <br />
        <label>
          Contact:
          <input type="text" value={contact} readOnly />
        </label>
        <br />
        <label>
          Email:
          <input type="text" value={email} readOnly />
        </label>
        <hr />
        <h3>Item Details</h3>
        <label>
          Item Code:
          <input type="text" value={itemCode} onChange={handleItemCodeChange} />
        </label>
        <br />
        <label>
          Item Name:
          <input type="text" value={itemName} readOnly />
        </label>
        <br />
        <label>
          Item Price:
          <input type="text" value={itemPrice} readOnly />
        </label>
        <br />
        <label>
          Quantity:
          <input type="number" value={quantity} min="1" onChange={(e) => setQuantity(Number(e.target.value))} />
        </label>
        <br />

        {/* Calculated Price Label */}
        <label>
          Price:
          <input type="text" value={calculatePrice()} readOnly />
        </label>
        <br />

        <label>
          Discount:
          <input type="number" value={discount} min="0" onChange={(e) => setDiscount(Number(e.target.value))} />
        </label>
        <br />

        {/* Final Amount after Discount */}
        <label>
          Amount:
          <input type="text" value={calculateAmount()} readOnly />
        </label>
        <br />

        <label>
          Cash Received:
          <input type="number" value={cashReceived} onChange={(e) => setCashReceived(Number(e.target.value))} />
        </label>
        <br />
        <label>
          Balance:
          <input type="text" value={balance.toFixed(2)} readOnly />
        </label>
        <br />

        <button type="button" onClick={handleGenerateInvoice}>
          Generate Invoice
        </button>
        <button type="button" onClick={handlePrint}>
          Print Invoice
        </button>
      </form>

      {showInvoice && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #000' }}>
          <h3>Invoice</h3>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Customer:</strong> {name}</p>
          <p><strong>Item:</strong> {itemName}</p>
          <p><strong>Quantity:</strong> {quantity}</p>
          <p><strong>Item Price:</strong> ${itemPrice}</p>
          <p><strong>Price:</strong> ${calculatePrice()}</p>
          <p><strong>Discount:</strong> ${discount}</p>
          <p><strong>Amount:</strong> ${calculateAmount()}</p>
          <p><strong>Cash Received:</strong> ${cashReceived}</p>
          <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>
          <button onClick={handlePrint}>Print</button>
        </div>
      )}
    </div>
  );
}

export default BillForm;
