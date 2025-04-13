
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
import AddCategory from "./components/AddCategory";
import ManageCategories from "./components/ManageCategory";
import 'bootstrap/dist/css/bootstrap.min.css';
import Bill from './components/Bill';

// import Home from './pages/home/pages/Home'
// import Collection from './pages/home/pages/Collection'
// import About from './pages/home/pages/About'
// import Contact from './pages/home/pages/Contact'
// import Product from './page/home/pages/Product'
// import Cart from './pages/home/pages/Cart'
// import LogIn from './pages/home/pages/LogIn'
// import PlaceOrder from './pages/home/pages/PlaceOrder'
// import Orders from './pages/home/pages/Orders'
// import Navbar from './pages/home/components/Navbar'
// import Footer from './pages/home/components/Footer'


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}

        {/* <Route path='/' element={<Home/>}/> */}
        {/* <Route path='/collection' element={<Collection/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/product/:productId' element={<Product/>} />
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/logIn' element={<LogIn/>} />
        <Route path='/placeOrder' element={<PlaceOrder/>} />
        <Route path='/orders' element={<Orders/>} /> */}

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
          <Route path="category/add" element={<AddCategory />} />
          <Route path="category/add1" element={<ManageCategories />} />
          <Route path="/dashboard/bill" element={<Bill />} />
          {/* Add other nested routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
