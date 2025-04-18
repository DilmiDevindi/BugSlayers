import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faCalendarDays, faChartBar } from '@fortawesome/free-solid-svg-icons';

const SalesReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(startDate) > new Date(endDate)) {
      alert('Start date cannot be after end date.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/reports/sales-report', {
        params: { startDate, endDate },
      });
      setReport(response.data);
    } catch (error) {
      console.error('Error generating report:', error);
    }
    setLoading(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Report', 14, 16);
    doc.text(`From: ${startDate} To: ${endDate}`, 14, 23);

    const tableColumn = ['Product Name', 'Total Quantity', 'Total Sales'];
    const tableRows = [];

    report.forEach(item => {
      const row = [item._id, item.totalQuantity, item.totalSales];
      tableRows.push(row);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 30 });
    doc.save(`sales_report_${startDate}_to_${endDate}.pdf`);
  };

  const totalQuantity = report.reduce((sum, item) => sum + item.totalQuantity, 0);
  const totalSales = report.reduce((sum, item) => sum + item.totalSales, 0);

  return (
    <div className="container mt-4">
      <h3><FontAwesomeIcon icon={faChartBar} className="me-2 text-primary" />Generate Sales Report</h3>

      <form onSubmit={handleSubmit} className="border p-3 rounded mb-4 shadow-sm">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="startDate" className="form-label">
              <FontAwesomeIcon icon={faCalendarDays} className="me-1" />Start Date
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
          <div className="col-md-6 mb-3">
            <label htmlFor="endDate" className="form-label">
              <FontAwesomeIcon icon={faCalendarDays} className="me-1" />End Date
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
        <button type="submit" className="btn btn-primary w-100">
          <FontAwesomeIcon icon={faChartBar} className="me-2" />Generate Report
        </button>
      </form>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : report.length > 0 ? (
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Report Results</h5>
            <button className="btn btn-success" onClick={downloadPDF}>
              <FontAwesomeIcon icon={faFilePdf} className="me-2" />Download PDF
            </button>
          </div>

          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Product Name</th>
                <th>Total Quantity</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              {report.map((item, index) => (
                <tr key={index}>
                  <td>{item._id}</td>
                  <td>{item.totalQuantity}</td>
                  <td>Rs. {item.totalSales.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3">
            <strong>Total Quantity Sold:</strong> {totalQuantity} <br />
            <strong>Total Sales:</strong> Rs. {totalSales.toFixed(2)}
          </div>
        </div>
      ) : (
        startDate && endDate && (
          <div className="alert alert-info mt-4">
            No data available for the selected date range.
          </div>
        )
      )}
    </div>
  );
};

export default SalesReport;
