import { createBrowserRouter } from "react-router-dom";
import Layout from "./component/layout/Layout.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Patients from "./pages/Patient.tsx";
import Doctors from "./pages/Doctor.tsx";
import Appointment from "./pages/Appointment.tsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "/", element: <Dashboard /> },
            { path: "/patients", element: <Patients /> },
            { path: "/doctors", element: <Doctors /> },
            { path: "/appointments", element: <Appointment /> },
        ],
    },
]);