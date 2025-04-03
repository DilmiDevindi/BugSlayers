import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Sidebar = () => {
  const [isSuppliersOpen, setIsSuppliersOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isCustomersOpen, setIsCustomersOpen] = useState(false);
  

  const toggleSuppliersDropdown = () => setIsSuppliersOpen(!isSuppliersOpen);
  const toggleInventoryDropdown = () => setIsInventoryOpen(!isInventoryOpen);
  const toggleCustomersDropdown = () => setIsCustomersOpen(!isCustomersOpen);
  
  return (
    <div className="bg-dark text-white vh-100 p-3">
      <h6 className="fw-bold">New Sisira Furniture</h6>
      <ul className="nav flex-column">
        
        {/* Dashboard */}
        <li className="nav-item mb-3">
          <Link to="/dashboard" className="nav-link text-white d-flex align-items-center">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Link>
        </li>

        {/* Suppliers Dropdown */}
        <li className="nav-item mb-3">
          <button className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start"
            onClick={toggleSuppliersDropdown}>
            <i className="bi bi-truck me-2"></i> Suppliers
            <i className={`bi ${isSuppliersOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isSuppliersOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <Link to="/dashboard/suppliers/add" className="nav-link text-white">Add Supplier</Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard/suppliers/manage" className="nav-link text-white">Manage Suppliers</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Inventory Dropdown */}
        <li className="nav-item mb-3">
          <button className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start"
            onClick={toggleInventoryDropdown}>
            <i className="bi bi-boxes me-2"></i> Inventory
            <i className={`bi ${isInventoryOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isInventoryOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <Link to="/dashboard/inventory/add" className="nav-link text-white">Add Inventory</Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard/inventory/manage" className="nav-link text-white">Manage Inventory</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Customers Dropdown */}
        <li className="nav-item mb-3">
          <button className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start"
            onClick={toggleCustomersDropdown}>
            <i className="bi bi-receipt me-2"></i> Customers
            <i className={`bi ${isCustomersOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>
          {isCustomersOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item">
                <Link to="/dashboard/customers/add" className="nav-link text-white">Add Customer</Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard/customers/manage" className="nav-link text-white">Manage Customers</Link>
              </li>
            </ul>
          )}
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
