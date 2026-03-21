import {useState, useEffect} from "react";
import type {Doctor} from "../../types/Doctor.ts";
import toast from "react-hot-toast";
import {createDoctor, updateDoctor} from "../../service/doctorService.ts";

type AddEditDoctorSliderProps = {
    isOpen: boolean;
    onClose: () => void
    selectedDoctor?: Doctor | null;
    onSaveSuccess?: () => void;
};

const AddEditDoctorSlider = ({ isOpen, onClose,selectedDoctor,onSaveSuccess }: AddEditDoctorSliderProps) => {
    const [loading, setLoading] = useState(false);

    const [docId, setDocId] = useState("");
    const [name, setName] = useState("");
    const [specialization, setSpecialization] = useState("");

    const [errors, setErrors] = useState<{
        docId?: string;
        name?: string;
        specialization?: string;
    }>({});

    useEffect(() => {
        if (selectedDoctor) {
            setDocId(selectedDoctor.doctorId);
            setName(selectedDoctor.name);
            setSpecialization(selectedDoctor.specialization);
            setErrors({});
        } else if (!isOpen){
            setDocId("");
            setName("");
            setSpecialization("");
            setErrors({});
        }
    }, [selectedDoctor, isOpen,]);

    const handleSave = async () => {
        setErrors({});

        if (!docId || !name || !specialization) {
            setErrors({
                docId: !docId ? "Doctor ID is required" : "",
                name: !name ? "Name is required" : "",
                specialization: !specialization ? "Specialization is required" : ""
            });
            return;
        }

        try {
            setLoading(true);

            const doctorData: Doctor = {
                doctorId: docId,
                name,
                specialization
            };

            if (selectedDoctor) {
                await updateDoctor(selectedDoctor.doctorId, doctorData);
                toast.success("Doctor updated successfully");
            } else {
                await createDoctor(doctorData);
                toast.success("Doctor created successfully");
            }

            if (onSaveSuccess) onSaveSuccess();
            onClose();

        } catch (error: any) {
            console.error(error);

            const data = error.response?.data;

            if (data) {
                let fieldErrors: any = {};

                if (data.doctorId) fieldErrors.docId = data.doctorId;
                if (data.name) fieldErrors.name = data.name;
                if (data.specialization) fieldErrors.specialization = data.specialization;

                if (data.detail) {
                    const parts = data.detail.split(": ");

                    if (parts.length === 2) {
                        const [field, message] = parts;

                        if (field === "doctorId") fieldErrors.docId = message;
                        else if (field === "name") fieldErrors.name = message;
                        else if (field === "specialization") fieldErrors.specialization = message;
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
                toast.error("Failed to save doctor");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setDocId("");
            setName("");
            setSpecialization("");
            setErrors({});
        }
    }, [selectedDoctor,isOpen]);

    return (
        <>
            {/* Overlay */}
            {isOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />}

            {/* Slider Panel */}
            <div
                className={`fixed top-0 right-0 bottom-0 w-125 bg-white shadow-xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col
                rounded-tl-[30px] rounded-bl-[30px]
                ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-medium">
                        {selectedDoctor ? "Edit Doctor" : "Add New Doctor"}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black text-xl cursor-pointer">
                        ✕
                    </button>
                </div>

                {/* Inputs */}
                <div className="flex-1 px-4 pb-32 mt-6">
                    <div className="grid grid-cols-2 gap-4">

                        {/*Doc ID*/}
                        <div className="col-span-1">
                            <label className="text-sm font-light">
                                Doctor ID <span className="text-red-500 text-sm">*</span>
                            </label>

                            <input
                                value={docId}
                                onChange={(e) => setDocId(e.target.value)}
                                type="text"
                                placeholder="Enter Doctor Id"
                                className="px-3 py-2 w-full bg-serch-box border border-gray-300 rounded-xl text-sm font-thin focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.docId && (
                                <p className="text-red-500 text-xs mt-1">{errors.docId}</p>
                            )}
                        </div>

                        {/*Name*/}
                        <div className="col-span-1">
                            <label className="text-sm font-light">
                                Doctor Name <span className="text-red-500 text-sm">*</span>
                            </label>

                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="Enter Name"
                                className="px-3 py-2 w-full bg-serch-box border border-gray-300 rounded-xl text-sm font-thin focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                            )}
                        </div>

                        {/*Specialization*/}
                        <div className="col-span-2">
                            <label className="text-sm font-light">
                                Specialization <span className="text-red-500 text-sm">*</span>
                            </label>

                            <input
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                type="text"
                                placeholder="Enter Specialization"
                                className="px-3 py-2 w-full bg-serch-box border border-gray-300 rounded-xl text-sm font-thin focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.specialization && (
                                <p className="text-red-500 text-xs mt-1">{errors.specialization}</p>
                            )}
                        </div>

                    </div>
                </div>

                {/* Buttons */}
                <div className="sticky bottom-0 bg-white px-4 py-4 flex justify-end gap-3 rounded-bl-[30px]">
                    <button
                        onClick={onClose}
                        className="w-28 px-6 py-2 border border-green-500 text-green-700 rounded-lg
                        hover:shadow-xl transition duration-200 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`w-28 bg-green-500 text-white px-6 py-2 rounded-lg cursor-pointer
                        ${loading ? "opacity-70 cursor-not-allowed" : "hover:drop-shadow-lg hover:opacity-80"}`}
                    >
                        {selectedDoctor ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddEditDoctorSlider;