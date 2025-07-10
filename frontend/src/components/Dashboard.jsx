import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaBell, FaBars, FaEllipsisH } from 'react-icons/fa';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

const sidebarItems = [
  { name: 'Dashboard', icon: <FaBars />, active: true },
  { name: 'Inventory', icon: <FaBars />, active: false },
  { name: 'Analytics', icon: <FaBars />, active: false },
  { name: 'Sales Orders', icon: <FaBars />, active: false },
  { name: 'B2B ecommerce', icon: <FaBars />, active: false },
  { name: 'Products', icon: <FaBars />, active: false },
  { name: 'Customers', icon: <FaBars />, active: false },
  { name: 'Browse Apps', icon: <FaBars />, active: false },
];

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
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#D2CBDA' }}>
      {/* Sidebar */}
      <nav
        className="d-flex flex-column p-3"
        style={{ width: '230px', backgroundColor: 'white', fontWeight: '600' }}
      >
        <h3 className="mb-4" style={{ fontWeight: '700' }}>
          <span
            style={{
              backgroundColor: '#573e85',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '1.5rem',
              marginRight: '8px',
            }}
          >
            P
          </span>
          Propay
        </h3>
        {sidebarItems.map(({ name, icon, active }) => (
          <div
            key={name}
            className={`d-flex align-items-center mb-3 p-2 rounded ${active ? 'bg-light' : ''}`}
            style={{ cursor: 'pointer', color: active ? '#573e85' : '#555' }}
          >
            <span style={{ marginRight: '10px' }}>{icon}</span>
            <span>{name}</span>
          </div>
        ))}
        <div className="mt-auto pt-3" style={{ color: '#777' }}>
          <FaBars style={{ marginRight: '6px' }} />
          Settings
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow-1 p-4" style={{ backgroundColor: '#fefefe' }}>
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

        {/* KPIs */}
        <div className="d-flex justify-content-between gap-4 mb-4">
          {kpiCards.map(({ title, value, trend, trendValue, trendUp }) => (
            <div
              key={title}
              className="border rounded p-3"
              style={{ flex: 1, minWidth: '160px', backgroundColor: '#fff' }}
            >
              <small className="text-muted">{title}</small>
              <h3 style={{ fontWeight: '700' }}>{value}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: trendUp ? '#00a86b' : '#de1a1a', fontWeight: '700' }}>
                  {trendUp ? '↗' : '↘'} {trend}
                </span>
                <small className="text-muted">{trendValue}</small>
              </div>
            </div>
          ))}
        </div>

        {/* Graphs row */}
        <div className="d-flex gap-4 mb-4 flex-wrap">
          {/* Revenue vs Costs big */}
          <div className="flex-grow-1 border rounded p-3" style={{ minWidth: '400px' }}>
            <h6>Revenue vs Costs</h6>
            <Bar
              data={revenueVsCostsData}
              options={{
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: { beginAtZero: true, max: 15000 },
                },
              }}
            />
            <div className="d-flex justify-content-between mt-2 px-2 text-muted" style={{ fontSize: 12 }}>
              <span>Jan 45%</span>
              <span>Feb 32%</span>
              <span>Mar 49%</span>
              <span>Apr 47%</span>
              <span>May 16%</span>
              <span>Jun 35%</span>
              <span>Jul 40%</span>
              <span>Aug 32%</span>
              <span>Sep 18%</span>
              <span>Oct 47%</span>
              <span>Nov 46%</span>
              <span>Dec 3%</span>
            </div>
          </div>

          {/* Donut chart */}
          <div
            className="border rounded p-3 d-flex flex-column align-items-center justify-content-center"
            style={{ minWidth: '200px', maxWidth: '250px' }}
          >
            <h6>Unit Solds</h6>
            <Doughnut data={donutData} />
            <div className="d-flex gap-3 mt-2" style={{ fontSize: '14px' }}>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    backgroundColor: '#573e85',
                    borderRadius: '3px',
                    marginRight: '5px',
                  }}
                ></span>
                Today 274
              </div>
              <div>
                <span
                  style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    backgroundColor: '#71c7ec',
                    borderRadius: '3px',
                    marginRight: '5px',
                  }}
                ></span>
                Max 2300
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row with table and small bar chart */}
        <div className="d-flex gap-4 flex-wrap">
          {/* Top products table */}
          <div
            className="border rounded p-3 flex-grow-1"
            style={{ minWidth: '450px', backgroundColor: 'white' }}
          >
            <h6>Top Products</h6>
            <table className="table table-hover" style={{ fontSize: '14px' }}>
              <thead>
                <tr>
                  <th scope="col">
                    <input type="checkbox" />
                  </th>
                  <th scope="col">Product name</th>
                  <th scope="col">Supplier</th>
                  <th scope="col">Stock</th>
                  <th scope="col">Sales</th>
                  <th scope="col">Batch tracked</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(({ name, supplier, stock, sales, batchTracked, icon }, idx) => (
                  <tr key={idx}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '24px',
                          marginRight: '8px',
                          verticalAlign: 'middle',
                        }}
                      >
                        {icon}
                      </span>
                      <strong>{name}</strong>
                    </td>
                    <td>{supplier}</td>
                    <td>{stock}</td>
                    <td>{sales}</td>
                    <td>{batchTracked}</td>
                    <td>
                      <FaEllipsisH style={{ cursor: 'pointer' }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Revenue vs Costs small */}
          <div
            className="border rounded p-3"
            style={{ minWidth: '300px', maxWidth: '350px', backgroundColor: 'white' }}
          >
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
                scales: {
                  y: { beginAtZero: true, max: 80 },
                },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
