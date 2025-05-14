import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import myImage from '../assets/furniture-log.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faCalendarDays, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './SalesReports.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const SalesReport = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      alert('Please select a date.');
      return;
    }
    setLoading(true);
    setSubmitted(true);
    try {
      const response = await axios.get('http://localhost:5000/api/daily-reports/daily-sales-report', {
        params: { date: selectedDate },
      });
      setReport(response.data.length > 0 ? response.data : []);
    } catch (error) {
      console.error('Error generating report:', error);
      setReport([]);
    }
    setLoading(false);
  };

  const totalQuantity = report.reduce((sum, item) => sum + item.totalQuantity, 0);
  const totalSales = report.reduce((sum, item) => sum + item.totalSales, 0);
  const mostPopularItem = report.reduce((maxItem, item) =>
    item.totalQuantity > (maxItem?.totalQuantity || 0) ? item : maxItem, null
  );

  const chartData = {
    labels: report.map(item => item.productName),
    datasets: [{
      data: report.map(item => item.totalSales),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#FF9800', '#9C27B0'],
      datalabels: {
        color: '#fff',
        font: { weight: 'bold' },
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          return `${label}: $${value.toFixed(2)}`;
        }
      }
    }]
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.addImage(myImage, 'PNG', 10, 10, 40, 40);
    doc.setFontSize(18);
    doc.text('Daily Sales Report', 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Date: ${selectedDate}`, 105, 30, null, null, 'center');
    doc.text('Furniture Management System', 105, 38, null, null, 'center');
    let y = 60;
    report.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.productName} - Qty: ${item.totalQuantity} - $${item.totalSales.toFixed(2)}`, 10, y);
      y += 10;
    });
    doc.text(`Total Quantity: ${totalQuantity}`, 10, y + 10);
    doc.text(`Total Sales: $${totalSales.toFixed(2)}`, 10, y + 20);
    if (mostPopularItem) {
      doc.text(`Most Popular Item: ${mostPopularItem.productName}`, 10, y + 30);
    }
    doc.save('daily_sales_report.pdf');
  };

  return (
    <div className="report-container">
      <h2><FontAwesomeIcon icon={faChartBar} /> Daily Sales Report</h2>
      <form onSubmit={handleSubmit} className="date-form">
        <label><FontAwesomeIcon icon={faCalendarDays} /> Select Date:</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
        <button type="submit">Generate Report</button>
      </form>

      {loading && <p>Loading...</p>}
      {submitted && !loading && report.length === 0 && <p>No sales data available for this date.</p>}

      {report.length > 0 && (
        <div className="report-details">
          <h3>Summary</h3>
          <p>Total Quantity Sold: {totalQuantity}</p>
          <p>Total Sales: ${totalSales.toFixed(2)}</p>
          {mostPopularItem && <p>Most Popular Item: {mostPopularItem.productName}</p>}

          <h3>Sales Chart</h3>
          <div className="chart-container">
            <Pie data={chartData} />
          </div>

          <button onClick={generatePDF}>
            <FontAwesomeIcon icon={faFilePdf} /> Download PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default SalesReport;
