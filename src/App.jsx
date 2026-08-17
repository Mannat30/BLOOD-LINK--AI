import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom'

// Layout
import Layout from './components/Layout.jsx'

// Authentication
import Login from './pages/Login.jsx'
import Registration from './pages/Registration.jsx'

// Dashboards
import AdminDashboard from './pages/AdminDashboard.jsx'
import DonorDashboard from './pages/DonorDashboard.jsx'
import PatientDashboard from './pages/PatientDashboard.jsx'
import HospitalDashboard from './pages/HospitalDashboard.jsx'
import BloodBankDashboard from './pages/BloodBankDashboard.jsx'

// Profiles
import DonorProfile from './pages/DonorProfile.jsx'
import PatientProfile from './pages/PatientProfile.jsx'
import HospitalProfile from './pages/HospitalProfile.jsx'

// Other pages
import DonationHistory from './pages/DonationHistory.jsx'
import DonorRanking from './pages/DonorRanking.jsx'
import EligibleDonors from './pages/EligibleDonors.jsx'

import BloodRequestForm from './pages/BloodRequestForm.jsx'
import BloodRequestList from './pages/BloodRequestList.jsx'
import BloodRequestDetails from './pages/BloodRequestDetails.jsx'

import BloodAllocation from './pages/BloodAllocation.jsx'
import Notifications from './pages/Notifications.jsx'


// ======================================================
// ROLE BASED DASHBOARD
// ======================================================

const RoleDashboard = () => {

    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    )

    const role = user?.role

    switch (role) {

        case 'ADMIN':
            return <AdminDashboard user={user} />

        case 'DONOR':
            return <DonorDashboard user={user} />

        case 'PATIENT':
            return <PatientDashboard user={user} />

        case 'HOSPITAL':
            return <HospitalDashboard user={user} />

        case 'BLOOD_BANK':
            return <BloodBankDashboard user={user} />

        default:
            console.log('Unknown role:', role)
            return <Navigate to="/" replace />
    }
}

// ======================================================
// SETTINGS / PROFILE REDIRECT
// ======================================================

const ProfileRedirect = () => {

    const user = JSON.parse(
        localStorage.getItem('user') || '{}'
    )

    switch (user?.role) {

        case 'DONOR':
            return <Navigate to="/donor-profile" replace />

        case 'PATIENT':
            return <Navigate to="/patient-profile" replace />

        case 'HOSPITAL':
            return <Navigate to="/hospital-profile" replace />

        default:
            return <Navigate to="/dashboard" replace />
    }
}


// ======================================================
// APPLICATION ROUTES
// ======================================================

const AppRoutes = () => {

    return (
        <Layout>

            <Routes>

                {/* ================= DASHBOARD ================= */}

                <Route
                    path="/dashboard"
                    element={<RoleDashboard />}
                />


                {/* ================= PROFILE ================= */}

                <Route
                    path="/settings"
                    element={<ProfileRedirect />}
                />

                <Route
                    path="/donor-profile"
                    element={<DonorProfile />}
                />

                <Route
                    path="/patient-profile"
                    element={<PatientProfile />}
                />

                <Route
                    path="/hospital-profile"
                    element={<HospitalProfile />}
                />


                {/* ================= DONOR ================= */}

                <Route
                    path="/donation-history"
                    element={<DonationHistory />}
                />

                <Route
                    path="/donor-ranking"
                    element={<DonorRanking />}
                />

                <Route
                    path="/eligible-donors"
                    element={<EligibleDonors />}
                />


                {/* ================= BLOOD REQUEST ================= */}

                <Route
                    path="/blood-request/create"
                    element={<BloodRequestForm />}
                />

                <Route
                    path="/blood-request"
                    element={<BloodRequestForm />}
                />

                <Route
                    path="/blood-requests"
                    element={<BloodRequestList />}
                />

                <Route
                    path="/blood-request/:id"
                    element={<BloodRequestDetails />}
                />


                {/* ================= BLOOD ALLOCATION ================= */}

                <Route
                    path="/blood-allocation"
                    element={<BloodAllocation />}
                />


                {/* ================= NOTIFICATIONS ================= */}

                <Route
                    path="/notifications"
                    element={<Notifications />}
                />


                {/* ================= UNKNOWN URL ================= */}

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />

            </Routes>

        </Layout>
    )
}


// ======================================================
// APP
// ======================================================

function App() {

    return (
        <Router>

            <Routes>

                {/* ================= AUTH ================= */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Registration />}
                />


                {/* ================= APPLICATION ================= */}

                <Route
                    path="/*"
                    element={<AppRoutes />}
                />

            </Routes>

        </Router>
    )
}

export default App