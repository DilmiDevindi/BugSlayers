import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faCalendarDays, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

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
    
  const viewReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Sales Report', 14, 16);
    doc.setFontSize(11);
    doc.text(`From: ${startDate} To: ${endDate}`, 14, 24);
  
    // Table headers
    let y = 35;
    doc.setFont(undefined, 'bold');
    doc.text('Product Name', 14, y);
    doc.text('Total Quantity', 90, y);
    doc.text('Total Sales (Rs.)', 150, y);
    doc.setFont(undefined, 'normal');
    y += 8;
  
    // Table rows
    report.forEach((item) => {
      doc.text(item._id, 14, y);
      doc.text(item.totalQuantity.toString(), 90, y);
      doc.text(item.totalSales.toFixed(2).toString(), 150, y);
      y += 8;
  
      // Add new page if content goes below page height
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
  
    // Totals
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text(`Total Quantity: ${totalQuantity}`, 14, y);
    y += 8;
    doc.text(`Total Sales: Rs. ${totalSales.toFixed(2)}`, 14, y);
  
    // Open PDF in browser instead of downloading
    const pdfData = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfData);
    window.open(pdfUrl, '_blank');
  };
  
  
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Sales Report', 14, 16);
    doc.setFontSize(11);
    doc.text(`From: ${startDate} To: ${endDate}`, 14, 24);

    // Table headers
    let y = 35;
    doc.setFont(undefined, 'bold');
    doc.text('Product Name', 14, y);
    doc.text('Total Quantity', 90, y);
    doc.text('Total Sales (Rs.)', 150, y);
    doc.setFont(undefined, 'normal');
    y += 8;

    // Table rows
    report.forEach((item) => {
      doc.text(item._id, 14, y);
      doc.text(item.totalQuantity.toString(), 90, y);
      doc.text(item.totalSales.toFixed(2).toString(), 150, y);
      y += 8;

      // Add new page if content goes below page height
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    // Totals
    y += 10;
    doc.setFont(undefined, 'bold');
    doc.text(`Total Quantity: ${totalQuantity}`, 14, y);
    y += 8;
    doc.text(`Total Sales: Rs. ${totalSales.toFixed(2)}`, 14, y);

    doc.save(`sales_report_${startDate}_to_${endDate}.pdf`);
  };

  const totalQuantity = report.reduce((sum, item) => sum + item.totalQuantity, 0);
  const totalSales = report.reduce((sum, item) => sum + item.totalSales, 0);

  const pieData = {
    labels: report.map((item) => item._id),
    datasets: [
      {
        label: 'Total Sales',
        data: report.map((item) => item.totalSales),
        backgroundColor: [
          '#4e73df',
          '#1cc88a',
          '#36b9cc',
          '#f6c23e',
          '#e74a3b',
          '#858796',
          '#5a5c69',
          '#2e59d9',
          '#17a673',
          '#2c9faf'
        ],
        borderWidth: 1,
      },
    ],
  };

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
            <button className="btn btn-primary" onClick={viewReport}>
            <FontAwesomeIcon icon={faFilePdf} className="me-2" />View Report
            </button>
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

          <div className="mt-4">
            <h5 className="mb-3">Sales Distribution (Pie Chart)</h5>
            <div style={{ maxWidth: '400px', margin: '0 auto' }}>
              <Pie data={pieData} width={400} height={300} />
            </div>
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
