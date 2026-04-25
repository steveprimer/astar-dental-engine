"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from 'recharts';
import { Activity, TrendingUp, AlertCircle, ShieldCheck } from 'lucide-react';

export default function DentalRoiCalculator() {
  const [adSpend, setAdSpend] = useState(100000);
  
  // Fixed Constants based on AStar CodeX Math
  const AVG_PATIENT_VALUE = 400000; 
  
  // AStar CodeX Projections 
  const aStarClosesRaw = (adSpend / 100000) * 1.8;
  const aStarRevenue = aStarClosesRaw * AVG_PATIENT_VALUE;
  const aStarRoas = (aStarRevenue / adSpend).toFixed(1);
  
  // Psychological Fix: Convert raw decimals to a realistic human range
  const minPatients = Math.floor(aStarClosesRaw);
  const maxPatients = Math.ceil(aStarClosesRaw);
  const patientText = minPatients === maxPatients ? `${minPatients}` : `${minPatients} to ${maxPatients}`;
  
  // Generic Agency Projections 
  const genericClosesRaw = (adSpend / 100000) * 1;
  const genericRevenue = genericClosesRaw * AVG_PATIENT_VALUE;

  const additionalRevenue = aStarRevenue - genericRevenue;

  const chartData = [
    {
      name: 'Generic Agency',
      Revenue: genericRevenue,
      color: '#94a3b8' 
    },
    {
      name: 'AStar CodeX',
      Revenue: aStarRevenue,
      color: '#059669' // Premium Emerald
    }
  ];

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Custom Tick optimized for smaller screens (iPad/Mobile)
  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const isGeneric = payload.value === 'Generic Agency';
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#475569" fontSize={12} fontWeight={600} className="sm:text-sm">
          {payload.value}
        </text>
        <text x={0} y={0} dy={32} textAnchor="middle" fill={isGeneric ? '#ef4444' : '#059669'} fontSize={10} fontWeight={700}>
          {isGeneric ? '(15-Min Lead Death)' : '(3-Sec API Intercept)'}
        </text>
      </g>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl sm:rounded-3xl shadow-2xl font-sans">
      <div className="bg-white rounded-xl sm:rounded-[23px] overflow-hidden">
        
        {/* Premium Header */}
        <div className="bg-[#0f172a] p-5 sm:p-6 md:p-8 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20 shrink-0">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">Growth Projection Engine</h2>
              <p className="text-slate-400 mt-0.5 sm:mt-1 text-xs sm:text-sm font-medium">All-on-4 Patient Acquisition • Delhi NCR</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold whitespace-nowrap">Data-Backed Projections</span>
          </div>
        </div>

        {/* REVERSED LAYOUT ON MOBILE/IPAD */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10">
          
          {/* Left Column (Now BOTTOM on mobile): Controls & Metrics */}
          <div className="lg:col-span-5 space-y-6 sm:space-y-8">
            
            {/* Slider Section */}
            <div className="bg-slate-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <label className="block text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 sm:mb-4">
                Monthly Ad Investment
              </label>
              <div className="flex items-center mb-4 sm:mb-6">
                <span className={`text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors ${adSpend < 60000 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {formatINR(adSpend)}
                </span>
              </div>
              
              <div className="relative pt-1 pb-2">
                <div className="absolute top-3 left-0 h-4 sm:h-3 bg-rose-200 rounded-l-lg pointer-events-none" style={{ width: '4%' }}></div>
                <input
                  type="range"
                  min="50000"
                  max="300000"
                  step="10000"
                  value={adSpend}
                  onChange={(e) => setAdSpend(Number(e.target.value))}
                  className={`relative z-10 w-full h-4 sm:h-3 bg-slate-200/50 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-4 transition-all ${
                    adSpend < 60000 ? 'accent-rose-500 focus:ring-rose-500/30' : 'accent-emerald-600 focus:ring-emerald-500/30'
                  }`}
                />
              </div>
              
              <div className="flex justify-between text-xs sm:text-sm font-semibold mt-2">
                <span className={adSpend < 60000 ? "text-rose-500" : "text-slate-400"}>₹50K</span>
                <span className="text-slate-400">₹3L</span>
              </div>

              {adSpend < 60000 && (
                <p className="text-rose-600 text-[10px] sm:text-xs font-bold mt-3 sm:mt-4 animate-pulse bg-rose-50 p-2 rounded-lg border border-rose-100">
                  ⚠️ WARNING: Budget mathematically insufficient to outbid corporate chains for All-on-4 patients.
                </p>
              )}
            </div>

            {/* AStar Results Box */}
            <div className="bg-white p-5 sm:p-7 rounded-xl sm:rounded-2xl shadow-xl border-2 border-emerald-500 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 sm:w-40 h-32 sm:h-40 bg-emerald-50 rounded-full blur-3xl"></div>
              
              <h3 className="font-bold text-emerald-700 flex items-center text-xs sm:text-sm uppercase tracking-wider mb-4 sm:mb-6">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                AStar CodeX Yield
              </h3>
              
              <div className="space-y-4 sm:space-y-5 relative z-10">
                <div className="flex justify-between items-end border-b border-slate-100 pb-3 sm:pb-4">
                  <span className="text-slate-500 text-sm sm:text-base font-medium">Projected Closes</span>
                  <span className="text-xl sm:text-2xl font-bold text-slate-800">
                    {patientText} <span className="text-xs sm:text-sm text-slate-500 font-normal">Patients</span>
                  </span>
                </div>
                
                <div className="flex justify-between items-end border-b border-slate-100 pb-3 sm:pb-4">
                  <span className="text-slate-500 text-sm sm:text-base font-medium">Gross Return</span>
                  <span className="text-xl sm:text-2xl font-bold text-emerald-600">{aStarRoas}x</span>
                </div>

                <div className="pt-1 sm:pt-2">
                  <span className="block text-slate-500 text-xs sm:text-sm font-medium mb-1">Total Gross Revenue</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{formatINR(aStarRevenue)}</span>
                </div>
              </div>
            </div>
            
            {/* Disclaimer */}
            <div className="flex items-start space-x-2 sm:space-x-3 text-xs sm:text-sm text-slate-500 bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Requires adherence to our clinic script framework to maintain the baseline 20% consultation-to-close conversion rate.
              </p>
            </div>
          </div>

          {/* Right Column (Now TOP on mobile): Chart & Comparison */}
          <div className="lg:col-span-7 flex flex-col justify-between mt-2 lg:mt-0">
            
            {/* Delta Callout */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-rose-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-rose-200 shadow-sm gap-3 sm:gap-0">
              <div>
                <p className="text-rose-800 text-xs sm:text-sm font-bold uppercase tracking-wider">The Cost of Inaction</p>
                <p className="text-rose-600/80 text-xs sm:text-sm mt-0.5 sm:mt-1 font-medium">Revenue lost to slow lead follow-up</p>
              </div>
              <div className="text-left sm:text-right w-full sm:w-auto border-t border-rose-200 sm:border-0 pt-2 sm:pt-0">
                <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 animate-pulse">+{formatINR(additionalRevenue)}</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="flex-grow min-h-[250px] h-[300px] sm:h-[350px] w-full mt-2 sm:mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 30, right: 0, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={<CustomXAxisTick />}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
                    tickFormatter={(value) => value >= 100000 ? `₹${value / 100000}L` : `₹${value}`}
                    width={50}
                  />
                  <Tooltip
                    formatter={(value: any) => [formatINR(value), "Gross Revenue"]}
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                  />
                  <Bar 
                    dataKey="Revenue" 
                    radius={[8, 8, 0, 0]}
                    barSize={60}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList 
                      dataKey="Revenue" 
                      position="top" 
                      formatter={(value: any) => formatINR(value)}
                      style={{ fill: '#0f172a', fontWeight: 800, fontSize: '12px' }}
                      offset={8}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}