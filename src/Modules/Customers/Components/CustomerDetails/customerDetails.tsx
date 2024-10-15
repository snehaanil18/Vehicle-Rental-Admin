"use client";
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_BOOKINGS_QUERY } from '../../Services/mutations';
import styles from './customer.module.css';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

interface Booking {
    id: string,
    vehiclename: string,
    pickupdate: string,
    dropoffdate: string,
    totalamount: string,
    username: string,
    paymentstatus: string,
}

function CustomerDetails() {
    const { data, loading, error, refetch } = useQuery(GET_ALL_BOOKINGS_QUERY);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const formatDate = (timestamp: string) => {
        const date = new Date(parseInt(timestamp));
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    const generatePDF = (bookings: Booking[]) => {
        const doc = new jsPDF();
      
        // Add title
        doc.setFontSize(20);
        doc.text("Booking Details", 20, 20);
      
        // Add booking details
        doc.setFontSize(12);
        let y = 30; // Starting Y position
        const pageHeight = doc.internal.pageSize.height; // Get the page height
    
        bookings.forEach((booking) => {
            const details = `
                Vehicle Name: ${booking.vehiclename}
                Username: ${booking.username}
                Pick-up Date: ${formatDate(booking.pickupdate)}
                Drop-off Date: ${formatDate(booking.dropoffdate)}
                Total Amount: Rs ${booking.totalamount}
                Payment Status: ${booking.paymentstatus}
            `;
    
            const detailLines = doc.splitTextToSize(details, 180); // Split text to fit page width
            const lineHeight = 7; // Height of each line
    
            detailLines.forEach((line) => {
                // Check if the next line would exceed the page height
                if (y + lineHeight > pageHeight) {
                    doc.addPage(); // Add a new page
                    y = 10; // Reset Y position for the new page
                }
                doc.text(line, 20, y); // Draw the line
                y += lineHeight; // Increment Y position for the next line
            });
    
           
        });
      
        // Save the PDF
        doc.save('booking-details.pdf');
    }

    const exportToExcel = (bookings: Booking[]) => {
        const worksheet = XLSX.utils.json_to_sheet(bookings.map((booking) => ({
            "Vehicle Name": booking.vehiclename,
            "Username": booking.username,
            "Pick-up Date": formatDate(booking.pickupdate),
            "Drop-off Date": formatDate(booking.dropoffdate),
            "Total Amount": `₹${booking.totalamount}`,
            "Payment Status": booking.paymentstatus,
        })));

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

        // Generate Excel file and trigger download
        XLSX.writeFile(workbook, 'booking-details.xlsx');
    };

    const handleExport = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOption = event.target.value;
        if (selectedOption === 'pdf') {
            if (data?.getAllBookings) {
                generatePDF(data.getAllBookings); 
            }
        } else if (selectedOption === 'excel') {
            exportToExcel(data?.getAllBookings);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error fetching bookings: {error.message}</p>;

    const toggleRow = (id: string) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>All Bookings</h1>
                <select onChange={handleExport} defaultValue="">
                    <option value="" disabled>
                        Export
                    </option>
                    <option value="pdf">Export as PDF</option>
                    <option value="excel">Export as Excel</option>
                </select>
            </div>


            <table className={styles.bookingsTable}>
                <thead>
                    <tr>
                        <th>Sl. no</th>
                        <th>Vehicle Name</th>
                        <th>Pick-up Date</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.getAllBookings.map((booking: Booking, index: number) => (
                        <React.Fragment key={booking.id}>
                            {/* Main Row */}
                            <tr
                                key={booking.id}
                                className={styles.tableRow}
                                onClick={() => toggleRow(booking.id)}
                            >
                                <td>{index + 1}</td>
                                <td>{booking.vehiclename}</td>
                                <td>{formatDate(booking.pickupdate)}</td>
                                <td className={styles.view}>view</td>
                            </tr>

                            {/* Expanded Row */}
                            {expandedRow === booking.id && (
                                <tr className={styles.expandedRow}>
                                    <td colSpan={4}>
                                        <div className={styles.expandedContent}>
                                            <p><strong>Client:</strong> {booking.username}</p>
                                            <p><strong>Drop-off Date:</strong> {formatDate(booking.dropoffdate)}</p>
                                            <p><strong>Total Amount:</strong>  &#8377;{booking.totalamount}</p>
                                            <p><strong>Payment Status:</strong>
                                                <span className={`${styles.paymentstatus} ${styles[booking.paymentstatus.toLowerCase()]}`}>
                                                    {booking.paymentstatus}
                                                </span>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default CustomerDetails;
