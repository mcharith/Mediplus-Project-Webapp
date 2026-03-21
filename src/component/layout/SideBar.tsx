import {
    FiHome,
    FiUsers,
    FiUserCheck,
    FiCalendar
} from "react-icons/fi";
import { NavLink } from "react-router-dom";

const SideBar = () => {
    const menuItems = [
        { name: "Dashboard", path: "/", icon: <FiHome /> },
        { name: "Patients", path: "/patients", icon: <FiUsers /> },
        { name: "Doctors", path: "/doctors", icon: <FiUserCheck /> },
        { name: "Appointments", path: "/appointments", icon: <FiCalendar /> },
    ];

    return (
        <div className="group bg-green-500 text-white h-screen w-20 hover:w-64 duration-300 p-5 pt-8 relative">

            {/* Top Center Title */}
            <h1 className="absolute top-6 left-1/2 -translate-x-1/2 text-xl font-bold opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap">
                Medi Plus
            </h1>

            {/* Menu */}
            <ul className="mt-16 space-y-2">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-x-4 p-3 rounded-md transition-all duration-200 ${
                                    isActive
                                        ? "bg-green-700 shadow-md"
                                        : "hover:bg-green-600"
                                }`
                            }
                        >
                            {/* Icon */}
                            <span className="text-xl">{item.icon}</span>

                            {/* Text (show on hover) */}
                            <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap">
                {item.name}
              </span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SideBar;