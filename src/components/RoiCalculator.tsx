"use client";

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from 'recharts';
import { Activity, TrendingUp, AlertCircle, ShieldCheck, Users, Target, CheckCircle, IndianRupee } from 'lucide-react';
import MathWaterfall from './MathWaterfall';

export default function DentalRoiCalculator() {
  const [adSpend, setAdSpend] = useState(100000);
  const [cpl, setCpl] = useState(2000);
  const [showRate, setShowRate] = useState(20);
  const [closeRate, setCloseRate] = useState(20);
  const [patientValue, setPatientValue] = useState(350000);
  
  // 2. AStar CodeX Math Engine (Updated to floor whole patients)
  const leads = adSpend / cpl;
  const walkIns = leads * (showRate / 100);
  const aStarClosesRaw = walkIns * (closeRate / 100);
  
  // THE FIX: You cannot have a fraction of a patient. We round down to the nearest whole integer.
  const aStarClosesActual = Math.floor(aStarClosesRaw);
  const aStarRevenue = aStarClosesActual * patientValue;
  const aStarRoas = adSpend > 0 ? (aStarRevenue / adSpend).toFixed(1) : "0.0";
  
  const minPatients = Math.floor(aStarClosesRaw);
  const maxPatients = Math.ceil(aStarClosesRaw);
  const patientText = minPatients === maxPatients ? `${minPatients}` : `${minPatients} to ${maxPatients}`;
  
  // 3. Generic Agency Projections (Updated to floor whole patients)
  const genericShowRate = showRate * 0.4; 
  const genericWalkIns = leads * (genericShowRate / 100);
  const genericClosesRaw = genericWalkIns * (closeRate / 100);
  
  const genericClosesActual = Math.floor(genericClosesRaw);
  const genericRevenue = genericClosesActual * patientValue;

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
      color: '#059669' 
    }
  ];

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const CustomXAxisTick = ({ x, y, payload }: any) => {
    const isGeneric = payload.value === 'Generic Agency';
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="#475569" fontSize={12} fontWeight={600} className="sm:text-sm">
          {payload.value}
        </text>
        <text x={0} y={0} dy={32} textAnchor="middle" fill={isGeneric ? '#ef4444' : '#059669'} fontSize={10} fontWeight={700}>
          {isGeneric ? `(${genericShowRate.toFixed(1)}% Show Rate)` : `(${showRate}% Show Rate)`}
        </text>
      </g>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl sm:rounded-3xl shadow-2xl font-sans">
      <div className="bg-white rounded-xl sm:rounded-[23px] overflow-hidden">
        
        {/* Premium Header */}
        <div className="bg-[#0f172a] p-5 sm:p-6 md:p-8 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="p-2 sm:p-3 bg-white/10 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/20 shrink-0">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">Patient Yield Engine</h2>
              <p className="text-slate-400 mt-0.5 sm:mt-1 text-xs sm:text-sm font-medium">Interactive ROI Modeler • AStar CodeX</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-2 bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-bold whitespace-nowrap">Collaborative Math</span>
          </div>
        </div>

        {/* REVERSED LAYOUT ON MOBILE/IPAD */}
        <div className="p-4 sm:p-6 md:p-8 flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-10">
          
          {/* Left Column: Controls & Metrics */}
          <div className="lg:col-span-5 space-y-5 sm:space-y-6">
            
            {/* Ad Spend Section */}
            <div className="bg-slate-50 p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Monthly Ad Investment
              </label>
              <div className="flex items-center mb-3">
                <span className={`text-3xl font-extrabold tracking-tight ${aStarClosesActual < 1 ? 'text-rose-600' : 'text-slate-900'}`}>
                  {formatINR(adSpend)}
                </span>
              </div>
              <input
                type="range"
                min="30000"
                max="500000"
                step="10000"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className={`w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 transition-all ${
                    aStarClosesActual < 1 ? 'accent-rose-500 focus:ring-rose-500/30' : 'accent-emerald-600 focus:ring-emerald-500/30'
                  }`}
              />
              
              {/* Dynamic Warning if budget doesn't yield 1 whole patient */}
              {aStarClosesActual < 1 && (
                <p className="text-rose-600 text-[10px] sm:text-xs font-bold mt-3 animate-pulse bg-rose-50 p-2 rounded-lg border border-rose-100">
                  ⚠️ INSUFFICIENT BUDGET: Math yields &lt; 1 patient. Revenue will be ₹0.
                </p>
              )}
            </div>

            {/* Clinic Variables Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                <div className="flex items-center text-slate-500 mb-1">
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase">Cost Per Lead</span>
                </div>
                <input 
                  type="number" 
                  value={cpl} 
                  onChange={(e) => setCpl(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-sm font-bold rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                <div className="flex items-center text-slate-500 mb-1">
                  <IndianRupee className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase">Avg Case Value</span>
                </div>
                <input 
                  type="number" 
                  value={patientValue} 
                  onChange={(e) => setPatientValue(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-sm font-bold rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                <div className="flex items-center text-slate-500 mb-1">
                  <Target className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase">Show Rate (%)</span>
                </div>
                <input 
                  type="number" 
                  value={showRate} 
                  onChange={(e) => setShowRate(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-sm font-bold rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                <div className="flex items-center text-slate-500 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  <span className="text-[10px] sm:text-xs font-bold uppercase">Close Rate (%)</span>
                </div>
                <input 
                  type="number" 
                  value={closeRate} 
                  onChange={(e) => setCloseRate(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 text-slate-800 text-sm font-bold rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* AStar Results Box */}
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow-xl border-2 border-emerald-500 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl"></div>
              
              <h3 className="font-bold text-emerald-700 flex items-center text-xs sm:text-sm uppercase tracking-wider mb-4">
                <TrendingUp className="w-4 h-4 mr-2" />
                AStar CodeX Projected Yield
              </h3>
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                  <span className="text-slate-500 text-sm font-medium">Projected Closes</span>
                  <span className={`text-xl font-bold ${aStarClosesActual < 1 ? 'text-rose-600' : 'text-slate-800'}`}>
                    {patientText} <span className="text-xs text-slate-500 font-normal">Patients</span>
                  </span>
                </div>
                
                <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                  <span className="text-slate-500 text-sm font-medium">Gross Return (ROAS)</span>
                  <span className={`text-xl font-bold ${aStarClosesActual < 1 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {aStarRoas}x
                  </span>
                </div>

                <div className="pt-1">
                  <span className="block text-slate-500 text-xs font-medium mb-1">Total Gross Revenue</span>
                  <span className={`text-3xl font-extrabold tracking-tight ${aStarClosesActual < 1 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {formatINR(aStarRevenue)}
                  </span>
                </div>
              </div>
            </div>
            
            <MathWaterfall 
              adSpend={adSpend} 
              cpl={cpl} 
              showRate={showRate} 
              closeRate={closeRate} 
              patientValue={patientValue} 
            />

          </div>

          {/* Right Column: Chart & Comparison */}
          <div className="lg:col-span-7 flex flex-col justify-between mt-2 lg:mt-0">
            
            {/* Delta Callout */}
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-rose-50 p-4 sm:p-5 rounded-xl border border-rose-200 shadow-sm gap-3 sm:gap-0">
              <div>
                <p className="text-rose-800 text-xs sm:text-sm font-bold uppercase tracking-wider">The Cost of Inaction</p>
                <p className="text-rose-600/80 text-xs sm:text-sm mt-0.5 font-medium">Revenue lost to slow lead follow-up</p>
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