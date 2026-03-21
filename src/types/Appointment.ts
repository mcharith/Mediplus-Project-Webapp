export type Patient = {
    name: string;
    address: string;
    mobile: string;
    email: string;
    picture: string;
};

export type Appointment = {
    id: number;
    date: string;
    patientId: string;
    doctorId: string;
    patient: Patient;
};

export type AppointmentFormData = {
    date: string;
    patientId: string;
    doctorId: string;
}

export const tempAppointments: Appointment[] = [
    {
        id: 1,
        date: "2026-03-20",
        patientId: "123456789V",
        doctorId: "DOC001",
        patient: {
            name: "Charith",
            address: "Matale",
            mobile: "0778986962",
            email: "charithmihiranga453@gmail.com",
            picture: "https://i.pravatar.cc/40?img=1",
        },
    },
    {
        id: 2,
        date: "2026-03-21",
        patientId: "987654321V",
        doctorId: "DOC002",
        patient: {
            name: "Nimal Perera",
            address: "Colombo",
            mobile: "0712345678",
            email: "nimal@gmail.com",
            picture: "https://i.pravatar.cc/40?img=2",
        },
    },
];