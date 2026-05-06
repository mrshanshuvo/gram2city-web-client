import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Package, Zap, ChevronRight } from "lucide-react";

const CostCalculator = () => {
  const [weight, setWeight] = useState(1);
  const [type, setType] = useState("regular");
  const [totalCost, setTotalCost] = useState(60);
  const navigate = useNavigate();

  const basePrice = 60;
  const pricePerKg = 15;
  const expressMultiplier = 1.5;

  useEffect(() => {
    let cost = basePrice + (weight - 1) * pricePerKg;
    if (type === "express") cost *= expressMultiplier;
    setTotalCost(Math.round(cost));
  }, [weight, type]);

  const handleShipNow = () => {
    navigate("/dashboard/addParcel", {
      state: {
        predefinedWeight: weight,
        predefinedType: type,
        estimatedCost: totalCost,
      },
    });
  };

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            Calculate your shipping cost
          </h2>
        </div>

        <div className="bg-slate-50 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          {/* Top Grid: Inputs side-by-side */}
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Weight Slider */}
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-400">
                  <Package size={16} />
                  <span className="font-bold text-[12px] uppercase tracking-widest">
                    Parcel Weight
                  </span>
                </div>
                <span className="text-xl font-black text-primary">
                  {weight} <span className="text-xs">KG</span>
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[11px] font-black text-slate-500">
                <span>1KG</span>
                <span>25KG</span>
                <span>50KG</span>
              </div>
            </div>

            {/* Service Type Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-400 mb-3">
                <Zap size={14} />
                <span className="font-bold text-[10px] uppercase tracking-widest">
                  Service Type
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setType("regular")}
                  className={`py-3 px-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 ${
                    type === "regular"
                      ? "bg-white border-primary shadow-sm text-primary font-black scale-105"
                      : "bg-transparent border-slate-200 text-slate-400 font-bold opacity-60"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest">
                    Regular
                  </span>
                </button>
                <button
                  onClick={() => setType("express")}
                  className={`py-3 px-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 ${
                    type === "express"
                      ? "bg-white border-blue-600 shadow-sm text-blue-600 font-black scale-105"
                      : "bg-transparent border-slate-200 text-slate-400 font-bold opacity-60"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-widest">
                    Express
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Result & CTA */}
          <div className="bg-slate-900 text-white px-6 md:px-8 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div>
                  <h3 className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] mb-1">
                    Total Estimated Cost
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white leading-none">
                      ৳{totalCost}
                    </span>
                    <span className="text-xs font-bold text-white/40">BDT</span>
                  </div>
                </div>

                <div className="hidden md:flex flex-col gap-1 border-l border-white/10 pl-6 text-[11px] text-white/30 font-bold uppercase tracking-tight">
                  <span>Base: ৳{basePrice}</span>
                  <span>Weight: +৳{(weight - 1) * pricePerKg}</span>
                </div>
              </div>

              <button
                onClick={handleShipNow}
                className="px-8 py-3.5 bg-accent text-black font-black rounded-lg hover:bg-white transition-all duration-500 shadow-lg shadow-accent/10 flex items-center justify-center gap-2 uppercase tracking-widest text-[12px]"
              >
                Ship Parcel <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CostCalculator;
