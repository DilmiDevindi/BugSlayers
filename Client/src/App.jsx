import { Routes, Route } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminDashboard from "./components/admin-view/dashboard";
import AdminLayout from "./components/admin-view/layout";
import AdminProducts from "./components/admin-view/products";
import AdminOrders from "./components/admin-view/orders";
import AdminFeatures from "./components/admin-view/features";
import ShoppingLayout from "./components/shopping-view/layout";
import ShoppingHome from "./components/shopping-view/home"; 
import ShoppingListing from "./components/shopping-view/listing";
import ShoppingCheckout from "./components/shopping-view/checkout";
import ShoppingAccount from "./components/shopping-view/account";
import NotFound from "./pages/not-found"; 
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";


function App(){
  const isAuthenticated =true;
  const user={
    name:'Hiruni',
    role:'admin',
  };


  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout/>
          </CheckAuth>
        }>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
        <CheckAuth isAuthenticated={isAuthenticated}user={user}>
          <AdminLayout/>

        </CheckAuth>
         }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* Shopping Routes (with Index Route) */}
        <Route path="/shop" element={
          <CheckAuth isAuthenticated={isAuthenticated}user={user} >
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path="home" element={<ShoppingHome />} /> 
          <Route path="listing" element={<ShoppingListing />} /> 
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
        </Route>

        {/* Catch-All Route (404 Page) */}
        <Route path="*" element={<NotFound />} />
        <Route path ="/unauth-page" element={<UnauthPage/>}/>
      </Routes>
    </div>
  );
}
 
export default App;
