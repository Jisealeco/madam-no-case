import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import About from './pages/About.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import Contact from './pages/Contact.jsx';
import Gallery from './pages/Gallery.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Products from './pages/Products.jsx';
import Services from './pages/Services.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="services" element={<Services />} />
        <Route path="products" element={<Products />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="admin" element={<AdminLogin />} />
      <Route path="admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}
