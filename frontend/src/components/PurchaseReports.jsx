import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./PurchaseReport.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faCalendarDays, faChartBar } from "@fortawesome/free-solid-svg-icons";

const PurchaseReport = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    axios.get("/api/category").then((res) => setCategories(res.data));
    axios.get("/api/subcategories").then((res) => setSubcategories(res.data));
  }, []);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat?.categoryName || "-";
  };

  const getSubcategoryName = (id) => {
    const sub = subcategories.find((s) => s._id === id);
    return sub?.subcategoryName || "-";
  };

  const calculateTotal = (purchase) => {
    const qty = Number(purchase.quantity) || 0;
    const price = Number(purchase.price) || 0;
    const discount = Number(purchase.discount?.replace("%", "")) || 0;
    const subtotal = qty * price;
    const discountAmount = (subtotal * discount) / 100;
    return Math.max(0, subtotal - discountAmount);
  };

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert("Please select start and end dates.");
      return;
    }

    try {
      const res = await axios.get("/api/purchase", {
        params: { startDate, endDate },
      });

      const filtered = res.data.filter((item) => {
        const date = new Date(item.date);
        return date >= new Date(startDate) && date <= new Date(endDate);
      });

      setReportData(filtered);
    } catch (err) {
      console.error("Error fetching report data:", err);
      alert("Failed to load report data.");
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Purchase Report", 14, 15);
    doc.setFontSize(11);
    doc.text(`From: ${startDate} To: ${endDate}`, 14, 22);

    const tableData = reportData.map((item) => [
      item.supplier,
      item.product,
      getCategoryName(item.category),
      getSubcategoryName(item.subcategory),
      item.quantity,
      Number(item.price).toFixed(2),
      item.discount || "-",
      calculateTotal(item).toFixed(2),
      new Date(item.date).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [["Supplier", "Product", "Category", "Subcategory", "Qty", "Price", "Discount", "Total", "Date"]],
      body: tableData,
      startY: 28,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    doc.save(`purchase_report_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className="purchase-report-container">
      <h2 className="mb-4">Purchase Report</h2>

      <form onSubmit={handleGenerateReport} className="report-form mb-4">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="startDate">
              <FontAwesomeIcon icon={faCalendarDays} className="me-2" />
              Start Date
            </label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="endDate">
              <FontAwesomeIcon icon={faCalendarDays} className="me-2" />
              End Date
            </label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          <FontAwesomeIcon icon={faChartBar} className="me-2" />
          Generate Report
        </button>
      </form>

      {reportData.length > 0 && (
        <>
          <div className="report-results table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Subcategory</th>
                  <th>Quantity</th>
                  <th>Price (Rs.)</th>
                  <th>Discount</th>
                  <th>Total Purchase (Rs.)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, idx) => (
                  <tr key={item._id || idx}>
                    <td>{item.supplier}</td>
                    <td>{item.product}</td>
                    <td>{getCategoryName(item.category)}</td>
                    <td>{getSubcategoryName(item.subcategory)}</td>
                    <td>{item.quantity}</td>
                    <td>{Number(item.price).toFixed(2)}</td>
                    <td>{item.discount || "-"}</td>
                    <td>{calculateTotal(item).toFixed(2)}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-end">
            <button className="btn btn-success mt-3" onClick={handleDownloadPDF}>
              <FontAwesomeIcon icon={faFilePdf} className="me-2" />
              Download PDF
            </button>
          </div>
        </>
      )}

      {reportData.length === 0 && (
        <div className="alert alert-info mt-4">No purchases found in selected range.</div>
      )}
    </div>
  );
};

export default PurchaseReport;
