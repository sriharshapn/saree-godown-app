import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { IndianRupee, Package, ShoppingBag, TrendingUp } from 'lucide-react';

function Dashboard({ sarees }) {
  const totalSarees = sarees.length;
  const soldSarees = sarees.filter(s => s.status === 'sold');
  const availableSarees = sarees.filter(s => s.status === 'available');
  
  const totalValue = availableSarees.reduce((sum, s) => sum + s.rate, 0);
  const revenue = soldSarees.reduce((sum, s) => sum + s.rate, 0);

  const pieData = [
    { name: 'Available', value: availableSarees.length, color: '#D4AF37' },
    { name: 'Sold', value: soldSarees.length, color: '#2E8B57' }
  ];

  const addedByDate = sarees.reduce((acc, saree) => {
    const date = new Date(saree.dateAdded).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(addedByDate).map(key => ({
    date: key,
    count: addedByDate[key]
  })).slice(-7);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Analytics Dashboard</h2>
        <p style={{ color: 'var(--text-muted)' }}>Overview of your inventory and sales</p>
      </div>

      <div className="grid-stats" style={{ marginBottom: '2rem' }}>
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Inventory</span>
            <Package size={20} color="var(--primary-gold)" />
          </div>
          <h3 style={{ fontSize: '2rem' }}>{totalSarees}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Total unique items</p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Available Value</span>
            <IndianRupee size={20} color="#4169E1" />
          </div>
          <h3 style={{ fontSize: '2rem' }}>₹{totalValue.toLocaleString('en-IN')}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Expected revenue</p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Sold</span>
            <ShoppingBag size={20} color="#2E8B57" />
          </div>
          <h3 style={{ fontSize: '2rem' }}>{soldSarees.length}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Items sold</p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Revenue</span>
            <TrendingUp size={20} color="#D4AF37" />
          </div>
          <h3 style={{ fontSize: '2rem' }}>₹{revenue.toLocaleString('en-IN')}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Earned so far</p>
        </div>
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
        <div className="glass-card" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 500 }}>Inventory Status</h3>
          {totalSarees > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No data available
            </div>
          )}
          <div className="flex-between" style={{ padding: '0 2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', background: '#D4AF37', borderRadius: '50%' }}></div> Available ({availableSarees.length})</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '12px', height: '12px', background: '#2E8B57', borderRadius: '50%' }}></div> Sold ({soldSarees.length})</div>
          </div>
        </div>

        <div className="glass-card" style={{ height: '400px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 500 }}>Recent Additions</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} />
                <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--glass-border)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--primary-gold)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="count" fill="var(--primary-gold)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '80%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
