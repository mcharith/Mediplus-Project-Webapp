import { useEffect, useState } from "react";
import {
    FiUsers,
    FiUserCheck,
    FiCalendar,
    FiActivity
} from "react-icons/fi";
import { getAllPatients } from "../service/patientService.ts";
import { getAllDoctors } from "../service/doctorService.ts";
import { getAllAppointments } from "../service/appointmentService.ts";
import type { Patient } from "../types/Patient.ts";
import type { Doctor } from "../types/Doctor.ts";
import type { Appointment } from "../types/Appointment.ts";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import {ClipLoader} from "react-spinners";

const Dashboard = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [patientData, doctorData, appointmentData] = await Promise.all([
                    getAllPatients(),
                    getAllDoctors(),
                    getAllAppointments()
                ]);

                setPatients(Array.isArray(patientData) ? patientData : []);
                setDoctors(Array.isArray(doctorData) ? doctorData : []);
                setAppointments(Array.isArray(appointmentData) ? appointmentData : []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Recharts data: group appointments by date
    const chartData = appointments.reduce<{ date: string; count: number }[]>((acc, curr) => {
        const existing = acc.find(item => item.date === curr.date);
        if (existing) {
            existing.count += 1;
        } else {
            acc.push({ date: curr.date, count: 1 });
        }
        return acc;
    }, []);

    // Stats cards
    const stats = [
        {
            title: "Patients",
            value: patients.length,
            icon: <FiUsers />,
            color: "bg-blue-500"
        },
        {
            title: "Doctors",
            value: doctors.length,
            icon: <FiUserCheck />,
            color: "bg-green-500"
        },
        {
            title: "Appointments",
            value: appointments.length,
            icon: <FiCalendar />,
            color: "bg-purple-500"
        },
        {
            title: "Revenue",
            value: "$2,500",
            icon: <FiActivity />,
            color: "bg-pink-500"
        }
    ];

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
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-2xl shadow-md p-5 flex items-center justify-between hover:shadow-xl transition duration-300"
                    >
                        <div>
                            <p className="text-gray-500 text-sm">{item.title}</p>
                            <h2 className="text-2xl font-bold text-gray-800">{item.value}</h2>
                        </div>

                        <div className={`text-white p-3 rounded-xl ${item.color}`}>
                            <span className="text-2xl">{item.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Line Chart */}
            <div className="bg-white p-5 rounded-2xl shadow-md mt-8">
                <h2 className="text-lg font-semibold mb-4">Appointments Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="date" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;