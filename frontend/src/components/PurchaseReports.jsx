import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import './PurchaseReport.css';

const PurchaseReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState([]);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('/api/purchases/report', {
        params: { startDate, endDate },
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Purchase Report', 20, 10);
    doc.text(`From: ${startDate} To: ${endDate}`, 20, 20);
    let y = 30;
    reportData.forEach((item) => {
      doc.text(
        `Product: ${item.productName}, Quantity: ${item.totalQuantity}, Total: ${item.totalPrice}`,
        20,
        y
      );
      y += 10;
    });
    doc.save(`purchase_report_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className="purchase-report-container">
      <h2>Purchase Report</h2>
      <form onSubmit={handleGenerateReport} className="report-form">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button type="submit">Generate Report</button>
      </form>

      {reportData.length > 0 && (
        <div className="report-results">
          <table className="report-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Total Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {report
::contentReference[oaicite:18]{index=18}
 
