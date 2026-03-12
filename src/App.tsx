import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, Zap, Building2, Wind, Sun, Battery, AlertTriangle, Leaf, BarChart3, TrendingUp, CloudRain, Thermometer, Droplets, Navigation, X, CheckCircle2, Cpu, Trophy, Medal, LayoutDashboard, Map as MapIcon, BarChart as BarChartIcon, Settings, Menu, ChevronRight, SunMedium, Moon, Send, Loader2, Activity } from "lucide-react";
import { IndiaMap } from "./components/IndiaMap";
import { SMART_CITIES } from "./constants";
import { getEnergyForecast, ForecastOutput, getChatResponse } from "./services/geminiService";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line, PieChart, Pie } from "recharts";
import Papa from "papaparse";
import Markdown from "react-markdown";

interface HistoricalData {
  Timestamp: string;
  City: string;
  Energy_Demand_MW: number;
  Solar_Generation_MW: number;
  Wind_Generation_MW: number;
  Hydro_Generation_MW: number;
  Total_Renewable_MW: number;
  Grid_Power_Needed_MW: number;
  Battery_Storage_MWh: number;
  Temperature_C: number;
  Cloud_Cover_Percent: number;
  Wind_Speed_mps: number;
  Rainfall_mm: number;
}


export default function App() {
  return (
    <MainApp />
  );
}

