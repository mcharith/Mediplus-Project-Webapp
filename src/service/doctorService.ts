import type {Doctor} from "../types/Doctor.ts";
import apiClient from "./apiClient.ts";

export const getAllDoctors = async ():Promise<Doctor[]> => {
    const response = await apiClient.get("/doctor");
    console.log(response.data);
    return response.data || [];
}

export const createDoctor = async (body: Doctor): Promise<Doctor> => {
    try {
        const response = await apiClient.post("/doctor", body, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create doctor:", error);
        throw error;
    }
};

export const updateDoctor = async (doctorId: string, body: Doctor): Promise<Doctor> => {
    const response = await apiClient.put(`/doctor/${doctorId}`, body, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const deleteDoctor = async (doctorId: string): Promise<void> => {
    await apiClient.delete(`/doctor/${doctorId}`);
};

export const getDoctorById = async (doctorId: string): Promise<Doctor | null> => {
    const response = await apiClient.get(`/doctor/${doctorId}`);
    return response.data || null;
};