import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminLiveRates = () => {
  const [axiosSecure] = useAxiosSecure();
  const [goldRate, setGoldRate] = useState("");
  const [silverRate, setSilverRate] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { data: rates, isLoading: isRatesLoading, refetch } = useQuery({
    queryKey: ["admin-rates"],
    queryFn: async () => {
      const result = await axiosSecure.get("/rates");
      return result.data;
    },
    onSuccess: (data) => {
      if (data?.gold) setGoldRate(data.gold.ratePerGram);
      if (data?.silver) setSilverRate(data.silver.ratePerGram);
    }
  });

  useEffect(() => {
    if (rates?.gold) setGoldRate(rates.gold.ratePerGram);
    if (rates?.silver) setSilverRate(rates.silver.ratePerGram);
  }, [rates]);

  const handleUpdateRates = (e) => {
    e.preventDefault();
    setIsUpdating(true);
    axiosSecure.patch("/rates", {
      gold: Number(goldRate),
      silver: Number(silverRate)
    })
    .then((res) => {
      if (res.data.success) {
        toast.success("Live rates updated successfully");
        refetch();
      }
    })
    .catch((err) => {
      console.error(err);
      toast.error("Failed to update rates");
    })
    .finally(() => {
      setIsUpdating(false);
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Top Bar */}
      <header className="h-20 flex items-center justify-between px-6 md:px-margin-desktop bg-background/80 backdrop-blur-md border-b border-outline-variant/30 z-40 shrink-0">
        <h2 className="font-display-lg text-headline-md text-primary">Live Metal Rates</h2>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-margin-desktop custom-scrollbar">
        <div className="max-w-3xl mx-auto">
          {/* Current Rates Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface-dim border border-secondary/20 rounded-xl p-6 flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="font-label-caps text-outline text-[12px]">Gold Rate (22K)</span>
                <span className="material-symbols-outlined text-[#d4af37]">workspace_premium</span>
              </div>
              <div>
                {isRatesLoading ? (
                  <div className="skeleton w-32 h-10 mb-2 rounded bg-outline-variant/20"></div>
                ) : (
                  <p className="text-4xl text-on-surface font-display tracking-tight">
                    ₹{Number(rates?.gold?.ratePerGram || 0).toLocaleString("en-IN")}
                  </p>
                )}
                <p className="text-[11px] text-outline mt-1 uppercase tracking-wider">Per Gram</p>
                <p className="text-[10px] text-outline/60 mt-4">
                  Last updated: {rates?.gold?.updatedAt ? new Date(rates.gold.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="bg-surface-dim border border-secondary/20 rounded-xl p-6 flex flex-col justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="font-label-caps text-outline text-[12px]">Silver Rate</span>
                <span className="material-symbols-outlined text-[#c0c0c0]">diamond</span>
              </div>
              <div>
                {isRatesLoading ? (
                  <div className="skeleton w-32 h-10 mb-2 rounded bg-outline-variant/20"></div>
                ) : (
                  <p className="text-4xl text-on-surface font-display tracking-tight">
                    ₹{Number(rates?.silver?.ratePerGram || 0).toLocaleString("en-IN")}
                  </p>
                )}
                <p className="text-[11px] text-outline mt-1 uppercase tracking-wider">Per Gram</p>
                <p className="text-[10px] text-outline/60 mt-4">
                  Last updated: {rates?.silver?.updatedAt ? new Date(rates.silver.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Update Form */}
          <div className="bg-surface-dim border border-secondary/20 rounded-xl p-6 md:p-8">
            <h3 className="font-headline-sm text-primary mb-2">Update Today's Rates</h3>
            <p className="text-sm text-on-surface-variant mb-8 font-body-base">
              These rates will be displayed on the customer frontend and used to calculate dynamic prices.
            </p>
            
            <form onSubmit={handleUpdateRates} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-caps text-outline text-[11px] mb-2">New Gold Rate (₹ / g)</label>
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-outline font-button-text">₹</span>
                    <input 
                      type="number"
                      required
                      value={goldRate}
                      onChange={(e) => setGoldRate(e.target.value)}
                      className="w-full pl-6 pr-4 py-2 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-body-base text-on-surface outline-none transition-all placeholder:text-outline/40"
                      placeholder="e.g. 6800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-outline text-[11px] mb-2">New Silver Rate (₹ / g)</label>
                  <div className="relative">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-outline font-button-text">₹</span>
                    <input 
                      type="number"
                      required
                      value={silverRate}
                      onChange={(e) => setSilverRate(e.target.value)}
                      className="w-full pl-6 pr-4 py-2 bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-body-base text-on-surface outline-none transition-all placeholder:text-outline/40"
                      placeholder="e.g. 85"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="bg-primary text-white px-8 py-3 rounded-lg font-button-text hover:bg-primary-container active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isUpdating ? "Saving..." : "Save New Rates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLiveRates;