function MainApp() {
  const [view, setView] = useState<"landing" | "dashboard">("landing");
  const [activeSection, setActiveSection] = useState("overview");
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRefs = {
    overview: useRef<HTMLDivElement>(null),
    map: useRef<HTMLDivElement>(null),
    standings: useRef<HTMLDivElement>(null),
    forecast: useRef<HTMLDivElement>(null),
    live: useRef<HTMLDivElement>(null),
    prediction: useRef<HTMLDivElement>(null),
    chat: useRef<HTMLDivElement>(null),
  };

  const scrollToSection = (id: string) => {
    sectionRefs[id as keyof typeof sectionRefs].current?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  useEffect(() => {
    const observerOptions = {
      root: mainRef.current,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [view]); // Re-run when view changes to ensure refs are attached

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof SMART_CITIES>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [forecast, setForecast] = useState<ForecastOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [showMiniPanel, setShowMiniPanel] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [cityHistoricalData, setCityHistoricalData] = useState<HistoricalData[]>([]);
  const [availableCities, setAvailableCities] = useState<typeof SMART_CITIES>(SMART_CITIES);
  const [liveConsumption, setLiveConsumption] = useState<number>(0);
  const [liveRenewable, setLiveRenewable] = useState<number>(0);
  const [liveFrequency, setLiveFrequency] = useState<number>(50.00);
  const [liveVoltage, setLiveVoltage] = useState<number>(220.0);
  const [liveDataHistory, setLiveDataHistory] = useState<any[]>([]);
  const theme = "dark";
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "ai", content: string }[]>([
    { role: "ai", content: "Hello! I'm your Lumino AI assistant. Select a city to begin our analysis!" }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    if (selectedCity) {
      setChatMessages(prev => {
        // Only add greeting if it's the first message or if the last message wasn't about this city
        if (prev.length <= 1) {
          return [{ role: "ai", content: `Hello! I'm your Lumino AI assistant. I'm currently monitoring ${selectedCity}. How can I help you optimize energy usage today?` }];
        }
        return prev;
      });
    }
  }, [selectedCity]);

  useEffect(() => {
    if (forecast) {
      // Initialize live consumption near predicted demand
      setLiveConsumption(forecast.predictedDemandMW * (0.98 + Math.random() * 0.04));
      setLiveRenewable(forecast.predictedRenewableMW * (0.95 + Math.random() * 0.1));
      
      const interval = setInterval(() => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setLiveConsumption(prevC => {
          // Target consumption is the predicted demand with some realistic variance
          const targetC = forecast.predictedDemandMW;
          // Slowly drift towards target with small random fluctuations
          const nextC = prevC * 0.95 + targetC * 0.05 + (Math.random() - 0.5) * 15;
          
          setLiveRenewable(prevR => {
            // Target renewable is the predicted renewable output
            const targetR = forecast.predictedRenewableMW;
            // Drifting towards target
            const nextR = prevR * 0.95 + targetR * 0.05 + (Math.random() - 0.5) * 10;
            
            setLiveDataHistory(prevH => {
              const entry = {
                time: timeStr,
                demand: nextC,
                renewable: nextR,
                share: (nextR / nextC) * 100,
                predictedDemand: forecast.predictedDemandMW,
                predictedRenewable: forecast.predictedRenewableMW
              };
              const nextH = [...prevH, entry];
              return nextH.slice(-30);
            });
            return nextR;
          });
          return nextC;
        });

        setLiveFrequency(50 + (Math.random() - 0.5) * 0.02); // More stable frequency
        setLiveVoltage(220 + (Math.random() - 0.5) * 0.8); // More stable voltage
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [forecast]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const filtered = availableCities.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, availableCities]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const loadHistoricalData = async () => {
      try {
        const response = await fetch("/Prod_3yr.csv");
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            const data = results.data as any[];
            const formattedData: HistoricalData[] = data
              .filter(row => row.City && row.Timestamp)
              .map(row => ({
                Timestamp: row.Timestamp,
                City: row.City,
                Energy_Demand_MW: row.Energy_Demand_MW,
                Solar_Generation_MW: row.Solar_Generation_MW,
                Wind_Generation_MW: row.Wind_Generation_MW,
                Hydro_Generation_MW: row.Hydro_Generation_MW,
                Total_Renewable_MW: row.Total_Renewable_MW,
                Grid_Power_Needed_MW: row.Grid_Power_Needed_MW,
                Battery_Storage_MWh: row.Battery_Storage_MWh,
                Temperature_C: row.Temperature_C,
                Cloud_Cover_Percent: row["Cloud_Cover_%"],
                Wind_Speed_mps: row.Wind_Speed_mps,
                Rainfall_mm: row.Rainfall_mm,
              }));
            setHistoricalData(formattedData);
            console.log("Historical data loaded:", formattedData.length, "rows");
            
            // Filter cities based on data availability
            const cityNames = Array.from(new Set(formattedData.map(d => d.City)));
            
            // Calculate sustainability scores based on historical data
            const sustainabilityScores: Record<string, number> = {};
            cityNames.forEach(cityName => {
              const cityRecords = formattedData.filter(d => d.City === cityName);
              const totalDemand = cityRecords.reduce((sum, r) => sum + r.Energy_Demand_MW, 0);
              const totalRenewable = cityRecords.reduce((sum, r) => sum + r.Total_Renewable_MW, 0);
              // Calculate average sustainability (Renewable / Demand)
              sustainabilityScores[cityName] = totalDemand > 0 ? (totalRenewable / totalDemand) * 100 : 0;
            });

            const finalCities = SMART_CITIES.map(c => ({
              ...c,
              sustainabilityScore: sustainabilityScores[c.name] || c.sustainabilityScore
            }));
            
            setAvailableCities(finalCities);
          }
        });
      } catch (error) {
        console.error("Failed to load historical data:", error);
      }
    };
    loadHistoricalData();
  }, []);

  useEffect(() => {
    console.log("App initialized. View:", view);
  }, [view]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    const city = availableCities.find(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (city) {
      handleCitySelect(city.name);
    } else {
      console.warn("City not found in smart city database:", searchQuery);
    }
  };

  const handleCitySelect = React.useCallback(async (cityName: string) => {
    console.log("City selected:", cityName);
    setSelectedCity(cityName);
    setLoading(true);
    setSuggestions([]);
    setSearchQuery("");
    
    // Filter historical data for this city
    const cityData = historicalData.filter(d => d.City === cityName);
    setCityHistoricalData(cityData);
    
    if (view === "landing") {
      console.log("Transitioning to dashboard...");
      setView("dashboard");
    }
    
    try {
      // Use latest data from CSV if available to ground the forecast
      const latestData = cityData[cityData.length - 1];
      
      // Prepare historical context for AI (last 10 points)
      const recentPoints = cityData.slice(-10);
      const historicalContext = recentPoints.map(p => 
        `Time: ${p.Timestamp}, Demand: ${p.Energy_Demand_MW}MW, Renewable: ${p.Total_Renewable_MW}MW`
      ).join('\n');

      const data = await getEnergyForecast({
        city: cityName,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        isWeekend: [0, 6].includes(new Date().getDay()),
        isHoliday: false,
        temp: latestData?.Temperature_C || (28 + Math.random() * 10),
        humidity: 40 + Math.random() * 30,
        trafficIndex: 60 + Math.random() * 40,
        solarRadiation: latestData?.Solar_Generation_MW ? (latestData.Solar_Generation_MW * 5) : (600 + Math.random() * 400),
        historicalContext
      });
      console.log("Forecast data received:", data);
      setForecast(data);
      setIsSimulated(false);
      setShowMiniPanel(true);
    } catch (error) {
      console.error("Forecast synthesis failed:", error);
      setIsSimulated(true);
      setShowMiniPanel(true);
      // Fallback data if API fails
      setForecast({
        predictedDemandMW: 4500,
        predictedRenewableMW: 2000,
        forecast24h: Array.from({ length: 12 }, (_, i) => ({
          time: `${i * 2}:00`,
          demand: 4000 + Math.random() * 1000,
          production: 1500 + Math.random() * 1000
        })),
        zoneWiseDemand: { airport: 800, downtown: 2200, suburbs: 1500 },
        renewableOutput: { solar: 1200, wind: 800, hydro: 500, gridImport: 2000 },
        batteryStoragePercent: 65,
        evCharging: { currentLoadMW: 450, optimalWindow: "11 PM - 5 AM" },
        weatherImpact: { 
          temperature: 32, 
          trend: "+2°C", 
          alert: "Heatwave warning",
          riskLevel: "High",
          operatorNote: "Expect peak demand surge at 14:00 due to AC load."
        },
        balance: -2500,
        alerts: ["High demand detected in downtown", "Solar output decreasing"],
        suggestions: ["Activate backup battery storage", "Implement peak-shaving in industrial zones"],
        metrics: { renewableUsagePercent: 45, co2AvoidedTons: 15, efficiencyScore: 82 },
        solutions: ["Expand solar grid", "Smart meter deployment"],
        predictionDetails: {
          confidenceLevel: 92,
          lowerBoundMW: 4200,
          upperBoundMW: 4800,
          errorMarginPercent: 3.5,
          dataQualityScore: 88
        },
        standings: [
          { name: "Amaravati", renewableFulfillment: 45, demandMW: 3200, renewableMW: 1440 },
          { name: "Hyderabad", renewableFulfillment: 38, demandMW: 5800, renewableMW: 2204 },
          { name: "New Delhi", renewableFulfillment: 22, demandMW: 8500, renewableMW: 1870 },
          { name: "Kochi", renewableFulfillment: 62, demandMW: 1200, renewableMW: 744 },
          { name: "Thiruvananthapuram", renewableFulfillment: 58, demandMW: 900, renewableMW: 522 }
        ]
      });
    } finally {
      setLoading(false);
    }
  }, [view, historicalData]);

  const cityDemands = React.useMemo(() => {
    const demands: Record<string, { percent: number, mw: number }> = {};
    const now = new Date();
    const currentHour = now.getHours();
    
    SMART_CITIES.forEach(city => {
      const cityHistory = historicalData.filter(d => d.City === city.name);
      if (cityHistory.length > 0) {
        // Find a record that matches the current hour to be "live"
        // We look for the most recent record that matches this hour
        const hourMatches = cityHistory.filter(d => {
           const date = new Date(d.Timestamp);
           return date.getHours() === currentHour;
        });
        
        const record = hourMatches.length > 0 ? hourMatches[hourMatches.length - 1] : cityHistory[cityHistory.length - 1];
        // Normalize demand to 0-100 scale
        demands[city.name] = {
          percent: Math.min(100, (record.Energy_Demand_MW / 8000) * 100),
          mw: record.Energy_Demand_MW
        };
      }
    });
    return demands;
  }, [historicalData]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div className="tron-grid absolute inset-0 opacity-5 pointer-events-none" />
      {theme === "dark" && <div className="scanline" />}

      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ scale: 2, opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-screen flex flex-col items-center justify-center px-4"
          >
            {/* Background Buildings Effect */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="absolute inset-0 bg-[var(--bg)] opacity-90 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000" 
                alt="Digital Earth"
                className="w-full h-full object-cover opacity-20"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg)]/50 to-[var(--bg)] z-20" />
            </div>

            <div className="relative z-10 text-center max-w-4xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-[10px] font-bold uppercase tracking-widest mb-6 border border-[var(--primary)]/20">
                  <Zap size={12} />
                  <span>Next-Gen Energy Intelligence</span>
                </div>
                <h1 className="text-7xl md:text-9xl font-display font-bold tracking-tighter mb-6 text-[var(--text)] leading-[0.9]">
                  Lumino<span className="text-[var(--primary)]">City</span>
                </h1>
                <p className="text-[var(--text-muted)] font-sans text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                  Advanced AI-driven energy demand forecasting and sustainability dashboard for Indian smart cities.
                </p>
              </motion.div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative max-w-2xl mx-auto"
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative flex items-center bg-[var(--card-bg)] border border-[var(--border)] rounded-full px-8 py-4 shadow-2xl">
                    <Search className="text-[var(--primary)] w-6 h-6 mr-4" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery) {
                          const city = availableCities.find(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
                          if (city) handleCitySelect(city.name);
                        }
                      }}
                      placeholder="Search smart city (e.g. Mumbai, Delhi)..."
                      className="bg-transparent border-none outline-none text-xl w-full text-[var(--text)] placeholder:text-[var(--text-muted)]/40 font-light"
                    />
                    <button 
                      onClick={() => {
                        if (!searchQuery) return;
                        const city = availableCities.find(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
                        if (city) {
                          handleCitySelect(city.name);
                        } else {
                          // Fallback if no match found, though handleCitySelect might handle it
                          handleCitySelect(searchQuery);
                        }
                      }}
                      className="ml-4 colorful-bg text-white px-10 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-lg active:scale-95"
                    >
                      Analyze
                    </button>
                  </div>
                </div>

                {/* Trending Searches */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-widest mr-2">Trending:</span>
                  {["Amaravati", "Hyderabad", "Delhi", "Kochi", "Thiruvananthapuram"].map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setSearchQuery(city);
                        handleCitySelect(city);
                      }}
                      className="px-4 py-1.5 rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-xs font-medium hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all"
                    >
                      {city}
                    </button>
                  ))}
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {suggestions.length > 0 && searchQuery.length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-4 bg-[var(--card-bg)] border border-[var(--glass-border)] rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      {suggestions.map((city) => (
                        <button
                          key={city.name}
                          onClick={() => {
                            setSearchQuery(city.name);
                            handleCitySelect(city.name);
                          }}
                          className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[var(--text)]/5 transition-colors text-left"
                        >
                          <MapPin size={18} className="text-[var(--primary)]" />
                          <div>
                            <p className="font-bold text-[var(--text)]">{city.name}</p>
                            <p className="text-[10px] text-[var(--text)]/40 uppercase tracking-widest">Smart City Node</p>
                          </div>
                          <ChevronRight size={16} className="ml-auto text-[var(--text)]/20" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-screen w-full overflow-hidden bg-[var(--bg)] text-[var(--text)] flex"
          >
            {/* Sidebar */}
            <aside className="w-[280px] h-full bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col z-50">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl colorful-bg flex items-center justify-center text-white shadow-lg">
                    <Zap size={24} />
                  </div>
                  <h1 className="text-xl font-display font-bold tracking-tight">
                    Lumino<span className="text-[var(--primary)]">City</span>
                  </h1>
                </div>

                <nav className="space-y-1">
                  <NavItem 
                    active={activeSection === "overview"} 
                    onClick={() => scrollToSection("overview")} 
                    icon={<LayoutDashboard size={20} />} 
                    label="Overview" 
                    collapsed={false} 
                  />
                  <NavItem 
                    active={activeSection === "map"} 
                    onClick={() => scrollToSection("map")} 
                    icon={<MapIcon size={20} />} 
                    label="Energy Map" 
                    collapsed={false} 
                  />
                  <NavItem 
                    active={activeSection === "standings"} 
                    onClick={() => scrollToSection("standings")} 
                    icon={<Medal size={20} />} 
                    label="Standings" 
                    collapsed={false} 
                  />
                  <NavItem 
                    active={activeSection === "forecast"} 
                    onClick={() => scrollToSection("forecast")} 
                    icon={<BarChartIcon size={20} />} 
                    label="Forecast" 
                    collapsed={false} 
                  />
                  <NavItem 
                    active={activeSection === "live"} 
                    onClick={() => scrollToSection("live")} 
                    icon={<Activity size={20} />} 
                    label="Live Grid" 
                    collapsed={false} 
                  />
                  <NavItem 
                    active={activeSection === "prediction"} 
                    onClick={() => scrollToSection("prediction")} 
                    icon={<Cpu size={20} />} 
                    label="AI Prediction" 
                    collapsed={false} 
                  />
                  <NavItem 
                    active={activeSection === "chat"} 
                    onClick={() => scrollToSection("chat")} 
                    icon={<Send size={20} />} 
                    label="Lumino Chat" 
                    collapsed={false} 
                  />
                </nav>
              </div>

              <div className="mt-auto p-6 border-t border-[var(--border)] space-y-2">
                <button 
                  onClick={() => setView("landing")}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all"
                >
                  <X size={18} />
                  <span className="text-sm font-medium">Exit Dashboard</span>
                </button>
              </div>
            </aside>

            {/* Main Content Area */}
            <main ref={mainRef} className="flex-1 h-full overflow-y-auto bg-[var(--bg)] relative">
              {/* Header */}
              <header className="sticky top-0 z-40 bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] px-8 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold capitalize">{activeSection.replace("-", " ")}</h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    {selectedCity || "National Grid"} • {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <form onSubmit={handleSearch} className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--primary)] transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search city..."
                      className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)]/50 transition-all w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    
                    {/* Header Suggestions */}
                    <AnimatePresence>
                      {suggestions.length > 0 && searchQuery.length > 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-[var(--card-bg)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden z-[100]"
                        >
                          {suggestions.map((city) => (
                            <button
                              key={city.name}
                              type="button"
                              onClick={() => {
                                setSearchQuery(city.name);
                                handleCitySelect(city.name);
                                setSuggestions([]);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--text)]/5 transition-colors text-left"
                            >
                              <MapPin size={14} className="text-[var(--primary)]" />
                              <span className="text-sm font-medium">{city.name}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </header>

              <div className="p-8 max-w-7xl mx-auto">
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-0 right-0 h-full w-[400px] z-[100] bg-[var(--card-bg)] border-l border-[var(--border)] shadow-2xl overflow-hidden"
          >
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card-bg)]/50 backdrop-blur-xl">
                <div>
                  <h3 className="font-bold text-lg tracking-tight">Lumino AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[10px] text-emerald-500 font-mono uppercase tracking-widest font-bold">Neural Link Active</p>
                  </div>
                </div>
                <button onClick={() => setChatOpen(false)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl text-[var(--text-muted)] transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatInterface 
                  city={selectedCity} 
                  forecast={forecast} 
                  historicalData={cityHistoricalData} 
                  messages={chatMessages}
                  setMessages={setChatMessages}
                  isLoading={isChatLoading}
                  setIsLoading={setIsChatLoading}
                  onClose={() => setChatOpen(false)} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

              {/* Content Header (Removed old header) */}

              <div className="max-w-7xl mx-auto">
                {loading ? (
                  <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--primary)]/20 border-t-[var(--primary)] rounded-full animate-spin" />
                    <p className="font-mono text-xs text-[var(--primary)] animate-pulse uppercase tracking-widest">Synthesizing Data...</p>
                  </div>
                ) : (
                  <div className="space-y-32 pb-32">
                    {/* Overview Section */}
                    <section id="overview" ref={sectionRefs.overview} className="scroll-mt-24">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-3xl font-display font-bold">System Overview</h2>
                          <div className="px-4 py-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl text-[var(--primary)] text-xs font-bold uppercase tracking-widest">
                            Real-time Intelligence
                          </div>
                        </div>

                        {/* 1. Map at the top */}
                        <div className="h-[50vh] rounded-3xl overflow-hidden shadow-2xl border border-white/5 relative bg-[#0a0a0a]">
                          <IndiaMap 
                            onCitySelect={handleCitySelect} 
                            selectedCity={selectedCity} 
                            cityDemands={cityDemands} 
                            theme={theme} 
                            cities={availableCities} 
                            allowedViews={["overview"]}
                          />
                        </div>

                        {forecast ? (
                          <>
                            {/* 2. Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                              <StatCard 
                                label="Predicted Renewable" 
                                value={`${forecast.predictedRenewableMW.toFixed(1)} MW`} 
                                trend="AI Forecast" 
                                icon={<Leaf size={20} />} 
                                colorful 
                              />
                              <StatCard 
                                label="Live Consumption" 
                                value={`${liveConsumption.toFixed(1)} MW`} 
                                trend={`${Math.abs(liveConsumption - forecast.predictedDemandMW).toFixed(1)} MW ${liveConsumption > forecast.predictedDemandMW ? 'Surge' : 'Drop'}`} 
                                status={liveConsumption > forecast.predictedDemandMW ? "deficit" : "surplus"}
                                icon={<Zap size={20} />} 
                                colorful 
                              />
                              <StatCard 
                                label="Predicted Demand" 
                                value={`${forecast.predictedDemandMW.toFixed(1)} MW`} 
                                trend="AI Baseline" 
                                icon={<Navigation size={20} />} 
                              />
                              <StatCard 
                                label="Efficiency Score" 
                                value={`${forecast.metrics.efficiencyScore.toFixed(0)}%`} 
                                trend="Optimal" 
                                icon={<BarChart3 size={20} />} 
                              />
                            </div>

                            {/* Telemetry Bar */}
                            <TelemetryBar 
                              forecast={forecast} 
                              liveFrequency={liveFrequency} 
                              liveVoltage={liveVoltage} 
                              liveRenewable={liveRenewable} 
                              liveConsumption={liveConsumption} 
                            />

                            {/* 3. AI Forecast Graph */}
                            <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
                              <div className="flex items-center justify-between mb-8">
                                <div>
                                  <h3 className="text-lg font-bold">AI Forecast: Next 24 Hours</h3>
                                  <p className="text-xs text-white/30 font-mono uppercase tracking-widest mt-1">Demand vs Production Intelligence</p>
                                </div>
                                <div className="flex gap-6">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Predicted Demand</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Predicted Production</span>
                                  </div>
                                </div>
                              </div>
                              <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={forecast.forecast24h}>
                                    <defs>
                                      <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis 
                                      dataKey="time" 
                                      axisLine={false} 
                                      tickLine={false} 
                                      tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'monospace' }}
                                    />
                                    <YAxis 
                                      axisLine={false} 
                                      tickLine={false} 
                                      tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'monospace' }}
                                    />
                                    <Tooltip 
                                      contentStyle={{ 
                                        backgroundColor: '#0a0a0a', 
                                        borderRadius: '16px', 
                                        border: '1px solid rgba(255,255,255,0.1)', 
                                        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' 
                                      }}
                                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                      formatter={(value: number) => [`${value.toFixed(1)} MW`, ""]}
                                    />
                                    <Area type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" name="Demand" />
                                    <Area type="monotone" dataKey="production" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" name="Production" />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            {/* Recommendations & Distribution */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/5 shadow-2xl">
                                <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                                  <BarChartIcon size={16} className="text-emerald-500" />
                                  Sectoral Energy Distribution (Next 24h)
                                </h3>
                                <div className="h-[300px]">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={Object.entries(forecast.zoneWiseDemand).map(([name, value]) => ({ name, value }))}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                      <XAxis 
                                        dataKey="name" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} 
                                        tickFormatter={(val) => val.charAt(0).toUpperCase() + val.slice(1)}
                                      />
                                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} />
                                      <Tooltip 
                                        cursor={{ fill: 'white', opacity: 0.05 }} 
                                        contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0a0a0a', color: 'white' }} 
                                        formatter={(value: number) => [`${value.toFixed(1)} MW`, "Power Needed"]}
                                      />
                                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                        {Object.entries(forecast.zoneWiseDemand).map((_, index) => (
                                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#10b981' : '#3b82f6'} />
                                        ))}
                                      </Bar>
                                    </BarChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                              <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/5 shadow-2xl">
                                <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                                  <Zap size={16} className="text-yellow-500" />
                                  AI Recommendations
                                </h3>
                                <div className="space-y-4">
                                  {forecast.suggestions.map((s, i) => (
                                    <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-colors">
                                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                        <CheckCircle2 size={14} />
                                      </div>
                                      <p className="text-sm text-white/60 leading-relaxed group-hover:text-white transition-colors">{s}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                            <LayoutDashboard size={64} className="text-white/10 mb-6" />
                            <h3 className="text-xl font-bold">Welcome to Lumino City</h3>
                            <p className="text-white/40 max-w-md mt-2">Select a city to view real-time energy intelligence and AI-powered forecasts.</p>
                          </div>
                        )}
                      </motion.div>
                    </section>

                    {/* Energy Map Section */}
                    <section id="map" ref={sectionRefs.map} className="scroll-mt-24">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-3xl font-display font-bold">Energy Map</h2>
                          <div className="px-4 py-2 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl text-[var(--primary)] text-xs font-bold uppercase tracking-widest">
                            Grid Topology
                          </div>
                        </div>
                        <div className="h-[70vh] rounded-2xl overflow-hidden shadow-xl border border-[var(--border)] relative bg-[var(--card-bg)]">
                          <IndiaMap 
                            onCitySelect={handleCitySelect} 
                            selectedCity={selectedCity} 
                            cityDemands={cityDemands} 
                            theme={theme} 
                            cities={availableCities} 
                            allowedViews={["transmission", "distribution", "night"]}
                          />
                        </div>

                        <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] card-shadow">
                          <div className="flex items-center justify-between mb-8">
                            <div>
                              <h3 className="text-lg font-bold">Substation Load Distribution</h3>
                              <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest mt-1">Sectoral Grid Utilization</p>
                            </div>
                            <MapIcon className="text-[var(--text-muted)]/20" size={24} />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="h-[300px] relative">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: 'Airport', value: forecast?.zoneWiseDemand.airport || 30, color: '#3b82f6' },
                                      { name: 'Downtown', value: forecast?.zoneWiseDemand.downtown || 45, color: '#ef4444' },
                                      { name: 'Suburbs', value: forecast?.zoneWiseDemand.suburbs || 25, color: '#10b981' },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                  >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#ef4444" />
                                    <Cell fill="#10b981" />
                                  </Pie>
                                  <Tooltip 
                                    contentStyle={{ backgroundColor: 'var(--card-bg)', borderRadius: '12px', border: '1px solid var(--border)' }}
                                    formatter={(value: number) => [`${value.toFixed(1)} MW`, ""]}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-display font-bold">
                                  {((forecast?.zoneWiseDemand.airport || 0) + (forecast?.zoneWiseDemand.downtown || 0) + (forecast?.zoneWiseDemand.suburbs || 0)).toFixed(0)}
                                </span>
                                <span className="text-[8px] text-[var(--text-muted)] uppercase font-mono tracking-widest">Total MW</span>
                              </div>
                            </div>

                            <div className="space-y-6">
                              {[
                                { label: "AIRPORT", name: "International Airport", load: forecast?.zoneWiseDemand.airport || 85, color: "bg-blue-500", icon: <Navigation size={14} /> },
                                { label: "DOWNTOWN", name: "Downtown Core", load: forecast?.zoneWiseDemand.downtown || 92, color: "bg-red-500", icon: <Building2 size={14} /> },
                                { label: "SUBURBS", name: "Residential Suburbs", load: forecast?.zoneWiseDemand.suburbs || 45, color: "bg-emerald-500", icon: <Sun size={14} /> },
                              ].map((zone, i) => (
                                <div key={i} className="bg-[var(--text)]/5 border border-[var(--border)] rounded-xl p-4 flex items-center gap-4">
                                  <div className={`w-10 h-10 rounded-lg ${zone.color}/10 flex items-center justify-center text-${zone.color.split('-')[1]}-500`}>
                                    {zone.icon}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="text-sm font-bold">{zone.name}</h4>
                                      <span className="text-xs font-mono font-bold">{zone.load.toFixed(1)} MW</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-[var(--text)]/5 rounded-full overflow-hidden">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(zone.load / ((forecast?.zoneWiseDemand.airport || 1) + (forecast?.zoneWiseDemand.downtown || 1) + (forecast?.zoneWiseDemand.suburbs || 1))) * 100}%` }}
                                        className={`h-full ${zone.color}`}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </section>

                    {/* Standings Section */}
                    <section id="standings" ref={sectionRefs.standings} className="scroll-mt-24">
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] card-shadow"
                      >
                        <div className="flex items-center justify-between mb-8">
                          <h2 className="text-3xl font-display font-bold">Sustainability Rankings</h2>
                          <div className="flex items-center gap-2 text-amber-500">
                            <Trophy size={24} />
                            <span className="text-sm font-bold uppercase tracking-widest">Top Performers</span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {(forecast?.standings || availableCities
                            .filter(c => c.sustainabilityScore)
                            .map(c => ({ 
                              name: c.name, 
                              renewableFulfillment: c.sustainabilityScore || 0,
                              demandMW: 0,
                              renewableMW: 0
                            })))
                            .sort((a, b) => b.renewableFulfillment - a.renewableFulfillment)
                            .map((city, i) => (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                key={city.name} 
                                className="flex items-center gap-6 p-5 rounded-xl bg-[var(--text)]/5 border border-[var(--border)] hover:border-[var(--primary)]/30 transition-all group"
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                                  i === 0 ? 'bg-amber-400 text-black' : 
                                  i === 1 ? 'bg-slate-300 text-black' : 
                                  i === 2 ? 'bg-amber-700 text-white' : 
                                  'bg-[var(--card-bg)] text-[var(--text-muted)]'
                                }`}>
                                  {i + 1}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold">{city.name}</h4>
                                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Smart City Node</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-display font-bold text-[var(--primary)]">{city.renewableFulfillment.toFixed(1)}%</p>
                                  <p className="text-[10px] text-[var(--text-muted)] uppercase font-mono">Renewable Share</p>
                                </div>
                                <div className="w-24 h-1.5 bg-[var(--text)]/5 rounded-full overflow-hidden ml-4">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${city.renewableFulfillment}%` }}
                                    className="h-full bg-[var(--primary)]"
                                  />
                                </div>
                              </motion.div>
                            ))}
                        </div>
                      </motion.div>
                    </section>

                    {/* Forecast Section */}
                    <section id="forecast" ref={sectionRefs.forecast} className="scroll-mt-24">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-3xl font-display font-bold">Energy Forecast</h2>
                          <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-500 text-xs font-bold uppercase tracking-widest">
                            Predictive Intelligence
                          </div>
                        </div>
                        {forecast ? (
                          <>
                            <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] card-shadow relative overflow-hidden group">
                              <div className="flex items-center justify-between mb-8">
                                <div>
                                  <h3 className="text-lg font-bold">24-Hour Grid Intelligence</h3>
                                  <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest mt-1">Predictive Analysis</p>
                                </div>
                                <div className="flex gap-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Demand</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">Supply</span>
                                  </div>
                                </div>
                              </div>
                              <div className="h-[350px]">
                                <ResponsiveContainer width="100%" height="100%">
                                  <AreaChart data={forecast.forecast24h}>
                                    <defs>
                                      <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                      </linearGradient>
                                      <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                      </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                    <XAxis 
                                      dataKey="time" 
                                      axisLine={false} 
                                      tickLine={false} 
                                      tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }}
                                      tickFormatter={(time) => {
                                        const hour = parseInt(time.split(':')[0]);
                                        const ampm = hour >= 12 ? 'PM' : 'AM';
                                        const h12 = hour % 12 || 12;
                                        return `${h12} ${ampm}`;
                                      }}
                                    />
                                    <YAxis 
                                      axisLine={false} 
                                      tickLine={false} 
                                      tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }}
                                    />
                                    <Tooltip 
                                      contentStyle={{ 
                                        backgroundColor: 'var(--card-bg)', 
                                        borderRadius: '12px', 
                                        border: '1px solid var(--border)', 
                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                                      }}
                                      itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                      formatter={(value: number) => [value.toFixed(1), "MW"]}
                                    />
                                    <Area type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" name="Demand" />
                                    <Area type="monotone" dataKey="production" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProd)" name="Supply" />
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] card-shadow lg:col-span-2">
                                <div className="flex items-center justify-between mb-8">
                                  <div>
                                    <h3 className="text-lg font-bold">Energy Allocation</h3>
                                    <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest mt-1">Source Distribution</p>
                                  </div>
                                  <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                                    <Leaf size={20} />
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                  <div className="relative w-full aspect-square max-w-[200px] mx-auto">
                                    <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                        <Pie
                                          data={[
                                            { name: 'Solar', value: forecast.renewableOutput.solar, color: '#facc15' },
                                            { name: 'Wind', value: forecast.renewableOutput.wind, color: '#10b981' },
                                            { name: 'Hydro', value: forecast.renewableOutput.hydro, color: '#06b6d4' },
                                            { name: 'Grid Import', value: forecast.renewableOutput.gridImport || 0, color: '#6366f1' },
                                          ]}
                                          cx="50%"
                                          cy="50%"
                                          innerRadius={60}
                                          outerRadius={80}
                                          paddingAngle={5}
                                          dataKey="value"
                                        >
                                          {[
                                            { color: '#facc15' },
                                            { color: '#10b981' },
                                            { color: '#06b6d4' },
                                            { color: '#6366f1' },
                                          ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                          ))}
                                        </Pie>
                                      </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                      <span className="text-3xl font-display font-bold">{(( (forecast.renewableOutput.solar + forecast.renewableOutput.wind + forecast.renewableOutput.hydro) / (forecast.renewableOutput.solar + forecast.renewableOutput.wind + forecast.renewableOutput.hydro + (forecast.renewableOutput.gridImport || 0))) * 100).toFixed(1)}%</span>
                                      <span className="text-[8px] text-[var(--text-muted)] uppercase font-mono tracking-widest">Renewable</span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    {[
                                      { name: 'Solar Power', value: forecast.renewableOutput.solar, color: 'bg-yellow-400' },
                                      { name: 'Wind Energy', value: forecast.renewableOutput.wind, color: 'bg-emerald-400' },
                                      { name: 'Hydro Electric', value: forecast.renewableOutput.hydro, color: 'bg-cyan-400' },
                                      { name: 'Grid Import', value: forecast.renewableOutput.gridImport || 0, color: 'bg-indigo-500' },
                                    ].map((item, i) => (
                                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--text)]/5 border border-transparent hover:border-[var(--border)] transition-colors">
                                        <div className="flex items-center gap-3">
                                          <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                          <span className="text-xs font-bold">{item.name}</span>
                                        </div>
                                        <span className="text-xs font-mono font-bold">{item.value.toFixed(1)} MW</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-8">
                                <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] card-shadow">
                                  <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-500">
                                      <SunMedium size={18} />
                                    </div>
                                    <h3 className="text-sm font-bold">Weather Impact</h3>
                                  </div>
                                  <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs text-[var(--text-muted)]">Temperature</p>
                                    <p className="text-lg font-display font-bold">{forecast.weatherImpact.temperature.toFixed(0)}°C</p>
                                  </div>
                                  <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                                    <p className="text-[8px] text-yellow-500 font-bold uppercase tracking-widest mb-1">Grid Alert</p>
                                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{forecast.weatherImpact.alert}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                            <BarChartIcon size={64} className="text-[var(--text)]/10 mb-6" />
                            <h3 className="text-xl font-bold">No Forecast Data</h3>
                            <p className="text-[var(--text)]/40 max-w-md mt-2">Please select a city to generate AI-driven energy consumption and production forecasts.</p>
                          </div>
                        )}
                      </motion.div>
                    </section>

                    {/* Live Grid Section */}
                    <section id="live" ref={sectionRefs.live} className="scroll-mt-24">
                      {forecast && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="space-y-8"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-3xl font-display font-bold">Live Grid Telemetry</h2>
                            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-bold uppercase tracking-widest">
                              High-Frequency Monitoring
                            </div>
                          </div>
                          <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/5 shadow-2xl">
                            <div className="flex items-center justify-between mb-8">
                              <div>
                                <h3 className="text-lg font-bold">Next Hour Intelligence</h3>
                                <p className="text-xs text-white/30 font-mono uppercase tracking-widest mt-1">Real-Time Sync</p>
                              </div>
                              <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Live Demand</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Live Renewable</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Renewable Share %</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="h-[400px]">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={liveDataHistory}>
                                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                  <XAxis 
                                    dataKey="time" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'monospace' }}
                                  />
                                  <YAxis 
                                    yAxisId="left"
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'monospace' }}
                                  />
                                  <YAxis 
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'monospace' }}
                                  />
                                  <Tooltip 
                                    contentStyle={{ 
                                      backgroundColor: '#0a0a0a', 
                                      borderRadius: '16px', 
                                      border: '1px solid rgba(255,255,255,0.1)', 
                                    }}
                                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    formatter={(value: number) => [value.toFixed(1), ""]}
                                  />
                                  <Line yAxisId="left" type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={3} dot={false} name="Live Demand" isAnimationActive={false} />
                                  <Line yAxisId="left" type="monotone" dataKey="renewable" stroke="#10b981" strokeWidth={3} dot={false} name="Live Renewable" isAnimationActive={false} />
                                  <Line yAxisId="right" type="monotone" dataKey="share" stroke="#f59e0b" strokeWidth={2} dot={false} name="Renewable Share %" isAnimationActive={false} />
                                  
                                  {/* AI Baselines */}
                                  <Line yAxisId="left" type="monotone" dataKey="predictedDemand" stroke="#3b82f6" strokeWidth={1} strokeDasharray="5 5" dot={false} name="AI Predicted Demand" opacity={0.3} isAnimationActive={false} />
                                  <Line yAxisId="left" type="monotone" dataKey="predictedRenewable" stroke="#10b981" strokeWidth={1} strokeDasharray="5 5" dot={false} name="AI Predicted Renewable" opacity={0.3} isAnimationActive={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          
                          <TelemetryBar 
                            forecast={forecast} 
                            liveFrequency={liveFrequency} 
                            liveVoltage={liveVoltage} 
                            liveRenewable={liveRenewable} 
                            liveConsumption={liveConsumption} 
                          />
                        </motion.div>
                      )}
                    </section>

                    {/* AI Prediction Section */}
                    <section id="prediction" ref={sectionRefs.prediction} className="scroll-mt-24">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-3xl font-display font-bold">AI Prediction Engine</h2>
                          <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-500 text-xs font-bold uppercase tracking-widest">
                            Neural Processing
                          </div>
                        </div>
                        {forecast ? (
                          <div className="max-w-3xl mx-auto">
                            <div className="bg-[var(--card-bg)] rounded-2xl p-10 border border-[var(--border)] card-shadow">
                              <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                                  <BarChart3 size={24} />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold">Model Confidence</h3>
                                  <p className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest mt-1">Neural Engine Reliability</p>
                                </div>
                              </div>
                              <div className="space-y-10">
                                <DetailMetric 
                                  label="Confidence Level" 
                                  value={`${(forecast.predictionDetails.confidenceLevel < 1 ? forecast.predictionDetails.confidenceLevel * 100 : forecast.predictionDetails.confidenceLevel).toFixed(1)}%`} 
                                  percent={forecast.predictionDetails.confidenceLevel < 1 ? forecast.predictionDetails.confidenceLevel * 100 : forecast.predictionDetails.confidenceLevel}
                                  color="var(--primary)" 
                                />
                                <DetailMetric 
                                  label="Data Quality Score" 
                                  value={`${(forecast.predictionDetails.dataQualityScore < 1 ? forecast.predictionDetails.dataQualityScore * 100 : forecast.predictionDetails.dataQualityScore).toFixed(0)}/100`} 
                                  percent={forecast.predictionDetails.dataQualityScore < 1 ? forecast.predictionDetails.dataQualityScore * 100 : forecast.predictionDetails.dataQualityScore}
                                  color="#10b981" 
                                />
                                <DetailMetric 
                                  label="Error Margin" 
                                  value={`±${(forecast.predictionDetails.errorMarginPercent < 1 ? forecast.predictionDetails.errorMarginPercent * 100 : forecast.predictionDetails.errorMarginPercent).toFixed(1)}%`} 
                                  percent={forecast.predictionDetails.errorMarginPercent < 1 ? forecast.predictionDetails.errorMarginPercent * 100 : forecast.predictionDetails.errorMarginPercent} 
                                  color="#f59e0b" 
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-[50vh] flex flex-col items-center justify-center text-center">
                            <Cpu size={64} className="text-[var(--text)]/10 mb-6" />
                            <h3 className="text-xl font-bold">AI Engine Idle</h3>
                            <p className="text-[var(--text-muted)] max-w-md mt-2">Select a city to activate the neural prediction engine.</p>
                          </div>
                        )}
                      </motion.div>
                    </section>

                    {/* Chat Section */}
                    <section id="chat" ref={sectionRefs.chat} className="scroll-mt-24">
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="h-[75vh]"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-3xl font-display font-bold">Lumino AI Assistant</h2>
                          <div className="px-4 py-2 bg-blue-500/10 border border-blue-400/20 rounded-xl text-blue-400 text-xs font-bold uppercase tracking-widest">
                            Neural Link
                          </div>
                        </div>
                        <div className="h-full bg-[var(--card-bg)] rounded-3xl border border-[var(--border)] overflow-hidden shadow-2xl">
                          <ChatInterface 
                            city={selectedCity} 
                            forecast={forecast} 
                            historicalData={cityHistoricalData}
                            messages={chatMessages}
                            setMessages={setChatMessages}
                            isLoading={isChatLoading}
                            setIsLoading={setIsChatLoading}
                          />
                        </div>
                      </motion.div>
                    </section>
                  </div>
                )}
              </div>
            </div>
          </main>

            {/* Futuristic Robot Chatbot Trigger Icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setChatOpen(!chatOpen)}
              className="absolute bottom-8 right-8 z-[110] w-16 h-16 rounded-full bg-blue-600/20 backdrop-blur-2xl border border-blue-400/30 shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center overflow-hidden group"
            >
              <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute inset-0 w-10 h-10 -m-1 border-2 border-dashed border-blue-400/50 rounded-full"
                />
                <Cpu size={28} className="text-blue-400 relative z-10" />
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Zap size={12} className="text-yellow-400 fill-yellow-400" />
                </motion.div>
              </div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-black animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChatInterface({ 
  city, 
  forecast, 
  historicalData, 
  messages, 
  setMessages, 
  isLoading, 
  setIsLoading, 
  onClose 
}: { 
  city: string | null, 
  forecast: ForecastOutput | null, 
  historicalData: HistoricalData[], 
  messages: { role: "user" | "ai", content: string }[],
  setMessages: React.Dispatch<React.SetStateAction<{ role: "user" | "ai", content: string }[]>>,
  isLoading: boolean,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  onClose?: () => void 
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const aiResponse = await getChatResponse(userMsg, messages, { city, forecast, historicalData });
      setMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "I am not able to fetch the required answer." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass rounded-3xl h-full flex flex-col overflow-hidden shadow-2xl border border-[var(--glass-border)]">
      {!onClose && (
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--card-bg)]">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-sm font-bold tracking-tight">Lumino AI Assistant</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] text-emerald-500 font-mono uppercase tracking-widest font-bold">Neural Engine Ready</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[var(--bg)]/30 scroll-smooth">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[var(--primary)] text-white rounded-tr-none' 
                : 'bg-[var(--card-bg)] text-[var(--text)] border border-[var(--glass-border)] rounded-tl-none'
            }`}>
              <div className="text-sm leading-relaxed prose prose-invert max-w-none">
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[var(--card-bg)] p-4 rounded-2xl rounded-tl-none border border-[var(--border)] flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-[var(--card-bg)] border-t border-[var(--border)]">
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about city energy data..."
            className="w-full bg-[var(--text)]/5 border border-[var(--border)] rounded-xl px-4 py-3 pr-12 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]/40 focus:outline-none focus:border-[var(--primary)]/50 transition-all"
          />
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-2 text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-lg transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
          </button>
        </div>
        <p className="text-[8px] text-[var(--text-muted)] text-center mt-3 uppercase tracking-widest font-mono">
          Powered by Gemini AI Engine
        </p>
      </form>
    </div>
  );
}

function StatCard({ label, value, trend, icon, status, colorful }: { label: string, value: string, trend?: string, icon: React.ReactNode, status?: "surplus" | "deficit", colorful?: boolean }) {
  return (
    <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-10 h-10 rounded-xl ${colorful ? 'bg-emerald-500/10 text-emerald-500' : 'bg-white/5 text-white/40'} flex items-center justify-center shadow-inner`}>
          {icon}
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded-md text-[9px] font-bold tracking-wider uppercase ${status === 'deficit' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2">{label}</p>
        <p className="text-3xl font-display font-bold text-white tracking-tight">{value}</p>
      </div>
      
      {/* Subtle background glow */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-10 transition-opacity group-hover:opacity-20 ${colorful ? 'bg-emerald-500' : 'bg-blue-500'}`} />
    </div>
  );
}

function TelemetryBar({ forecast, liveFrequency, liveVoltage, liveRenewable, liveConsumption }: { 
  forecast: ForecastOutput, 
  liveFrequency: number, 
  liveVoltage: number, 
  liveRenewable: number,
  liveConsumption: number
}) {
  return (
    <div className="bg-[#0a0a0a] rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.3em] font-bold">Live Grid Telemetry</h3>
        </div>
        <p className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Last Update: {new Date().toLocaleTimeString()}</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
        <div>
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-3">Grid Frequency</p>
          <p className="text-2xl font-display font-bold text-emerald-400">{liveFrequency.toFixed(2)} <span className="text-sm font-normal opacity-50">Hz</span></p>
        </div>
        <div>
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-3">Voltage Level</p>
          <p className="text-2xl font-display font-bold text-emerald-400">{liveVoltage.toFixed(1)} <span className="text-sm font-normal opacity-50">kV</span></p>
        </div>
        <div>
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-3">Live Renewable</p>
          <p className="text-2xl font-display font-bold text-emerald-400">{liveRenewable.toFixed(1)} <span className="text-sm font-normal opacity-50">MW</span></p>
        </div>
        <div>
          <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-3">System Load</p>
          <p className="text-2xl font-display font-bold text-emerald-400">
            {((liveConsumption / (forecast.predictedDemandMW * 1.12)) * 100).toFixed(1)} <span className="text-sm font-normal opacity-50">%</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon, label, collapsed }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, collapsed: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
        active 
          ? 'bg-[var(--primary)] text-white shadow-md' 
          : 'text-[var(--text-muted)] hover:bg-[var(--text)]/5 hover:text-[var(--text)]'
      }`}
    >
      <div className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
        {icon}
      </div>
      {!collapsed && <span className="font-medium text-sm">{label}</span>}
      {active && !collapsed && (
        <motion.div layoutId="nav-pill" className="ml-auto w-1 h-4 rounded-full bg-white/40" />
      )}
    </button>
  );
}

function DetailMetric({ label, value, percent, color }: { label: string, value: string, percent: number, color: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">{label}</span>
        <span className="text-xl font-display font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 w-full bg-[var(--text)]/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          className="h-full"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function FactorItem({ label, weight, description, icon, color }: { label: string, weight: string, description: string, icon?: React.ReactNode, color?: string }) {
  return (
    <div className="p-5 rounded-xl bg-[var(--text)]/5 border border-[var(--border)] group hover:border-[var(--primary)]/30 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color || 'bg-blue-500'} text-white shadow-sm`}>
            {icon || <Zap size={18} />}
          </div>
          <span className="font-bold text-sm">{label}</span>
        </div>
        <span className="text-xs font-mono font-bold px-2 py-1 bg-[var(--card-bg)] rounded-md border border-[var(--border)]">{weight}</span>
      </div>
      <p className="text-[10px] text-[var(--text-muted)] leading-relaxed">{description}</p>
    </div>
  );
}

function MetricItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-[10px] font-mono text-[var(--text)]/30 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-display font-bold text-[var(--primary)]">{value}</p>
      <div className="w-full h-1 bg-[var(--text)]/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "70%" }}
          className="h-full bg-[var(--primary)]/50"
        />
      </div>
    </div>
  );
}

