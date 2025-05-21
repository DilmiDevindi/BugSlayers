import React, { useEffect, useState } from 'react';
import suppliersData from '../data/suppliers'; // replace with API if needed

const AddSupplierForm = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSuppliers(suppliersData); // or fetch from backend
    }, 500);
  }, []);

  const handleSupplierChange = (e) => {
    setSelectedSupplier(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Selected supplier: ${selectedSupplier}`);
  };

  return (
    <div className="p-4 bg-white shadow rounded-xl max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Supplier</h2>
      
      {suppliers.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">Select Existing Supplier</label>
          <select
            value={selectedSupplier}
            onChange={handleSupplierChange}
            className="w-full p-2 border rounded mb-4"
            required
          >
            <option value="">-- Select Supplier --</option>
            {suppliers.map((supplier) => (
              <option key={supplier.id} value={supplier.name}>
                {supplier.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className="text-red-600 font-medium">
          No suppliers found. Please <a href="/add" className="underline">add a new supplier</a>.
        </div>
      )}
    </div>
  );
};

export default AddSupplierForm;
