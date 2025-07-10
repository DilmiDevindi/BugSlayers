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
import { FaBell } from 'react-icons/fa';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const kpiCards = [
  { title: 'Gross Sales', value: '$22,892', trend: '26%', trendValue: '+1.42k today', trendUp: true },
  { title: 'Average Sales', value: '$8,283', trend: '23%', trendValue: '+0.34k today', trendUp: true },
  { title: 'New Sales', value: '$1,853', trend: '2.4%', trendValue: '+0.45 today', trendUp: false },
  { title: 'Gross Profits', value: '$5,239', trend: '14.4%', trendValue: '+0.5k today', trendUp: true },
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

function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9f9f9', fontSize: '14px' }}>
      <main className="p-3">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input type="search" placeholder="Search..." className="form-control" style={{ maxWidth: '240px', fontSize: '13px' }} />
          <div className="d-flex align-items-center gap-2">
            <FaBell style={{ fontSize: '16px', cursor: 'pointer' }} />
            <img src="https://randomuser.me/api/portraits/men/33.jpg" alt="User" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
            <span style={{ fontWeight: '600', fontSize: '13px' }}>Dibbendo</span>
          </div>
        </div>

        {/* Greeting */}
        <h6 style={{ marginBottom: '4px' }}>Morning, Dibbendo!</h6>
        <p className="text-muted mb-3" style={{ fontSize: '13px' }}>Here’s what’s happening with your store today.</p>

        {/* KPI Cards */}
        <div className="d-flex justify-content-between gap-3 mb-3 flex-wrap">
          {kpiCards.map(({ title, value, trend, trendValue, trendUp }) => (
            <div key={title} className="border rounded p-2" style={{ flex: 1, minWidth: '150px', backgroundColor: '#fff' }}>
              <small className="text-muted">{title}</small>
              <h5 className="mb-1" style={{ fontWeight: '700', fontSize: '16px' }}>{value}</h5>
              <div className="d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                <span style={{ color: trendUp ? '#00a86b' : '#de1a1a', fontWeight: '600' }}>
                  {trendUp ? '↗' : '↘'} {trend}
                </span>
                <small className="text-muted">{trendValue}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="d-flex gap-3 mb-3 flex-wrap">
          {/* Bar Chart */}
          <div className="border rounded p-2" style={{ flex: '1 1 62%', maxWidth: '62%', backgroundColor: '#fff' }}>
            <h6 className="mb-2" style={{ fontSize: '13px' }}>Revenue vs Costs</h6>
            <Bar
              data={revenueVsCostsData}
              options={{
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, max: 15000 } },
              }}
            />
          </div>

          {/* Half Donut Chart */}
          <div className="border rounded p-2 d-flex flex-column align-items-center justify-content-center"
            style={{ flex: '1 1 35%', maxWidth: '35%', backgroundColor: '#fff' }}>
            <h6 className="mb-2" style={{ fontSize: '13px' }}>Unit Solds</h6>
            <Doughnut
              data={donutData}
              options={{
                rotation: -90,
                circumference: 180,
                plugins: {
                  legend: { display: false },
                },
              }}
            />
            <div className="d-flex gap-2 mt-2" style={{ fontSize: '12px' }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#573e85',
                  marginRight: '5px',
                  borderRadius: '2px',
                }}></span>
                Today 274
              </div>
              <div>
                <span style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  backgroundColor: '#71c7ec',
                  marginRight: '5px',
                  borderRadius: '2px',
                }}></span>
                Max 2300
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
