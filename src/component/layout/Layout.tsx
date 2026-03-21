import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import {Toaster} from "react-hot-toast";

const Layout = () => {
    return (
        <div className="flex">
            <SideBar />
            <div className="flex-1 min-h-screen">
                <Outlet />
                <Toaster position="top-center" />
            </div>
        </div>

    );
};

export default Layout;