"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import styles from "./UserProfile.module.css"; // Import the CSS file
import { getData } from "@/app/services/FetchNodeServices";
import { useDispatch } from "react-redux";
import { login } from "@/app/redux/slices/user-slice";

export default function UserProfile() {
    const router = useRouter();
    const [selectedSection, setSelectedSection] = useState("dashboard");
    const [user_data, setUser_data] = useState("");
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch()

    // Fetch user data from localStorage
    useEffect(() => {
        const data = localStorage.getItem("User_data");
        if (data) {
            const parsedUserData = JSON.parse(data);
            setUser_data(parsedUserData);
        }
    }, []);

    // Fetch appointments if user data is available
    useEffect(() => {
        const fetchAppointments = async () => {
            if (user_data?._id) {
                try {
                    const response = await getData(`api/consultation/get-consultation-user/${user_data?._id}`);
                    const data = await response.data;
                    console.log("Fetched Appointments:", data);

                    if (response.status === true) {
                        setAppointments(data);
                    }
                } catch (error) {
                    console.error("Error fetching appointments:", error);
                }
            }
        };

        fetchAppointments();
    }, [user_data]);

    const AccountDetails = () => {
        return (
            <div className={styles.table}>
                <h2 className={styles.tableHeader}>Account Details</h2>
                <table className={styles.tableContent}>
                    <tbody>
                        <tr className={styles.tableRow}>
                            <td className={styles.tabletd}><strong>Name:</strong></td>
                            <td className={styles.tabletd}>{user_data?.name}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td className={styles.tabletd}><strong>E-mail:</strong></td>
                            <td className={styles.tabletd}>{user_data?.email}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td className={styles.tabletd}><strong>Address:</strong></td>
                            <td className={styles.tabletd}>{user_data?.address?.addressLine1}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td className={styles.tabletd}><strong>Address 2:</strong></td>
                            <td className={styles.tabletd}>{user_data?.address?.addressLine2}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td className={styles.tabletd}><strong>Country:</strong></td>
                            <td className={styles.tabletd}>{user_data?.address?.state}, {user_data?.address?.country}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td className={styles.tabletd}><strong>Zip:</strong></td>
                            <td className={styles.tabletd}>{user_data?.address?.pinCode}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td className={styles.tabletd}><strong>Phone:</strong></td>
                            <td className={styles.tabletd}>{user_data?.phone}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    const handleLOGOUT = async () => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, log out!",
        });

        if (confirmDelete.isConfirmed) {
            try {
                localStorage.removeItem("User_data");
                localStorage.removeItem("token");
                 dispatch(login('false'));
                router?.push("/");

                Swal.fire("Logged out!", "You have been logged out.", "success");
            } catch (error) {
                Swal.fire("Error!", "There was an error logging out.", "error");
                console.error("Error logging out:", error);
            }
        }
    };

    const AppointmentDetails = () => {
        if (appointments.length === 0) {
            return (
                <div className={styles.table}>
                    <h2 className={styles.tableHeader}>Appointments</h2>
                    <p>You have no appointments.</p>
                </div>
            );
        }

        return (
            <div className={styles.table} style={{ height: '50vh', overflowY: 'scroll', overflowX: 'hidden', }}>
                <h2 className={styles.tableHeader}>Appointments</h2>
                <table className={styles.tableContent}>
                    {appointments?.map((appointment) => (
                        <div
                            style={{
                                gap: 10,
                                marginBottom: 10,
                                boxShadow: 'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                                padding: 10
                            }}
                            key={appointment._id}
                        >
                            <tbody>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tabletd}><strong>Patient Name:</strong></td>
                                    <td className={styles.tabletd}>{appointment?.patientName}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tabletd}><strong>Consultation Date:</strong></td>
                                    <td className={styles.tabletd}>{new Date(appointment?.scheduleCalendar).toLocaleDateString()}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tabletd}><strong>Schedule Time:</strong></td>
                                    <td className={styles.tabletd}>{appointment?.scheduleTime}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tabletd}><strong>Doctor:</strong></td>
                                    <td className={styles.tabletd}>{appointment?.chooseDoctor}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tabletd}><strong>Status:</strong></td>
                                    <td className={styles.tabletd}>{appointment?.status}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tabletd}><strong>Payment ID:</strong></td>
                                    <td className={styles.tabletd}>{appointment?.payment_id}</td>
                                </tr>
                                <tr className={styles.tableRow}>
                                    <td className={styles.tabletd}><strong>Amount:</strong></td>
                                    <td className={styles.tabletd}>{appointment?.amount}</td>
                                </tr>
                            </tbody>
                        </div>
                    ))}
                </table>
            </div>
        );
    };

    // Render content based on the selected section
    const renderContent = () => {
        switch (selectedSection) {
            case "dashboard":
                return AccountDetails();
            case "logout":
                handleLOGOUT();
                return null; // The logout logic is triggered, nothing to render
            case "appointment":
                return AppointmentDetails();
            default:
                return <div>Please select a section.</div>;
        }
    };

    // Handle button click for active section highlighting
    const handleSectionClick = (section) => {
        setSelectedSection(section);
    };

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.sidebar}>
                    <div
                        className={`${styles.sidebarItem} ${selectedSection === "dashboard" ? styles.active : ""}`}
                        onClick={() => handleSectionClick("dashboard")}
                    >
                        Dashboard
                    </div>
                    <div
                        className={`${styles.sidebarItem} ${selectedSection === "order" ? styles.active : ""}`}
                        onClick={() => router.push(`/Pages/trackOrder/${user_data?._id}`)}
                    >
                        Your Orders
                    </div>
                    <div
                        className={`${styles.sidebarItem} ${selectedSection === "appointment" ? styles.active : ""}`}
                        onClick={() => handleSectionClick("appointment")}
                    >
                        Your Appointments
                    </div>
                    <div
                        className={`${styles.sidebarItem} ${selectedSection === "logout" ? styles.active : ""}`}
                        onClick={() => handleSectionClick("logout")}
                    >
                        Log Out
                    </div>
                </div>
                <div className={styles.mainContent}>
                    <div className={styles.profileHeader}>
                        <h3>{user_data?.name}</h3>
                        <p>{user_data?.email}</p>
                    </div>
                    <div style={{ width: '100%' }}>{renderContent()}</div>
                </div>
            </div>
        </div>
    );
}
