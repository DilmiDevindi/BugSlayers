import React from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBell, FaEllipsisH } from 'react-icons/fa';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const kpiCards = [
  {
    title: 'Gross Sales',
    value: '$22,892',
    trend: '26%',
    trendValue: '+1.42k today',
    trendUp: true,
  },
  {
    title: 'Average Sales',
    value: '$8,283',
    trend: '23%',
    trendValue: '+0.34k today',
    trendUp: true,
  },
  {
    title: 'New Sales',
    value: '$1,853',
    trend: '2.4%',
    trendValue: '+0.45 today',
    trendUp: false,
  },
  {
    title: 'Gross Profits',
    value: '$5,239',
    trend: '14.4%',
    trendValue: '+0.5k today',
    trendUp: true,
  },
];

const revenueVsCostsData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [5000, 5500, 7000, 6500, 6300, 7000, 8500, 9200, 6300, 9500, 10500, 10800],
      backgroundColor: '#71c7ec',
    },
    {
      label: 'Costs',
      data: [3200, 4100, 4500, 4700, 2900, 4300, 5800, 5600, 3300, 4800, 4700, 5000],
      backgroundColor: '#573e85',
    },
  ],
};

const donutData = {
  labels: ['Today', 'Max'],
  datasets: [
    {
      data: [274, 2300],
      backgroundColor: ['#573e85', '#71c7ec'],
      cutout: '70%',
      borderWidth: 0,
    },
  ],
};

const topProducts = [
  {
    name: 'Watch Nike Series 7',
    supplier: 'Samuel Suárez',
    stock: 775,
    sales: 4858,
    batchTracked: '343454',
    icon: '⌚',
  },
  {
    name: 'Iphone 15',
    supplier: 'Donald Kim',
    stock: 888,
    sales: 1334,
    batchTracked: '5098923',
    icon: '📱',
  },
  {
    name: 'Iphone 15 Plus',
    supplier: 'Abdullah Khan',
    stock: 466,
    sales: 7127,
    batchTracked: '3245672',
    icon: '📱',
  },
  {
    name: 'Watch Nike Series 9',
    supplier: 'Maria Moore',
    stock: 722,
    sales: 2126,
    batchTracked: '3256477',
    icon: '⌚',
  },
];

const revenueVsCostsSmallData = {
  labels: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  datasets: [
    {
      label: 'Revenue',
      data: [30, 60, 40, 35, 50, 45, 55, 38, 42, 48],
      backgroundColor: '#573e85',
    },
    {
      label: 'Costs',
      data: [20, 40, 35, 28, 42, 40, 60, 32, 38, 44],
      backgroundColor: '#71c7ec',
    },
  ],
};

function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fefefe' }}>
      {/* Main content only */}
      <main className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div style={{ flex: 1 }}>
            <input
              type="search"
              placeholder="Search..."
              className="form-control"
              style={{ maxWidth: '300px' }}
            />
          </div>
          <div className="d-flex align-items-center gap-3" style={{ flexShrink: 0 }}>
            <FaBell style={{ fontSize: '1.2rem', cursor: 'pointer' }} />
            <img
              src="https://randomuser.me/api/portraits/men/33.jpg"
              alt="User"
              style={{ width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}
            />
            <span style={{ cursor: 'pointer', fontWeight: '600' }}>Dibbendo</span>
          </div>
        </div>

        {/* Greeting */}
        <h4>Morning, Dibbendo!</h4>
        <p className="text-muted mb-4">Here’s what’s happening with your store today.</p>

        {/* KPI Cards */}
        <div className="d-flex justify-content-between gap-4 mb-4 flex-wrap">
          {kpiCards.map(({ title, value, trend, trendValue, trendUp }) => (
            <div
              key={title}
              className="border rounded p-3"
              style={{ flex: 1, minWidth: '160px', backgroundColor: '#fff' }}
            >
              <small className="text-muted">{title}</small>
              <h3 style={{ fontWeight: '700' }}>{value}</h3>
              <div className="d-flex align-items-center gap-2">
                <span style={{ color: trendUp ? '#00a86b' : '#de1a1a', fontWeight: '700' }}>
                  {trendUp ? '↗' : '↘'} {trend}
                </span>
                <small className="text-muted">{trendValue}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Graphs */}
        <div className="d-flex gap-4 mb-4 flex-wrap">
          <div className="flex-grow-1 border rounded p-3" style={{ minWidth: '400px' }}>
            <h6>Revenue vs Costs</h6>
            <Bar
              data={revenueVsCostsData}
              options={{
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true, max: 15000 } },
              }}
            />
            <div className="d-flex justify-content-between mt-2 px-2 text-muted" style={{ fontSize: 12 }}>
              {revenueVsCostsData.labels.map((label, idx) => (
                <span key={idx}>{label} {Math.floor(Math.random() * 50)}%</span>
              ))}
            </div>
          </div>

          <div
            className="border rounded p-3 d-flex flex-column align-items-center justify-content-center"
            style={{ minWidth: '200px', maxWidth: '250px' }}
          >
            <h6>Unit Solds</h6>
            <Doughnut data={donutData} />
            <div className="d-flex gap-3 mt-2" style={{ fontSize: '14px' }}>
              <div>
                <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: '#573e85', borderRadius: '3px', marginRight: '5px' }}></span>
                Today 274
              </div>
              <div>
                <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: '#71c7ec', borderRadius: '3px', marginRight: '5px' }}></span>
                Max 2300
              </div>
            </div>
          </div>
        </div>

        {/* Table and Small Chart */}
        <div className="d-flex gap-4 flex-wrap">
          <div className="border rounded p-3 flex-grow-1" style={{ minWidth: '450px', backgroundColor: 'white' }}>
            <h6>Top Products</h6>
            <table className="table table-hover" style={{ fontSize: '14px' }}>
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Product name</th>
                  <th>Supplier</th>
                  <th>Stock</th>
                  <th>Sales</th>
                  <th>Batch tracked</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((item, idx) => (
                  <tr key={idx}>
                    <td><input type="checkbox" /></td>
                    <td><span style={{ marginRight: 8 }}>{item.icon}</span><strong>{item.name}</strong></td>
                    <td>{item.supplier}</td>
                    <td>{item.stock}</td>
                    <td>{item.sales}</td>
                    <td>{item.batchTracked}</td>
                    <td><FaEllipsisH style={{ cursor: 'pointer' }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border rounded p-3" style={{ minWidth: '300px', maxWidth: '350px', backgroundColor: 'white' }}>
            <h6>Revenue vs Costs</h6>
            <Bar
              data={revenueVsCostsSmallData}
              options={{
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}k`,
                    },
                  },
                },
                scales: { y: { beginAtZero: true, max: 80 } },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
