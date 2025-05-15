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
  const [total, setTotal] = useState(0);

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
    } catch (err) {
      console.error('Customer not found:', err);
      setAddress('');
      setContact('');
      setEmail('');
    }
  };

  const handleDateChange = (e) => setDate(e.target.value);

  const handleItemCodeChange = async (e) => {
    const code = e.target.value;
    setItemCode(code);

    try {
      const res = await axios.get(`/api/items/code/${code}`);
      const item = res.data;
      setItemName(item.name || '');
      setItemPrice(item.price || '');
    } catch (err) {
      console.error('Item not found:', err);
      setItemName('');
      setItemPrice('');
    }
  };

  const handleQuantityChange = (e) => setQuantity(Number(e.target.value));
  const handleDiscountChange = (e) => setDiscount(Number(e.target.value));
  const handleCashReceivedChange = (e) => setCashReceived(Number(e.target.value));

  const calculateTotal = () => {
    const price = parseFloat(itemPrice);
    const totalAmount = (price * quantity) - discount;
    setTotal(totalAmount > 0 ? totalAmount : 0);
    setShowInvoice(true);
  };

  const calculateBalance = () => {
    const balanceAmount = cashReceived - total;
    setBalance(balanceAmount >= 0 ? balanceAmount : 0);
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
          <input type="date" value={date} onChange={handleDateChange} />
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
        <br />
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
          <input type="number" value={quantity} min="1" onChange={handleQuantityChange} />
        </label>
        <br />
        <label>
          {itemPrice && quantity ? `${itemPrice} × ${quantity} =` : 'Price:'}
          <input
            type="text"
            value={(parseFloat(itemPrice || 0) * quantity).toFixed(2)}
            readOnly
          />
        </label>
        <br />
        <label>
          Discount:
          <input type="number" value={discount} min="0" onChange={handleDiscountChange} />
        </label>
        <br />
        <label>
          Cash Received:
          <input type="number" value={cashReceived} onChange={handleCashReceivedChange} />
        </label>
        <br />
        <label>
          Balance:
          <input type="text" value={balance.toFixed(2)} readOnly />
        </label>
        <br />
        <button type="button" onClick={calculateTotal}>
          Generate Invoice
        </button>
        <button type="button" onClick={handlePrint}>Print Invoice</button>
      </form>

      {showInvoice && (
        <div style={{ marginTop: '20px', border: '1px solid #000', padding: '15px' }}>
          <h3>Invoice</h3>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Customer:</strong> {name}</p>
          <p><strong>Item:</strong> {itemName} (x{quantity})</p>
          <p><strong>Price per item:</strong> ${itemPrice}</p>
          <p><strong>Discount:</strong> ${discount}</p>
          <p><strong>Total:</strong> ${total.toFixed(2)}</p>

          <label>
            <strong>Cash Received:</strong>
            <input type="number" value={cashReceived} onChange={handleCashReceivedChange} />
          </label>
          <br />
          <button type="button" onClick={calculateBalance}>
            Calculate Balance
          </button>
          <p><strong>Balance:</strong> ${balance.toFixed(2)}</p>

          <button onClick={handlePrint}>Print Invoice</button>
        </div>
      )}
    </div>
  );
}

export default BillForm;
