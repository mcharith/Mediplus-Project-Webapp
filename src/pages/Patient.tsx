import { useEffect, useState, useRef } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { type Patient } from "../types/Patient.ts";
import AddEditPatientSlider from "../component/sliders/AddEditPatientSlider.tsx";
import {deletePatient, getAllPatients, getPatientById} from "../service/patientService.ts";

const Patients = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);

    const [isAddEditPatientSliderOpen, setIsAddEditPatientSliderOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const toastShown = useRef(false);

    const fetchAllPatients = async () => {
        try {
            setLoading(true);
            const patientsData = await getAllPatients();
            setPatients(patientsData);
            if (!toastShown.current) {
                toast.success("Patients loaded successfully");
                toastShown.current = true;
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load patients");
        } finally {
            setLoading(false);
        }
    };

    const handleEditPatient = async (patientId: string) => {
        setLoading(true);
        try {
            const patientData = await getPatientById(patientId);
            if (patientData) setSelectedPatient(patientData);
            setIsAddEditPatientSliderOpen(true);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load patient data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePatient = async (patientId: string) => {
        toast(
            (t) => (
                <div className="flex flex-col gap-2 p-2">
                    <span>Are you sure you want to delete this patient?</span>
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
                                    await deletePatient(patientId);
                                    setPatients((prev) => prev.filter(p => p.nic !== patientId));
                                    toast.success("Patient deleted successfully");
                                } catch (error) {
                                    console.error(error);
                                    toast.error("Failed to delete patient");
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
        fetchAllPatients();
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
                    Patients Management
                </h1>

                <button
                    onClick={() => setIsAddEditPatientSliderOpen(true)}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2
                    rounded-xl shadow-md transition cursor-pointer">
                    <FiPlus />
                    Add Patient
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                        <th className="p-4">Profile</th>
                        <th className="p-4">NIC</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Address</th>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                    </thead>

                    <tbody className="text-gray-700">
                    {Array.isArray(patients) && patients.map((patient) => (
                        <tr
                            key={patient.nic}
                            className="border-t hover:bg-gray-50 transition"
                        >
                            <td className="p-4">
                                <img
                                    src={patient.picture}
                                    alt="patient"
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            </td>

                            <td className="p-4">{patient.nic}</td>
                            <td className="p-4 font-medium">{patient.name}</td>
                            <td className="p-4">{patient.mobile}</td>
                            <td className="p-4">{patient.email}</td>
                            <td className="p-4">{patient.address}</td>

                            <td className="p-4">
                                <div className="flex justify-center gap-3">
                                    <button
                                        className="text-blue-500 hover:text-blue-700 text-lg cursor-pointer"
                                        onClick={() => handleEditPatient(patient.nic)}
                                    >
                                        <FiEdit />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700 text-lg cursor-pointer"
                                        onClick={() => handleDeletePatient(patient.nic)}
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

            <AddEditPatientSlider
                isOpen={isAddEditPatientSliderOpen}
                onClose={() => {
                    setIsAddEditPatientSliderOpen(false)
                    setSelectedPatient(null);
                }}
                selectedPatient={selectedPatient}
                onSaveSuccess={fetchAllPatients}
            />
        </div>
    );
};

export default Patients;