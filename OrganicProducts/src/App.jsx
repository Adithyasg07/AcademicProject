import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./Components/LandingPage";
import HomePage from "./Components/HomePage";
import LoginPage from "./Components/LoginPage";
import Register from "./Components/Register";
import ProductDetails from "./Components/ProductDetails";
import Menu from "./Components/menu";
import Recipes from "./Components/Recipes";
import RecipesPage from "./Components/RecipesPage";
import AdminDashboard from "./Components/AdminDashboard";
import Lastpage from "./Components/Lastpage";
import Contact from "./Components/Contact";
import Aboutus from "./Components/Aboutus";
import Faq from "./Components/Faq";
import PrivacyPolicy from "./Components/Privacypolicy";
import Shippingpolicy from "./Components/Shippingpolicy";
import Cancellationreturnpolicy from "./Components/Cancellationreturnpolicy";
import TermsandConditions from "./Components/Termsandconditions";
import UserDashboard from "./Components/UserDashboard";
import WishlistDrawer from "./Components/WishlistDrawer";
import ProductInformation from "./Components/ProductInformation";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import ProtectedRoute from "./Components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/login" element={
                <ProtectedRoute guestOnly={true}>
                  <LoginPage />
                </ProtectedRoute>
              } />
              <Route path="/register" element={
                <ProtectedRoute guestOnly={true}>
                  <Register />
                </ProtectedRoute>
              } />
              <Route path="/product" element={<ProductDetails />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipesPage />} />

              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/lastpage" element={<Lastpage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/privacypolicy" element={<PrivacyPolicy />} />
              <Route path="/shippingpolicy" element={<Shippingpolicy />} />
              <Route path="/cancellationreturnpolicy" element={<Cancellationreturnpolicy />} />
              <Route path="/termsandconditions" element={<TermsandConditions />} />

              <Route path="/userdashboard" element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } />

              <Route path="/wishlist" element={<WishlistDrawer />} />
              <Route path="/ProductInformation" element={<ProductInformation />} />
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}