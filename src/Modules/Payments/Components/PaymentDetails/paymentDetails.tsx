"use client";
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_PAYMENTS } from '../../Services/mutations';
import styles from './payment.module.css';

interface Payment {
  id: string,
  bookingid: string,
  amountpaid: string,
  status: string,
  createdat: string,
}

function PaymentList() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_PAYMENTS);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatDate = (timestamp: string) => {
    const timeValue = parseInt(timestamp);
    if (isNaN(timeValue) || timeValue <= 0) {
      return 'Invalid date';
    }
    const date = new Date(timeValue);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching payments: {error.message}</p>;

  return (
    <div className={styles.container}>
      <h1>Transactions</h1>
      <table className={styles.bookingsTable}>
        <thead>
          <tr>
            <th>Sl. no</th>
            <th>Date</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {data?.getAllPayments.map((payment: Payment, index: number) => (
            <React.Fragment key={payment.id}>
              <tr
                className={styles.tableRow}
                onClick={() => toggleRow(payment.id)}
              >
                <td>{index + 1}</td>
                <td>{formatDate(payment.createdat)}</td>
                <td>&#8377; {payment.amountpaid}</td>
              </tr>

              {expandedRow === payment.id && (
                <tr className={styles.expandedRow}>
                  <td colSpan={3}> {/* Set to 3 to match table header columns */}
                    <div className={styles.expandedContent}>
                      <p><strong>Booking Id:</strong> {payment.bookingid}</p>
                      <p><strong>Amount:</strong> &#8377; {payment.amountpaid}</p> {/* Fixed to display amount */}
                      <p><strong>Payment Status:</strong>
                        <span className={styles.paymentstatus}>
                          {payment.status}
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

export default PaymentList;
