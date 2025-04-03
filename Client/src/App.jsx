import { Routes, Route } from "react-router-dom";
import { useEffect } from "react"; // ✅ Added missing import
import { useSelector, useDispatch } from "react-redux"; // ✅ Added missing import
import { checkAuth } from "./store/auth-slice";

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
import { Skeleton } from "./components/ui/skeleton";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return (
    <div className="w-full h-screen flex items-center justify-center">
      <Skeleton className="w-[800px] h-[600px]" />
    </div>
  );

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>

        {/* Admin Routes (Protected) */}
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* Shopping Routes */}
        <Route path="/shop" element={<ShoppingLayout />}>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
        </Route>

        {/* Unauthenticated Page */}
        <Route path="/unauth-page" element={<UnauthPage />} />

        {/* Catch-All Route (404 Page) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
