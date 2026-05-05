import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Calculator, Package, Truck, Zap, Info } from "lucide-react";

const CostCalculator = () => {
  const navigate = useNavigate();
  const [weight, setWeight] = useState(1);
  const [type, setType] = useState("regular");
  const [totalCost, setTotalCost] = useState(0);

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
        estimatedCost: totalCost 
      } 
    });
  };

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Interactive Content */}
        <div className="space-y-8">
          <div className="space-y-4">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CAEB66]/20 border border-[#CAEB66] text-[#2E7D32] text-xs font-black uppercase tracking-widest"
             >
               <Calculator size={14} />
               Instant Estimator
             </motion.div>
             <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
               Calculate your <br />
               <span className="text-[#1E5AA8]">Shipping Cost</span>
             </h2>
             <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
               Get a precise estimate for your delivery in seconds. Transparency 
               is our priority—no hidden fees, just honest pricing.
             </p>
          </div>

          <div className="space-y-10 p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-sm">
            {/* Weight Slider */}
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                     <Package className="text-slate-400" size={20} />
                     <span className="font-bold text-slate-700 uppercase tracking-tighter">Parcel Weight</span>
                  </div>
                  <span className="text-2xl font-black text-[#2E7D32]">{weight} kg</span>
               </div>
               <input 
                 type="range" 
                 min="1" 
                 max="50" 
                 value={weight} 
                 onChange={(e) => setWeight(parseInt(e.target.value))}
                 className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2E7D32]"
               />
               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                  <span>1 kg</span>
                  <span>50 kg</span>
               </div>
            </div>

            {/* Delivery Type */}
            <div className="grid grid-cols-2 gap-4">
               <button 
                 onClick={() => setType("regular")}
                 className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${type === "regular" ? "border-[#2E7D32] bg-white shadow-xl shadow-[#2E7D32]/10" : "border-transparent bg-slate-100 opacity-60 hover:opacity-100"}`}
               >
                  <Truck size={32} className={type === "regular" ? "text-[#2E7D32]" : "text-slate-400"} />
                  <span className="font-black text-xs uppercase tracking-widest">Regular</span>
                  <span className="text-[10px] text-slate-400 font-bold">2-3 Business Days</span>
               </button>
               <button 
                 onClick={() => setType("express")}
                 className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300 ${type === "express" ? "border-[#1E5AA8] bg-white shadow-xl shadow-[#1E5AA8]/10" : "border-transparent bg-slate-100 opacity-60 hover:opacity-100"}`}
               >
                  <Zap size={32} className={type === "express" ? "text-[#1E5AA8]" : "text-slate-400"} />
                  <span className="font-black text-xs uppercase tracking-widest">Express</span>
                  <span className="text-[10px] text-slate-400 font-bold">Next Day Delivery</span>
               </button>
            </div>
          </div>
        </div>

        {/* Right: Price Visualization */}
        <div className="relative">
           {/* Decorative Blobs */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#CAEB66] blur-[100px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#1E5AA8] blur-[100px] rounded-full" />
           </div>

           <motion.div 
             layout
             className="relative z-10 p-10 md:p-16 rounded-[3rem] bg-slate-900 text-white shadow-2xl overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8">
                 <Info className="text-white/20 hover:text-white/40 cursor-pointer transition-colors" />
              </div>

              <div className="space-y-10">
                 <div className="space-y-2">
                    <h3 className="text-slate-400 text-xs font-black uppercase tracking-[0.2em]">Estimated Total</h3>
                    <div className="flex items-baseline gap-2">
                       <span className="text-6xl md:text-8xl font-black text-white">৳{totalCost}</span>
                       <span className="text-xl font-bold text-white/40">BDT</span>
                    </div>
                 </div>

                 <div className="space-y-6 pt-10 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-white/40 font-bold">Base Pickup Fee</span>
                       <span className="font-black">৳{basePrice}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-white/40 font-bold">Weight Surcharge ({weight}kg)</span>
                       <span className="font-black">৳{(weight - 1) * pricePerKg}</span>
                    </div>
                    {type === "express" && (
                       <div className="flex justify-between items-center text-sm text-[#CAEB66]">
                          <span className="font-bold">Express Priority</span>
                          <span className="font-black">+50%</span>
                       </div>
                    )}
                 </div>

                 <div className="pt-4">
                    <button 
                      onClick={handleShipNow}
                      className="w-full py-5 bg-[#CAEB66] text-black font-black rounded-2xl hover:bg-white transition-all duration-500 shadow-xl shadow-[#CAEB66]/20 uppercase tracking-widest text-xs"
                    >
                       Ship this Parcel now
                    </button>
                    <p className="text-center text-[10px] text-white/20 mt-4 font-bold uppercase tracking-tighter">
                      * final price may vary based on exact destination
                    </p>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CostCalculator;
