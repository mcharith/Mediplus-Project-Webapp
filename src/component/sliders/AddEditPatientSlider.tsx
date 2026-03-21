import { useState, useRef, useEffect } from "react";
import { AiOutlineCamera } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { type Patient } from "../../types/Patient.ts";
import {createPatient, updatePatient} from "../../service/patientService.ts";

type AddEditPatientSliderProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedPatient?: Patient | null;
    onSaveSuccess?: () => void;
    onPatientCreated?: (patient: Patient) => void;
};

const AddEditPatientSlider = ({ isOpen, onClose,onSaveSuccess,selectedPatient }: AddEditPatientSliderProps) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const [nic, setNic] = useState("");
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (selectedPatient) {
            setNic(selectedPatient.nic);
            setName(selectedPatient.name);
            setMobile(String(selectedPatient.mobile));
            setEmail(selectedPatient.email);
            setAddress(selectedPatient.address);
            setImagePreview(selectedPatient.picture);
            setSelectedFile(null);
        } else if (!isOpen) {
            // Reset form when closing
            setNic("");
            setName("");
            setMobile("");
            setEmail("");
            setAddress("");
            setImagePreview(null);
            setSelectedFile(null);
        }
    }, [selectedPatient, isOpen]);

    const [errors, setErrors] = useState<{
        nic?: string;
        name?: string;
        mobile?: string;
        email?: string;
        address?: string;
    }>({});

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleChangeImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImagePreview(null);
        setSelectedFile(null);
    };

    const handleSave = async () => {
        setErrors({});

        if (!nic || !name || !mobile || !email || !address) {
            const newErrors: any = {};
            if (!nic) newErrors.nic = "NIC is required";
            if (!name) newErrors.name = "Name is required";
            if (!mobile) newErrors.mobile = "Mobile is required";
            if (!email) newErrors.email = "Email is required";
            if (!address) newErrors.address = "Address is required";
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);

            const patientData: Patient = {
                nic,
                name,
                mobile: Number(mobile),
                email,
                address,
                picture: "",
            };

            if (selectedPatient) {
                await updatePatient(selectedPatient.nic, patientData, selectedFile || undefined);
                toast.success("Patient updated successfully");
            } else {
                await createPatient(patientData, selectedFile || undefined);
                toast.success("Patient created successfully");
            }

            if (onSaveSuccess) onSaveSuccess();
            onClose();

        } catch (error: any) {
            console.error(error);

            const data = error.response?.data;

            if (data) {
                const fieldErrors: any = {};

                if (data.nic) fieldErrors.nic = data.nic;
                if (data.name) fieldErrors.name = data.name;
                if (data.mobile) fieldErrors.mobile = data.mobile;
                if (data.email) fieldErrors.email = data.email;
                if (data.address) fieldErrors.address = data.address;

                if (data.detail) {
                    const parts = data.detail.split(": ");
                    if (parts.length === 2) {
                        const [field, message] = parts;
                        switch (field.toLowerCase()) {
                            case "nic":
                                fieldErrors.nic = message;
                                break;
                            case "name":
                                fieldErrors.name = message;
                                break;
                            case "mobile":
                                fieldErrors.mobile = message;
                                break;
                            case "email":
                                fieldErrors.email = message;
                                break;
                            case "address":
                                fieldErrors.address = message;
                                break;
                            default:
                                toast.error(data.detail);
                                break;
                        }
                    } else {
                        toast.error(data.detail);
                    }
                }

                if (Object.keys(fieldErrors).length > 0) {
                    setErrors(fieldErrors);
                } else {
                    toast.error(data.title || "Something went wrong");
                }
            } else {
                toast.error("Failed to save patient");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setNic("");
            setName("");
            setMobile("");
            setEmail("");
            setAddress("");
            setImagePreview(null);
            setSelectedFile(null);
        }
    }, [isOpen]);

    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />}

            <div
                className={`fixed top-0 right-0 bottom-0 w-125 bg-white shadow-xl z-50 transform transition-transform duration-500 ease-in-out flex flex-col
                rounded-tl-[30px] rounded-bl-[30px]
                ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-medium">Add New Patient</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black text-xl cursor-pointer">✕</button>
                </div>

                {/* Image */}
                <div className="flex justify-between px-4 mt-4">
                    <div className="flex flex-col items-center relative">
                        <div className="w-40 h-32 bg-gray-600 rounded-lg flex items-center justify-center overflow-hidden relative">
                            {imagePreview ? (
                                <>
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={handleRemoveImage}
                                        className="absolute top-1 right-1 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center hover:bg-gray-800 cursor-pointer"
                                    >
                                        <IoClose size={16} />
                                    </button>
                                </>
                            ) : (
                                <AiOutlineCamera className="text-3xl text-white" />
                            )}
                        </div>
                        <button
                            className="mt-2 text-popup-button underline text-sm cursor-pointer text-blue-400"
                            onClick={handleChangeImageClick}
                        >
                            Change Patient Image
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                {/* Inputs */}
                <div className="flex-1 px-4 pb-32 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/*NIC*/}
                        <div className="col-span-1">
                            <label className="text-sm font-light">
                                Patient NIC <span className="text-red-500 text-sm">*</span>
                            </label>
                            <input
                                value={nic}
                                onChange={(e) => setNic(e.target.value)}
                                type="text"
                                placeholder="Enter NIC"
                                className="px-3 py-2 w-full bg-serch-box border border-gray-300 rounded-xl text-sm font-thin focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.nic && (
                                <p className="text-red-500 text-xs mt-1">{errors.nic}</p>
                            )}
                        </div>

                        {/*Name*/}
                        <div className="col-span-1">
                            <label className="text-sm font-light">
                                Patient Name <span className="text-red-500 text-sm">*</span>
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

                        {/*Mobile*/}
                        <div className="col-span-1">
                            <label className="text-sm font-light">
                                Patient Mobile <span className="text-red-500 text-sm">*</span>
                            </label>
                            <input
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                type="text"
                                placeholder="Enter Mobile Number"
                                className="px-3 py-2 w-full bg-serch-box border border-gray-300 rounded-xl text-sm font-thin focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.mobile && (
                                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                            )}
                        </div>

                        {/*Email*/}
                        <div className="col-span-1">
                            <label className="text-sm font-light">
                                Email <span className="text-red-500 text-sm">*</span>
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="text"
                                placeholder="Enter Email"
                                className="px-3 py-2 w-full bg-serch-box border border-gray-300 rounded-xl text-sm font-thin focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/*Address*/}
                        <div className="col-span-2">
                            <label className="text-sm font-light">
                                Address <span className="text-red-500 text-sm">*</span>
                            </label>
                            <input
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                type="text"
                                placeholder="Enter Address"
                                className="px-3 py-2 w-full bg-serch-box border border-gray-300 rounded-xl text-sm font-thin focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                            />
                            {errors.address && (
                                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="sticky bottom-0 bg-white px-4 py-4 flex justify-end gap-3 rounded-bl-[30px]">
                    <button
                        onClick={onClose}
                        className="w-28 px-6 py-2 border border-green-500 text-green-700 rounded-lg hover:shadow-xl transition duration-200 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className={`w-28 bg-green-500 text-white px-6 py-2 rounded-lg cursor-pointer
                        ${loading ? "opacity-70 cursor-not-allowed" : "hover:drop-shadow-lg hover:opacity-80"}`}
                    >
                        Save
                    </button>
                </div>
            </div>
        </>
    );
};

export default AddEditPatientSlider;