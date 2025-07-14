import { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CSVLink } from 'react-csv';
import furnitureLogo from '../assets/furniture-log.png';

const PurchaseReports = () => {
  const [purchases, setPurchases] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterOutsideStatus, setFilterOutsideStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPurchases = async () => {
    setLoading(true);
    try {
      const params = { startDate, endDate };
      if (filterOutsideStatus) {
        params.productStatus = 'Out-Side'; // send filter to backend
      }
      const response = await axios.get('/api/reports/purchases', { params });
      setPurchases(response.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.addImage(furnitureLogo, 'PNG', 10, 10, 30, 30);
    doc.setFontSize(16);
    doc.text('Out-Side Purchase Report', 50, 20);
    doc.setFontSize(10);
    doc.text(`Date Range: ${startDate || 'All'} to ${endDate || 'All'}`, 50, 27);

    autoTable(doc, {
      startY: 40,
      head: [['Code', 'Name', 'Category', 'Subcategory', 'Qty', 'Buying Price', 'Selling Price', 'Date']],
      body: purchases.map(item => [
        item.code,
        item.productName,
        item.category?.categoryName || 'N/A',
        item.subcategory?.subcategoryName || 'N/A',
        item.quantity,
        item.buyingPrice,
        item.sellingPrice,
        item.dateAdded?.slice(0, 10) || ''
      ])
    });

    doc.save('Out-Side_Purchase_Report.pdf');
  };

  const csvData = purchases.map(p => ({
    code: p.code,
    productName: p.productName,
    categoryName: p.category?.categoryName || 'N/A',
    subcategoryName: p.subcategory?.subcategoryName || 'N/A',
    quantity: p.quantity,
    buyingPrice: p.buyingPrice,
    sellingPrice: p.sellingPrice,
    dateAdded: p.dateAdded?.slice(0, 10) || ''
  }));

  const csvHeaders = [
    { label: 'Code', key: 'code' },
    { label: 'Product Name', key: 'productName' },
    { label: 'Category', key: 'categoryName' },
    { label: 'Subcategory', key: 'subcategoryName' },
    { label: 'Quantity', key: 'quantity' },
    { label: 'Buying Price', key: 'buyingPrice' },
    { label: 'Selling Price', key: 'sellingPrice' },
    { label: 'Date Added', key: 'dateAdded' }
  ];

  return (
    <div className="container mt-4">
      <h2>Out-Side Purchase Reports</h2>

      <div className="row mb-3">
        <div className="col-md-3">
          <label>Start Date:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>End Date:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-3 d-flex align-items-center">
          <input
            type="checkbox"
            id="filter-outside"
            checked={filterOutsideStatus}
            onChange={e => setFilterOutsideStatus(e.target.checked)}
          />
          <label htmlFor="filter-outside" className="ms-2">Filter by Out-Side Status</label>
        </div>
        <div className="col-md-3 d-flex align-items-end">
          <button
            className="btn btn-primary w-100"
            onClick={fetchPurchases}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {purchases.length > 0 && (
        <>
          <div className="mb-3">
            <button className="btn btn-danger me-2" onClick={generatePDF}>Export PDF</button>
            <CSVLink
              data={csvData}
              headers={csvHeaders}
              filename="Out-Side_Purchase_Report.csv"
              className="btn btn-success"
            >
              Export CSV
            </CSVLink>
          </div>

          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Qty</th>
                <th>Buying</th>
                <th>Selling</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(item => (
                <tr key={item._id}>
                  <td>{item.code}</td>
                  <td>{item.productName}</td>
                  <td>{item.category?.categoryName || 'N/A'}</td>
                  <td>{item.subcategory?.subcategoryName || 'N/A'}</td>
                  <td>{item.quantity}</td>
                  <td>{item.buyingPrice}</td>
                  <td>{item.sellingPrice}</td>
                  <td>{item.dateAdded?.slice(0, 10) || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default PurchaseReports;
