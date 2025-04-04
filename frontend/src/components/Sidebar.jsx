import { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Import Bootstrap Icons

const Sidebar = () => {
  const [isSuppliersOpen, setIsSuppliersOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isCustomersOpen, setIsCustomersOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false); // State for Sales section

  const toggleSuppliersDropdown = () => setIsSuppliersOpen(!isSuppliersOpen);
  const toggleInventoryDropdown = () => setIsInventoryOpen(!isInventoryOpen);
  const toggleCustomersDropdown = () => setIsCustomersOpen(!isCustomersOpen);
  const toggleSalesDropdown = () => setIsSalesOpen(!isSalesOpen); // Function to toggle Sales section

  return (
    <div className="bg-dark text-white vh-100 p-3">
      <h6 className='custom-heading'>New Sisira Furniture</h6>
      <ul className="nav flex-column">
        
        <li className="nav-item mb-3">
          <Link to="/dashboard" className="nav-link text-white d-flex align-items-center">
            <i className="bi bi-speedometer2 me-2"></i> Dashboard
          </Link>
        </li>

        {/* Suppliers Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleSuppliersDropdown}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-truck me-2"></i> Suppliers
            <i className={`bi ${isSuppliersOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isSuppliersOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/suppliers/add" className="nav-link text-white">Add Supplier</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/suppliers/manage" className="nav-link text-white">Manage Suppliers</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Inventory Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleInventoryDropdown}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-boxes me-2"></i> Inventory
            <i className={`bi ${isInventoryOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isInventoryOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/inventory/add" className="nav-link text-white">Add Inventory</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/inventory/manage" className="nav-link text-white">Manage Inventory</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Customers Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleCustomersDropdown}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-receipt me-2"></i> Customers
            <i className={`bi ${isCustomersOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isCustomersOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/customers/add" className="nav-link text-white">Add Customers</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/customers/manage" className="nav-link text-white">Manage Customers</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Sales Dropdown */}
        <li className="nav-item mb-3">
          <button 
            className="nav-link text-white d-flex align-items-center bg-dark border-0 w-100 text-start" 
            onClick={toggleSalesDropdown}
            style={{ cursor: 'pointer' }}>
            <i className="bi bi-cash-stack me-2"></i> Sales
            <i className={`bi ${isSalesOpen ? 'bi-chevron-up' : 'bi-chevron-down'} ms-auto`}></i>
          </button>

          {isSalesOpen && (
            <ul className="nav flex-column ms-3">
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/add" className="nav-link text-white">Add Sales</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/records" className="nav-link text-white">Sales Records</Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/dashboard/sales/reports" className="nav-link text-white">Sales Reports</Link>
              </li>
            </ul>
          )}
        </li>

      </ul>
    </div>
  );
};

export default Sidebar;
