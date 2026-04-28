import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

function Dashboard() {
  return (
    <>
      <div className="flex">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>


    </>
  );
}

export default Dashboard;