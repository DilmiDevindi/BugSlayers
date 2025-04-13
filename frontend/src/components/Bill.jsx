import { useState } from 'react';
import axios from 'axios';

function BillForm() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');

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

  return (
    <div>
      <h2>Customer Bill Form</h2>
      <form>
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
      </form>
    </div>
  );
}

export default BillForm;
