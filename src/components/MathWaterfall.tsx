import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface MathWaterfallProps {
  adSpend: number;
  cpl: number;
  showRate: number;
  closeRate: number;
  patientValue: number;
}

export default function MathWaterfall({ adSpend, cpl, showRate, closeRate, patientValue }: MathWaterfallProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Safe Math (Prevents Infinity / NaN errors if inputs hit 0)
  const safeCpl = cpl > 0 ? cpl : 1;
  const leads = adSpend / safeCpl;
  const walkIns = leads * (showRate / 100);
  const closes = walkIns * (closeRate / 100);
  const revenue = closes * patientValue;
  const roas = adSpend > 0 ? (revenue / adSpend).toFixed(1) : "0.0";

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNum = (value: number) => {
    return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
  };

  return (
    <div className="mt-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 sm:p-4 text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none"
      >
        <div className="flex items-center text-xs sm:text-sm font-bold uppercase tracking-wider">
          <Calculator className="w-4 h-4 mr-2 text-slate-400" />
          View Calculation Logic
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-slate-200 space-y-3 bg-white">
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">1. Total Leads Generated</span>
            <span className="font-bold text-slate-800 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-normal">{formatINR(adSpend)} ÷ {formatINR(cpl)} =</span> 
              {formatNum(leads)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">2. Actual Walk-ins</span>
            <span className="font-bold text-slate-800 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-normal">{formatNum(leads)} × {showRate}% =</span> 
              {formatNum(walkIns)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 font-medium">3. Closed Patients</span>
            <span className="font-bold text-slate-800 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-normal">{formatNum(walkIns)} × {closeRate}% =</span> 
              {formatNum(closes)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm border-t border-slate-100 pt-3 mt-3">
            <span className="text-slate-700 font-bold">Gross Revenue</span>
            <span className="font-bold text-emerald-600 flex items-center gap-2">
              <span className="text-xs text-slate-400 font-normal">{formatNum(closes)} × {formatINR(patientValue)} =</span> 
              {formatINR(revenue)}
            </span>
          </div>

        </div>
      )}
    </div>
  );
}