import { Outlet } from "react-router-dom"; 
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";

function AdminLayout() {
  const [openSidebar,setOpenSidebar ] =useState(false)
  return (
    <div className="flex min-h-screen w-full">
      {/* Admin Sidebar */}
      <AdminSideBar open={openSidebar} setOpen={setOpenSidebar}/>
      
      <div className="flex flex-1 flex-col">
        {/* Admin Header */}
        <AdminHeader setOpen={setOpenSidebar} />
        
        {/* Main Content */}
        <main className="flex-1 flex bg-muted/40 p-4 md:p-6">
          <Outlet /> {/* ✅ Renders child components */}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
