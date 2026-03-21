import { useEffect, useState, useRef } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import {type Appointment} from "../types/Appointment.ts";
import AddEditAppointmentSlider from "../component/sliders/AddEditAppointmentSlider.tsx";
import {deleteAppointment, getAllAppointments, getAppointmentById} from "../service/appointmentService.ts";

const Appointment = () => {
    const [appointments, setAppointment] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);

    const [isAddEditAppointmentSliderOpen, setIsAddEditAppointmentSliderOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const toastShown = useRef(false);

    const fetchAllAppointment = async () => {
        try {
            setLoading(true);

            const data = await getAllAppointments();
            if (Array.isArray(data)) {
                setAppointment(data);
            } else {
                console.error("Invalid response:", data);
                setAppointment([]);
            }

            if (!toastShown.current) {
                toast.success("Appointment loaded successfully");
                toastShown.current = true;
            }

        } catch (error) {
            console.error(error);
            toast.error("Failed to load appointment");
        } finally {
            setLoading(false);
        }
    };

    const handleEditAppointment = async (appointmentId: string) => {
        setLoading(true);
        try {
            const appointmentData = await getAppointmentById(appointmentId);
            if (appointmentId) setSelectedAppointment(appointmentData);
            setIsAddEditAppointmentSliderOpen(true);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load appointment data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = async (appointmentId: string) => {
        toast((t) => (
            <div className="flex flex-col gap-2 p-2">
                <span>Are you sure you want to delete this appointment?</span>

                <div className="flex justify-end gap-2">
                    <button
                        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </button>

                    <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                setLoading(true);

                                await deleteAppointment(appointmentId);

                                setAppointment((prev) =>
                                    prev.filter(p => p.id !== Number(appointmentId))
                                );

                                toast.success("Appointment deleted successfully");

                            } catch (error) {
                                console.error(error);
                                toast.error("Failed to delete appointment");
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        Delete
                    </button>
                </div>
            </div>
        ));
    };

    useEffect(() => {
        fetchAllAppointment();
    }, []);

    // Loading Screen
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <ClipLoader size={50} color="#22c55e" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Appointment Management
                </h1>

                <button
                    onClick={() => setIsAddEditAppointmentSliderOpen(true)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2
                    rounded-xl shadow-md transition cursor-pointer">
                    <FiPlus />
                    Add Appointment
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="p-4">Patient Profile</th>
                        <th className="p-4">Appointment ID</th>
                        <th className="p-4">Patient ID</th>
                        <th className="p-4">Doctor ID</th>
                        <th className="p-4">Patient Phone</th>
                        <th className="p-4">Date</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                    </thead>

                    <tbody className="text-gray-700">
                    {appointments.map((appointment) => (
                        <tr
                            key={appointment.id}
                            className="border-t hover:bg-gray-50 transition"
                        >
                            <td className="p-4">
                                <div className="flex items-center gap-3">

                                    {/* Profile Image */}
                                    <img
                                        src={appointment.patient.picture}
                                        alt="patient"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />

                                    {/* Name and Email */}
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-800">
                                            {appointment.patient.name}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {appointment.patient.email}
                                        </span>
                                    </div>

                                </div>
                            </td>

                            <td className="p-4">{appointment.id}</td>
                            <td className="p-4 font-medium">{appointment.patientId}</td>
                            <td className="p-4">{appointment.doctorId}</td>
                            <td className="p-4">{appointment.patient.mobile}</td>
                            <td className="p-4">{appointment.date}</td>

                            <td className="p-4">
                                <div className="flex justify-center gap-3">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 text-lg cursor-pointer"
                                        onClick={() => handleEditAppointment(String(appointment.id))}
                                    >
                                        <FiEdit />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700 text-lg cursor-pointer"
                                        onClick={() => handleDeleteAppointment(String(appointment.id))}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <AddEditAppointmentSlider
                isOpen={isAddEditAppointmentSliderOpen}
                onClose={() => {
                    setIsAddEditAppointmentSliderOpen(false)
                    setSelectedAppointment(null);
                }}
                selectedAppointment={selectedAppointment}
                onSaveSuccess={fetchAllAppointment}
            />
        </div>
    );
};

export default Appointment;