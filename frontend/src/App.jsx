
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Login'; // Ensure the path is correct
import Signup from './components/Signup'; // Ensure the path is correct
import Dashboard from './components/Dashboard'; // Ensure the path is correct
import Layout from './components/Layout'; // Ensure the path is correct
import './App.css';
import AddSupplier from './components/AddSupplier'; // Ensure the path is correct
import ManageSuppliers from './components/ManageSuppliers'; // Ensure the path is correct
import EditSupplier from './components/EditSupplier'; // Ensure the path is correct
import AddInventoryItem from './components/AddInventoryItem'; // Ensure the path is correct
import ManageInventories from './components/ManageInventories'; // Ensure the path is correct
import AddCustomer from './components/AddCustomer';
import ManageCustomer from './components/ManageCustomer'; // Ensure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Layout />}>
          {/* Nested routes under /dashboard */}
          <Route index element={<Dashboard />} /> {/* Default route for /dashboard */}
          <Route path="suppliers/add" element={<AddSupplier />} />
          <Route path="suppliers/manage" element={<ManageSuppliers />} />
          <Route path="suppliers/edit/:id" element={<EditSupplier />} />
          <Route path="inventory/add" element={<AddInventoryItem />} />
          <Route path="inventory/add1" element={<ManageInventories />} />
          <Route path="customers/add" element={<AddCustomer />} />
          <Route path="customers/manage" element={<ManageCustomer />} />
          {/* Add other nested routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
