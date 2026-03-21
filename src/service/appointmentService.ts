import type {Appointment, AppointmentFormData} from "../types/Appointment.ts";
import apiClient from "./apiClient.ts";

export const getAllAppointments = async ():Promise<Appointment[]> => {
    const response = await apiClient.get("/appointments");
    console.log(response.data);
    return response.data || [];
};

export const createAppointment = async (
    data: AppointmentFormData
): Promise<Appointment> => {
    try {
        const response = await apiClient.post("/appointments", data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create appointment:", error);
        throw error;
    }
};

export const updateAppointment = async (appointmentId: string, data: AppointmentFormData): Promise<Appointment> => {
    const response = await apiClient.put(`/appointments/${appointmentId}`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return response.data;
};

export const deleteAppointment = async (appointmentId: string): Promise<void> => {
    await apiClient.delete(`/appointments/${appointmentId}`);
};

export const getAppointmentById = async (appointmentId: string): Promise<Appointment | null> => {
    const response = await apiClient.get(`/appointments/${appointmentId}`);
    return response.data || null;
};

