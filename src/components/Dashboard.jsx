import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { IndianRupee, Package, ShoppingBag, TrendingUp, Award, AlertCircle } from 'lucide-react';

function Dashboard({ inventory, sales }) {
  const totalModels = inventory.length;
  const totalPieces = inventory.reduce((sum, s) => sum + (s.quantity || 1), 0);
  const totalSoldPieces = inventory.reduce((sum, s) => sum + (s.soldQuantity || 0), 0);
  const totalAvailablePieces = totalPieces - totalSoldPieces;

  // Expected Value of remaining inventory (based on Selling Price)
  const totalExpectedValue = inventory.reduce((sum, s) => sum + ((s.quantity - s.soldQuantity) * (Number(s.sellingPrice) || 0)), 0);
  
  // Realized Revenue and Cost from completed sales
  const completedSales = sales.filter(s => s.status !== 'undone');
  const revenue = completedSales.reduce((sum, s) => sum + (Number(s.totalPrice) || 0), 0);
  
  // To find the cost of sold items, we look up the original item's costPrice for each sale
  const costOfSold = completedSales.reduce((sum, sale) => {
    const originalItem = inventory.find(s => s.id === sale.sareeId);
    const cp = originalItem ? (Number(originalItem.costPrice) || 0) : 0;
    return sum + (sale.quantitySold * cp);
  }, 0);

  const realizedProfit = revenue - costOfSold;
  const profitMarginPercent = revenue > 0 ? ((realizedProfit / revenue) * 100).toFixed(1) : 0;

  const pieData = [
    { name: 'Available', value: totalAvailablePieces, color: '#D4AF37' },
    { name: 'Sold', value: totalSoldPieces, color: '#2E8B57' }
  ];

  // Most and Least Sold logic
  const salesByModel = useMemo(() => {
    const map = {};
    completedSales.forEach(sale => {
      map[sale.modelName] = (map[sale.modelName] || 0) + sale.quantitySold;
    });
    // Add unsold models as 0
    inventory.forEach(item => {
      if (!map[item.modelName]) map[item.modelName] = 0;
    });
    
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [completedSales, inventory]);

  const sortedModels = [...salesByModel].sort((a, b) => b.count - a.count);
  const mostSold = sortedModels.slice(0, 3).filter(m => m.count > 0);
  const leastSold = [...sortedModels].reverse().slice(0, 3);

  const addedByDate = inventory.reduce((acc, item) => {
    const date = new Date(item.dateAdded).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
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
        <p style={{ color: 'var(--text-muted)' }}>Advanced overview of your inventory, sales, and profits.</p>
      </div>

      <div className="grid-stats" style={{ marginBottom: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Inventory</span>
            <Package size={20} color="var(--primary-gold)" />
          </div>
          <h3 style={{ fontSize: '2rem' }}>{totalPieces}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Total pieces ({totalModels} models)</p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Sold</span>
            <ShoppingBag size={20} color="#2E8B57" />
          </div>
          <h3 style={{ fontSize: '2rem' }}>{totalSoldPieces}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Pieces sold</p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Total Revenue</span>
            <IndianRupee size={20} color="#4169E1" />
          </div>
          <h3 style={{ fontSize: '2rem' }}>₹{revenue.toLocaleString('en-IN')}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Money collected</p>
        </div>

        <div className="glass-card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Realized Profit</span>
            <TrendingUp size={20} color={realizedProfit >= 0 ? '#4ade80' : '#FF6B6B'} />
          </div>
          <h3 style={{ fontSize: '2rem', color: realizedProfit >= 0 ? '#4ade80' : '#FF6B6B' }}>
            {realizedProfit >= 0 ? '+' : '-'}₹{Math.abs(realizedProfit).toLocaleString('en-IN')}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Actual profit from sales</p>
        </div>
      </div>

      <div className="grid-cards" style={{ marginBottom: '2rem' }}>
        {/* Profit Meter */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--primary-gold)" /> Profit Margin Meter
          </h3>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ position: 'relative', width: '200px', height: '100px', margin: '0 auto', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '20px solid rgba(255,255,255,0.1)', boxSizing: 'border-box', borderBottomColor: 'transparent', borderRightColor: 'transparent', transform: 'rotate(-45deg)' }}></div>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '200px', height: '200px', borderRadius: '50%', border: '20px solid #4ade80', boxSizing: 'border-box', borderBottomColor: 'transparent', borderRightColor: 'transparent', transform: `rotate(${Math.min(-45 + (profitMarginPercent * 1.8), 135)}deg)`, transition: 'transform 1s ease-out' }}></div>
            </div>
            <h2 style={{ fontSize: '2.5rem', marginTop: '-20px', color: '#4ade80' }}>{profitMarginPercent}%</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Average margin on sold items</p>
          </div>
        </div>

        {/* Most Sold Models */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} color="#D4AF37" /> Top Selling Models
          </h3>
          {mostSold.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mostSold.map((m, i) => (
                <li key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--primary-gold)', fontWeight: 'bold' }}>#{i+1}</span>
                    {m.name}
                  </span>
                  <span className="badge badge-success">{m.count} sold</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No sales data yet.</p>
          )}
        </div>

        {/* Least Sold Models */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} color="#FF6B6B" /> Slow Moving Stock
          </h3>
          {leastSold.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {leastSold.map((m, i) => (
                <li key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                  <span>{m.name}</span>
                  <span className="badge" style={{ background: 'rgba(255,107,107,0.2)', color: '#FF6B6B' }}>{m.count} sold</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>Not enough data.</p>
          )}
        </div>
      </div>

      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="glass-card" style={{ height: '350px' }}>
          <h3 style={{ marginBottom: '1.5rem', fontWeight: 500 }}>Inventory Split</h3>
          {totalPieces > 0 ? (
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
        </div>

        <div className="glass-card" style={{ height: '350px' }}>
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
