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

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

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

  return (
    <div>
      <h2>Customer Bill Form</h2>
      <form>
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
      </form>
    </div>
  );
}

export default BillForm;

