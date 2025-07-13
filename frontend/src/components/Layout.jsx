import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <Navbar />
      <div className="d-flex" style={{ height: '100vh', overflow: 'hidden' }}>
        <Sidebar />
        <div 
          className="flex-grow-1 p-4" 
          style={{ 
            overflowY: 'auto', 
            marginTop: '56px',   // Adjust to your Navbar height
            marginLeft: '260px'  // Same as Sidebar width
          }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;