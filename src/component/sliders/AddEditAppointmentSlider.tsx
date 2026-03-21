import { useState, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import type {Patient} from "../../types/Patient.ts";
import type {Doctor} from "../../types/Doctor.ts";
import {getAllPatients} from "../../service/patientService.ts";
import {getAllDoctors} from "../../service/doctorService.ts";
import type {Appointment} from "../../types/Appointment.ts";
import toast from "react-hot-toast";
import {createAppointment, updateAppointment} from "../../service/appointmentService.ts";

type AddEditAppointmentSliderProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedAppointment?: Appointment | null;
    onSaveSuccess?: () => void;
};

const AddEditAppointmentSlider = ({ isOpen, onClose,selectedAppointment,onSaveSuccess }: AddEditAppointmentSliderProps) => {
    const [loading, setLoading] = useState(false);

    const [patientId, setPatientId] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [date, setDate] = useState("");

    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);

    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [patientData, doctorData] = await Promise.all([
                    getAllPatients(),
                    getAllDoctors()
                ]);

                setPatients(Array.isArray(patientData) ? patientData : []);
                setDoctors(Array.isArray(doctorData) ? doctorData : []);
            } catch (error) {
                console.error(error);
            }
        };

        if (isOpen) {
            fetchDropdownData();
        }
    }, [isOpen]);

    const [errors, setErrors] = useState<{
        patientId?: string;
        doctorId?: string;
        date?: string;
    }>({});

    useEffect(() => {
        if (selectedAppointment) {
            setPatientId(selectedAppointment.patientId);
            setDoctorId(selectedAppointment.doctorId);
            setDate(selectedAppointment.date);
            setErrors({});
        } else if (!isOpen){
            setPatientId("");
            setDoctorId("");
            setDate("");
            setErrors({});
        }
    }, [selectedAppointment, isOpen,]);

    const handleSave = async () => {
        setErrors({});

        // ✅ Frontend validation
        if (!patientId || !doctorId || !date) {
            setErrors({
                patientId: !patientId ? "Patient is required" : "",
                doctorId: !doctorId ? "Doctor is required" : "",
                date: !date ? "Date is required" : ""
            });
            return;
        }

        try {
            setLoading(true);

            const payload = {
                patientId,
                doctorId,
                date
            };

            if (selectedAppointment) {
                await updateAppointment(String(selectedAppointment.id), payload);
                toast.success("Appointment updated successfully");
            } else {
                await createAppointment(payload);
                toast.success("Appointment created successfully");
            }

            if (onSaveSuccess) onSaveSuccess();
            onClose();

        } catch (error: any) {
            console.error(error);

            const data = error.response?.data;

            if (data) {
                let fieldErrors: any = {};

                if (data.patientId) fieldErrors.patientId = data.patientId;
                if (data.doctorId) fieldErrors.doctorId = data.doctorId;
                if (data.date) fieldErrors.date = data.date;

                if (data.detail) {
                    const parts = data.detail.split(": ");

                    if (parts.length === 2) {
                        const [field, message] = parts;

                        if (field === "patientId") fieldErrors.patientId = message;
                        else if (field === "doctorId") fieldErrors.doctorId = message;
                        else if (field === "date") fieldErrors.date = message;
                        else {
                            toast.error(data.detail);
                            return;
                        }
                    } else {
                        toast.error(data.detail);
                        return;
                    }
                }

                if (Object.keys(fieldErrors).length > 0) {
                    setErrors(fieldErrors);
                } else {
                    toast.error(data.title || "Something went wrong");
                }

            } else {
                toast.error("Failed to save appointment");
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setPatientId("");
            setDoctorId("");
            setDate("");
        }
    }, [isOpen]);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
            )}

            {/* Slider Panel */}
            <div
                className={`fixed top-0 right-0 bottom-0 w-125 bg-white shadow-xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col
        rounded-tl-[30px] rounded-bl-[30px]
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-medium">Add New Appointment</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-xl cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Inputs */}
                <div className="flex-1 px-4 pb-32 mt-6">
                    <div className="grid grid-cols-2 gap-4">

                        {/* Patient ID Dropdown */}
                        <div className="col-span-1 relative">
                            <label className="text-sm font-light">
                                Patient ID <span className="text-red-500">*</span>
                            </label>

                            <select
                                value={patientId}
                                onChange={(e) => setPatientId(e.target.value)}
                                className="appearance-none px-3 py-2 w-full border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Select Patient</option>

                                {patients.map((p) => (
                                    <option key={p.nic} value={p.nic}>
                                        {p.nic} - {p.name}
                                    </option>
                                ))}
                            </select>

                            {/* Custom Icon */}
                            <IoMdArrowDropdown className="absolute right-3 top-9 text-xl text-gray-500 pointer-events-none" />

                            {errors.patientId && (
                                <p className="text-red-500 text-xs mt-1">{errors.patientId}</p>
                            )}
                        </div>

                        {/* Doctor ID Dropdown */}
                        <div className="col-span-1 relative">
                            <label className="text-sm font-light">
                                Doctor ID <span className="text-red-500">*</span>
                            </label>

                            <select
                                value={doctorId}
                                onChange={(e) => setDoctorId(e.target.value)}
                                className="appearance-none px-3 py-2 w-full border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">Select Doctor</option>

                                {doctors.map((d) => (
                                    <option key={d.doctorId} value={d.doctorId}>
                                        {d.doctorId} - {d.name}
                                    </option>
                                ))}
                            </select>

                            {/* Custom Icon */}
                            <IoMdArrowDropdown className="absolute right-3 top-9 text-xl text-gray-500 pointer-events-none" />
                            {errors.doctorId && (
                                <p className="text-red-500 text-xs mt-1">{errors.doctorId}</p>
                            )}
                        </div>

                        {/* Date */}
                        <div className="col-span-2">
                            <label className="text-sm font-light">
                                Date <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="px-3 py-2 w-full border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.date && (
                                <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                            )}
                        </div>

                    </div>
                </div>

                {/* Buttons */}
                <div className="sticky bottom-0 bg-white px-4 py-4 flex justify-end gap-3 rounded-bl-[30px]">
                    <button
                        onClick={onClose}
                        className="w-28 px-6 py-2 border border-green-500 text-green-700 rounded-lg hover:shadow-xl
                        cursor-pointer transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`w-28 bg-green-500 text-white px-6 py-2 rounded-lg cursor-pointer
                        ${loading
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:opacity-80 hover:shadow-lg"
                        }`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddEditAppointmentSlider;