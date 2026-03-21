import {useEffect, useRef, useState} from "react";
import {type Doctor} from "../types/Doctor.ts";
import toast from "react-hot-toast";
import {ClipLoader} from "react-spinners";
import {FiEdit, FiPlus, FiTrash2} from "react-icons/fi";
import AddEditDoctorSlider from "../component/sliders/AddEditDoctorSlider.tsx";
import {deleteDoctor, getAllDoctors, getDoctorById} from "../service/doctorService.ts";

const Doctors = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);

    const [isAddEditDoctorSliderOpen, setIsAddEditDoctorSliderOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const toastShown = useRef(false);

    const fetchAllDoctors = async () => {
        try {
            setLoading(true);

            const doctorsData = await getAllDoctors();
            setDoctors(doctorsData);

            if (!toastShown.current) {
                toast.success("Doctors loaded successfully");
                toastShown.current = true;
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load doctors");
        } finally {
            setLoading(false);
        }
    };

    const handleEditDoctor = async (doctorId: string) => {
        setLoading(true);
        try {
            const doctorData = await getDoctorById(doctorId);
            if (doctorData) setSelectedDoctor(doctorData);
            setIsAddEditDoctorSliderOpen(true);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load doctor data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDoctor = async (doctorId: string) => {
        toast(
            (t) => (
                <div className="flex flex-col gap-2 p-2">
                    <span>Are you sure you want to delete this doctor?</span>
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
                                    await deleteDoctor(doctorId);
                                    setDoctors((prev) => prev.filter(p => p.doctorId !== doctorId));
                                    toast.success("Doctor deleted successfully");
                                } catch (error) {
                                    console.error(error);
                                    toast.error("Failed to delete doctor");
                                } finally {
                                    setLoading(false);
                                }
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ),
        );
    };

    useEffect(() => {
        fetchAllDoctors();
    }, []);

    // Loading Screen
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <ClipLoader size={50} color="#22c55e" />
            </div>
        );
    }

    return(
        <div className="p-6 bg-gray-100 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Doctors Management
                </h1>

                <button
                    onClick={() => setIsAddEditDoctorSliderOpen(true)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2
                    rounded-xl shadow-md transition cursor-pointer">
                    <FiPlus />
                    Add Doctor
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="p-4">Doc ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Specialization</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                    </thead>

                    <tbody className="text-gray-700">
                    {doctors.map((doctor) => (
                        <tr
                            key={doctor.doctorId}
                            className="border-t hover:bg-gray-50 transition"
                        >

                            <td className="p-4">{doctor.doctorId}</td>
                            <td className="p-4">{doctor.name}</td>
                            <td className="p-4 font-medium">{doctor.specialization}</td>

                            <td className="p-4">
                                <div className="flex justify-center gap-3">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 text-lg cursor-pointer"
                                        onClick={() => handleEditDoctor(doctor.doctorId)}
                                    >
                                        <FiEdit />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700 text-lg cursor-pointer"
                                        onClick={() => handleDeleteDoctor(doctor.doctorId)}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <AddEditDoctorSlider
                    isOpen={isAddEditDoctorSliderOpen}
                    onClose={() => {
                        setIsAddEditDoctorSliderOpen(false)
                        setSelectedDoctor(null);
                    }}
                    selectedDoctor={selectedDoctor}
                    onSaveSuccess={fetchAllDoctors}
                />
            </div>

        </div>
    )
};
export default Doctors;