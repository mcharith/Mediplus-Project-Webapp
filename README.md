# WebApp


A modern frontend application for the Channeling Center Management System. It provides a full-featured UI for managing patients, doctors, and appointments through a centralized API Gateway.

---

## 📖 About

This web application is built to simplify and digitize the workflow of a channeling center. It offers a clean and responsive interface that allows users to manage patients, doctors, and appointments efficiently.

The system is designed using a modern frontend stack and integrates seamlessly with a microservice-based backend architecture through an API Gateway. This ensures scalability, maintainability, and better performance.

With features like real-time data visualization, structured forms, and intuitive navigation, the application enhances productivity and provides a smooth user experience.

---

## 🛠️ Tech Stack

| Technology        | Details              |
|------------------|---------------------|
| React            | 19.2.3              |
| TypeScript       | 5                   |
| Tailwind CSS     | 4                   |
| Recharts         | Latest Version      |
| Lucide React     | Icon set            |
| Axios            | HTTP client         |
| React Hot Toast  | Toast notifications |

---

## ✨ Features

| Page        | Path           | Description |
|-------------|---------------|-------------|
| Dashboard   | /dashboard    | Stats overview and appointment trends using line charts |
| Patient     | /patient      | Create, view, edit, and delete patients with avatar display |
| Doctors     | /doctor       | Create, view, edit, and delete doctors |
| Appointment | /appointments | Create, view, edit, and delete appointments |

---

## 📁 Project Structure

```bash
webapp/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   └── Sidebar.tsx
│   │   └── slider/
│   │       ├── AddEditAppointmentSlider.tsx
│   │       ├── AddEditDoctorSlider.tsx
│   │       └── AddEditPatientSlider.tsx
│   ├── pages/
│   │   ├── Appointment.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Doctor.tsx
│   │   └── Patient.tsx
│   ├── service/
│   │   ├── apiClient.ts
│   │   ├── appointmentService.ts
│   │   ├── doctorService.ts
│   │   └── patientService.ts
│   └── types/
│       ├── Appointment.ts
│       ├── Dashboard.ts
│       ├── Doctor.ts
│       └── Patient.ts
└── .env.local
```
---

## 🔐 Environment Variables

Create a `.env.local` file inside the webapp/ directory:

```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:7001
```

---

## ⚙️ Getting Started

### 🔄 Full Startup Order

1. Config Server (9100)
2. Service Registry (9001)
3. API Gateway (7001)
4. Patient Service
5. Doctor Service
6. Appointment Service
7. WebApp (5173)

---

### 📦 Install Dependencies

~~~bash
npm install
~~~

---

### ▶️ Run Development Server

~~~
npm run dev
~~~

---

### 🌐 Access the Application
~~~
http://localhost:5173
~~~

---