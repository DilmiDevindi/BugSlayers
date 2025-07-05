import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faCalendarDays, faChartBar, faDownload } from "@fortawesome/free-solid-svg-icons";

const OrderReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("/api/order-report", {
        params: { startDate, endDate },
      });
      setReportData(response.data);
    } catch (error) {
      console.error("Error generating order report:", error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Order Report", 20, 10);
    doc.text(`From: ${startDate} To: ${endDate}`, 20, 20);
    let y = 30;
    reportData.forEach((item) => {
      doc.text(
        `Order ID: ${item.orderId}, Qty: ${item.quantity}, Discount: ${item.discount}, Date: ${item.date}`,
        20,
        y
      );
      y += 10;
    });
    doc.save(`order_report_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className="container mt-4">
      <h2>Order Report</h2>
      <form onSubmit={handleGenerateReport} className="mb-4">
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="startDate">
              <FontAwesomeIcon icon={faCalendarDays} className="me-2" />
              Start Date
            </label>
            <input
              type="date"
              className="form-control"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="endDate">
              <FontAwesomeIcon icon={faCalendarDays} className="me-2" />
              End Date
            </label>
            <input
              type="date"
              className="form-control"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3 w-100">
          <FontAwesomeIcon icon={faChartBar} className="me-2" />
          Generate Report
        </button>
      </form>

      {reportData.length > 0 && (
        <div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Quantity</th>
                <th>Discount (%)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((order, index) => (
                <tr key={index}>
                  <td>{order.orderId}</td>
                  <td>{order.quantity}</td>
                  <td>{order.discount}</td>
                  <td>{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleDownloadPDF} className="btn btn-success mt-2">
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderReport;
