import type { Patient } from "../types/Patient.ts";
import apiClient from "./apiClient.ts";

export const getAllPatients = async (): Promise<Patient[]> => {
    const response = await apiClient.get("/patient");
    console.log(response.data);
    return response.data || [];
};

export const createPatient = async (patient: Patient, file?: File): Promise<Patient> => {
    const formData = new FormData();
    formData.append("nic", patient.nic);
    formData.append("name", patient.name);
    formData.append("mobile", String(patient.mobile));
    formData.append("email", patient.email);
    formData.append("address", patient.address);
    if (file) {
        formData.append("picture", file);
    }
    const response = await apiClient.post("/patient", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getPatientById = async (patientId: string): Promise<Patient | null> => {
    const response = await apiClient.get(`/patient/${patientId}`);
    return response.data || null;
};

export const updatePatient = async (patientId: string, patient: Patient, file?: File): Promise<Patient> => {
    const formData = new FormData();
    formData.append("nic", patient.nic);
    formData.append("name", patient.name);
    formData.append("mobile", String(patient.mobile));
    formData.append("email", patient.email);
    formData.append("address", patient.address);
    if (file) {
        formData.append("picture", file);
    }
    const response = await apiClient.put(`/patient/${patientId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

export const deletePatient = async (patientId: string): Promise<void> => {
    await apiClient.delete(`/patient/${patientId}`);
};