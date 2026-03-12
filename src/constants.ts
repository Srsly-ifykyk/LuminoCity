export const SMART_CITIES = [
  // Uttar Pradesh
  { name: "Lucknow", coordinates: [80.9462, 26.8467] as [number, number], substations: ["Sarojini Nagar 220 kV"], sustainabilityScore: 62 },
  { name: "Kanpur", coordinates: [80.3319, 26.4499] as [number, number], substations: ["Panki 220 kV"] },
  { name: "Prayagraj", coordinates: [81.8463, 25.4358] as [number, number], substations: ["Naini 220 kV"] },
  { name: "Varanasi", coordinates: [82.9739, 25.3176] as [number, number], substations: ["Varanasi 220 kV"] },
  { name: "Gorakhpur", coordinates: [83.3732, 26.7606] as [number, number], substations: ["Gorakhpur 220 kV"] },
  { name: "Raebareli", coordinates: [81.2408, 26.2254] as [number, number], substations: ["Rae Bareli 220 kV"] },
  { name: "Jhansi", coordinates: [78.5685, 25.4484] as [number, number], substations: ["Jhansi 220 kV"] },
  { name: "Aligarh", coordinates: [78.0880, 27.8974] as [number, number], substations: ["Aligarh 220 kV"] },
  { name: "Saharanpur", coordinates: [77.5510, 29.9640] as [number, number], substations: ["Saharanpur 220 kV"] },
  { name: "Bareilly", coordinates: [79.4126, 28.3670] as [number, number], substations: ["Bareilly 220 kV"] },
  { name: "Agra", coordinates: [78.0081, 27.1767] as [number, number], substations: ["Agra 220 kV"] },
  { name: "Rampur", coordinates: [79.0273, 28.8154] as [number, number], substations: ["Rampur 132 kV"] },
  { name: "Moradabad", coordinates: [78.7768, 28.8386] as [number, number], substations: ["Moradabad 220 kV"] },
  { name: "Meerut", coordinates: [77.7064, 28.9845] as [number, number], substations: ["Meerut 220 kV"] },

  // Tamil Nadu
  { name: "Chennai", coordinates: [80.2707, 13.0827] as [number, number], substations: ["North Chennai 400 kV"], sustainabilityScore: 74 },
  { name: "Coimbatore", coordinates: [76.9616, 11.0168] as [number, number], substations: ["Coimbatore 230 kV"] },
  { name: "Dindigul", coordinates: [77.9803, 10.3673] as [number, number], substations: ["Dindigul 230 kV"] },
  { name: "Erode", coordinates: [77.7172, 11.3410] as [number, number], substations: ["Erode 230 kV"] },
  { name: "Madurai", coordinates: [78.1198, 9.9252] as [number, number], substations: ["Madurai 230 kV"] },
  { name: "Salem", coordinates: [78.1460, 11.6643] as [number, number], substations: ["Salem 230 kV"] },
  { name: "Thanjavur", coordinates: [79.1378, 10.7870] as [number, number], substations: ["Thanjavur 230 kV"] },
  { name: "Thoothukudi", coordinates: [78.1348, 8.7139] as [number, number], substations: ["Tuticorin 230 kV"] },
  { name: "Tiruchirappalli", coordinates: [78.7047, 10.7905] as [number, number], substations: ["Trichy 230 kV"] },
  { name: "Tirunelveli", coordinates: [77.7567, 8.7139] as [number, number], substations: ["Tirunelveli 230 kV"] },
  { name: "Tiruppur", coordinates: [77.3411, 11.1085] as [number, number], substations: ["Tiruppur 230 kV"] },
  { name: "Vellore", coordinates: [79.1325, 12.9165] as [number, number], substations: ["Vellore 230 kV"] },

  // Maharashtra
  { name: "Pune", coordinates: [73.8567, 18.5204] as [number, number], substations: ["Pune 400 kV"], sustainabilityScore: 77 },
  { name: "Nagpur", coordinates: [79.0882, 21.1458] as [number, number], substations: ["Koradi 400 kV"] },
  { name: "Nashik", coordinates: [73.7898, 19.9975] as [number, number], substations: ["Nashik 220 kV"] },
  { name: "Aurangabad", coordinates: [75.3433, 19.8762] as [number, number], substations: ["Aurangabad 220 kV"] },
  { name: "Solapur", coordinates: [75.9064, 17.6599] as [number, number], substations: ["Solapur 220 kV"] },
  { name: "Amravati", coordinates: [77.7523, 20.9320] as [number, number], substations: ["Amravati 220 kV"] },
  { name: "Thane", coordinates: [72.9778, 19.2183] as [number, number], substations: ["Thane 220 kV"] },
  { name: "Kalyan-Dombivali", coordinates: [73.1305, 19.2403] as [number, number], substations: ["Kalyan 220 kV"] },

  // Karnataka
  { name: "Bengaluru", coordinates: [77.5946, 12.9716] as [number, number], substations: ["Nelamangala 400 kV"], sustainabilityScore: 81 },
  { name: "Mangaluru", coordinates: [74.8560, 12.9141] as [number, number], substations: ["Mangalore 220 kV"] },
  { name: "Belagavi", coordinates: [74.5089, 15.8497] as [number, number], substations: ["Belagavi 220 kV"] },
  { name: "Shivamogga", coordinates: [75.5681, 13.9299] as [number, number], substations: ["Shivamogga 220 kV"] },
  { name: "Hubbali-Dharwad", coordinates: [75.1240, 15.3647] as [number, number], substations: ["Hubli 220 kV"] },
  { name: "Tumakuru", coordinates: [77.1016, 13.3392] as [number, number], substations: ["Tumakuru 220 kV"] },
  { name: "Davanagere", coordinates: [75.9243, 14.4644] as [number, number], substations: ["Davanagere 220 kV"] },

  // Andhra Pradesh
  { name: "Amaravati", coordinates: [80.5135, 16.5745] as [number, number], substations: ["Vijayawada 400 kV"] },
  { name: "Visakhapatnam", coordinates: [83.2185, 17.6868] as [number, number], substations: ["Vizag 400 kV"] },
  { name: "Kakinada", coordinates: [82.2475, 16.9891] as [number, number], substations: ["Kakinada 220 kV"] },
  { name: "Tirupati", coordinates: [79.4192, 13.6288] as [number, number], substations: ["Tirupati 220 kV"] },

  // Kerala
  { name: "Thiruvananthapuram", coordinates: [76.9366, 8.5241] as [number, number], substations: ["Kazhakkoottam 220 kV"] },
  { name: "Kochi", coordinates: [76.2673, 9.9312] as [number, number], substations: ["Kalamassery 220 kV"] },

  // North / East / Northeast
  { name: "Patna", coordinates: [85.1376, 25.5941] as [number, number], substations: ["Patna 220 kV"] },
  { name: "Ludhiana", coordinates: [75.8573, 30.9010] as [number, number], substations: ["Ludhiana 220 kV"] },
  { name: "Raipur", coordinates: [81.6337, 21.2514] as [number, number], substations: ["Raipur 400 kV"] },
  { name: "Guwahati", coordinates: [91.7362, 26.1445] as [number, number], substations: ["Guwahati 220 kV"] },
  { name: "Shillong", coordinates: [91.8833, 25.5667] as [number, number], substations: ["Shillong 132 kV"] },
  { name: "Agartala", coordinates: [91.2868, 23.8315] as [number, number], substations: ["Agartala 132 kV"] },
  { name: "Kohima", coordinates: [94.1086, 25.6751] as [number, number], substations: ["Kohima 132 kV"] },

  // Gujarat
  { name: "Ahmedabad", coordinates: [72.5714, 23.0225] as [number, number], substations: ["Ahmedabad 400 kV"] },
  { name: "Surat", coordinates: [72.8311, 21.1702] as [number, number], substations: ["Surat 220 kV"] },
  { name: "Vadodara", coordinates: [73.1812, 22.3072] as [number, number], substations: ["Vadodara 220 kV"] },
  { name: "Rajkot", coordinates: [70.8022, 22.3039] as [number, number], substations: ["Rajkot 220 kV"] },

  // Rajasthan
  { name: "Jaipur", coordinates: [75.7873, 26.9124] as [number, number], substations: ["Jaipur 400 kV"] },
  { name: "Jodhpur", coordinates: [73.0243, 26.2389] as [number, number], substations: ["Jodhpur 220 kV"] },
  { name: "Udaipur", coordinates: [73.7125, 24.5854] as [number, number], substations: ["Udaipur 220 kV"] },

  // Madhya Pradesh
  { name: "Bhopal", coordinates: [77.4126, 23.2599] as [number, number], substations: ["Bhopal 400 kV"] },
  { name: "Indore", coordinates: [75.8577, 22.7196] as [number, number], substations: ["Indore 220 kV"] },
  { name: "Gwalior", coordinates: [78.1772, 26.2124] as [number, number], substations: ["Gwalior 220 kV"] },

  // West Bengal
  { name: "Kolkata", coordinates: [88.3639, 22.5726] as [number, number], substations: ["Kolkata 400 kV"] },
  { name: "Durgapur", coordinates: [87.3215, 23.4846] as [number, number], substations: ["Durgapur 220 kV"] },
  { name: "Siliguri", coordinates: [88.4236, 26.7271] as [number, number], substations: ["Siliguri 220 kV"] },

  // Telangana
  { name: "Hyderabad", coordinates: [78.4867, 17.3850] as [number, number], substations: ["Hyderabad 400 kV"], sustainabilityScore: 79 },
  { name: "Warangal", coordinates: [79.5941, 17.9689] as [number, number], substations: ["Warangal 220 kV"] },

  // Odisha
  { name: "Bhubaneswar", coordinates: [85.8245, 20.2961] as [number, number], substations: ["Bhubaneswar 400 kV"] },
  { name: "Cuttack", coordinates: [85.8792, 20.4625] as [number, number], substations: ["Cuttack 220 kV"] },

  // Punjab
  { name: "Amritsar", coordinates: [74.8723, 31.6340] as [number, number], substations: ["Amritsar 220 kV"] },
  { name: "Jalandhar", coordinates: [75.5762, 31.3260] as [number, number], substations: ["Jalandhar 220 kV"] },

  // Haryana
  { name: "Faridabad", coordinates: [77.3178, 28.4089] as [number, number], substations: ["Faridabad 220 kV"] },
  { name: "Gurugram", coordinates: [77.0266, 28.4595] as [number, number], substations: ["Gurugram 400 kV"] },

  // Bihar
  { name: "Muzaffarpur", coordinates: [85.3910, 26.1209] as [number, number], substations: ["Muzaffarpur 220 kV"] },
  { name: "Bhagalpur", coordinates: [87.0067, 25.2425] as [number, number], substations: ["Bhagalpur 220 kV"] },
  { name: "Gaya", coordinates: [85.0002, 24.7914] as [number, number], substations: ["Gaya 220 kV"] },

  // West Bengal
  { name: "Asansol", coordinates: [86.9746, 23.6739] as [number, number], substations: ["Asansol 220 kV"] },
];

export const SUBSTATIONS = [
  // UP
  { name: "Sarojini Nagar 220 kV", coordinates: [80.88, 26.75] as [number, number], city: "Lucknow" },
  { name: "Panki 220 kV", coordinates: [80.24, 26.48] as [number, number], city: "Kanpur" },
  { name: "Naini 220 kV", coordinates: [81.85, 25.38] as [number, number], city: "Prayagraj" },
  { name: "Varanasi 220 kV", coordinates: [82.95, 25.35] as [number, number], city: "Varanasi" },
  { name: "Gorakhpur 220 kV", coordinates: [83.40, 26.78] as [number, number], city: "Gorakhpur" },
  { name: "Rae Bareli 220 kV", coordinates: [81.25, 26.25] as [number, number], city: "Raebareli" },
  { name: "Jhansi 220 kV", coordinates: [78.58, 25.45] as [number, number], city: "Jhansi" },
  { name: "Aligarh 220 kV", coordinates: [78.10, 27.92] as [number, number], city: "Aligarh" },
  { name: "Saharanpur 220 kV", coordinates: [77.58, 29.98] as [number, number], city: "Saharanpur" },
  { name: "Bareilly 220 kV", coordinates: [79.45, 28.40] as [number, number], city: "Bareilly" },
  { name: "Agra 220 kV", coordinates: [78.05, 27.20] as [number, number], city: "Agra" },
  { name: "Rampur 132 kV", coordinates: [79.05, 28.85] as [number, number], city: "Rampur" },
  { name: "Moradabad 220 kV", coordinates: [78.80, 28.85] as [number, number], city: "Moradabad" },
  { name: "Meerut 220 kV", coordinates: [77.75, 29.02] as [number, number], city: "Meerut" },

  // TN
  { name: "North Chennai 400 kV", coordinates: [80.30, 13.20] as [number, number], city: "Chennai" },
  { name: "Coimbatore 230 kV", coordinates: [77.00, 11.05] as [number, number], city: "Coimbatore" },
  { name: "Dindigul 230 kV", coordinates: [78.00, 10.40] as [number, number], city: "Dindigul" },
  { name: "Erode 230 kV", coordinates: [77.75, 11.38] as [number, number], city: "Erode" },
  { name: "Madurai 230 kV", coordinates: [78.15, 9.95] as [number, number], city: "Madurai" },
  { name: "Salem 230 kV", coordinates: [78.18, 11.70] as [number, number], city: "Salem" },
  { name: "Thanjavur 230 kV", coordinates: [79.15, 10.82] as [number, number], city: "Thanjavur" },
  { name: "Tuticorin 230 kV", coordinates: [78.15, 8.75] as [number, number], city: "Thoothukudi" },
  { name: "Trichy 230 kV", coordinates: [78.75, 10.82] as [number, number], city: "Tiruchirappalli" },
  { name: "Tirunelveli 230 kV", coordinates: [77.80, 8.75] as [number, number], city: "Tirunelveli" },
  { name: "Tiruppur 230 kV", coordinates: [77.38, 11.15] as [number, number], city: "Tiruppur" },
  { name: "Vellore 230 kV", coordinates: [79.15, 12.95] as [number, number], city: "Vellore" },

  // MH
  { name: "Pune 400 kV", coordinates: [73.90, 18.55] as [number, number], city: "Pune" },
  { name: "Koradi 400 kV", coordinates: [79.15, 21.20] as [number, number], city: "Nagpur" },
  { name: "Nashik 220 kV", coordinates: [73.85, 20.05] as [number, number], city: "Nashik" },
  { name: "Aurangabad 220 kV", coordinates: [75.40, 19.92] as [number, number], city: "Aurangabad" },
  { name: "Solapur 220 kV", coordinates: [75.95, 17.70] as [number, number], city: "Solapur" },
  { name: "Amravati 220 kV", coordinates: [77.80, 20.98] as [number, number], city: "Amravati" },
  { name: "Thane 220 kV", coordinates: [73.02, 19.25] as [number, number], city: "Thane" },
  { name: "Kalyan 220 kV", coordinates: [73.18, 19.28] as [number, number], city: "Kalyan-Dombivali" },

  // KA
  { name: "Nelamangala 400 kV", coordinates: [77.39, 13.10] as [number, number], city: "Bengaluru" },
  { name: "Mangalore 220 kV", coordinates: [74.90, 12.95] as [number, number], city: "Mangaluru" },
  { name: "Belagavi 220 kV", coordinates: [74.55, 15.88] as [number, number], city: "Belagavi" },
  { name: "Shivamogga 220 kV", coordinates: [75.62, 13.98] as [number, number], city: "Shivamogga" },
  { name: "Hubli 220 kV", coordinates: [75.18, 15.40] as [number, number], city: "Hubbali-Dharwad" },
  { name: "Tumakuru 220 kV", coordinates: [77.15, 13.38] as [number, number], city: "Tumakuru" },
  { name: "Davanagere 220 kV", coordinates: [75.98, 14.50] as [number, number], city: "Davanagere" },

  // AP
  { name: "Vijayawada 400 kV", coordinates: [80.64, 16.50] as [number, number], city: "Amaravati" },
  { name: "Vizag 400 kV", coordinates: [83.25, 17.76] as [number, number], city: "Visakhapatnam" },
  { name: "Kakinada 220 kV", coordinates: [82.28, 17.02] as [number, number], city: "Kakinada" },
  { name: "Tirupati 220 kV", coordinates: [79.51, 13.64] as [number, number], city: "Tirupati" },

  // KL
  { name: "Kazhakkoottam 220 kV", coordinates: [76.88, 8.55] as [number, number], city: "Thiruvananthapuram" },
  { name: "Kalamassery 220 kV", coordinates: [76.32, 10.05] as [number, number], city: "Kochi" },

  // GJ
  { name: "Ahmedabad 400 kV", coordinates: [72.60, 23.05] as [number, number], city: "Ahmedabad" },
  { name: "Surat 220 kV", coordinates: [72.85, 21.20] as [number, number], city: "Surat" },
  { name: "Vadodara 220 kV", coordinates: [73.20, 22.35] as [number, number], city: "Vadodara" },
  { name: "Rajkot 220 kV", coordinates: [70.85, 22.35] as [number, number], city: "Rajkot" },

  // RJ
  { name: "Jaipur 400 kV", coordinates: [75.82, 26.95] as [number, number], city: "Jaipur" },
  { name: "Jodhpur 220 kV", coordinates: [73.05, 26.28] as [number, number], city: "Jodhpur" },
  { name: "Udaipur 220 kV", coordinates: [73.75, 24.62] as [number, number], city: "Udaipur" },

  // MP
  { name: "Bhopal 400 kV", coordinates: [77.45, 23.30] as [number, number], city: "Bhopal" },
  { name: "Indore 220 kV", coordinates: [75.90, 22.75] as [number, number], city: "Indore" },
  { name: "Gwalior 220 kV", coordinates: [78.20, 26.25] as [number, number], city: "Gwalior" },

  // WB
  { name: "Kolkata 400 kV", coordinates: [88.40, 22.60] as [number, number], city: "Kolkata" },
  { name: "Durgapur 220 kV", coordinates: [87.35, 23.50] as [number, number], city: "Durgapur" },
  { name: "Siliguri 220 kV", coordinates: [88.45, 26.75] as [number, number], city: "Siliguri" },

  // TS
  { name: "Hyderabad 400 kV", coordinates: [78.52, 17.42] as [number, number], city: "Hyderabad" },
  { name: "Warangal 220 kV", coordinates: [79.62, 17.98] as [number, number], city: "Warangal" },

  // OR
  { name: "Bhubaneswar 400 kV", coordinates: [85.85, 20.32] as [number, number], city: "Bhubaneswar" },
  { name: "Cuttack 220 kV", coordinates: [85.90, 20.48] as [number, number], city: "Cuttack" },

  // PB
  { name: "Amritsar 220 kV", coordinates: [74.90, 31.65] as [number, number], city: "Amritsar" },
  { name: "Jalandhar 220 kV", coordinates: [75.60, 31.35] as [number, number], city: "Jalandhar" },

  // HR
  { name: "Faridabad 220 kV", coordinates: [77.35, 28.42] as [number, number], city: "Faridabad" },
  { name: "Gurugram 400 kV", coordinates: [77.05, 28.48] as [number, number], city: "Gurugram" },

  // BR
  { name: "Muzaffarpur 220 kV", coordinates: [85.42, 26.15] as [number, number], city: "Muzaffarpur" },
  { name: "Bhagalpur 220 kV", coordinates: [87.05, 25.28] as [number, number], city: "Bhagalpur" },
  { name: "Gaya 220 kV", coordinates: [85.05, 24.82] as [number, number], city: "Gaya" },

  // WB
  { name: "Asansol 220 kV", coordinates: [87.00, 23.70] as [number, number], city: "Asansol" },

  // Others
  { name: "Patna 220 kV", coordinates: [85.18, 25.62] as [number, number], city: "Patna" },
  { name: "Ludhiana 220 kV", coordinates: [75.90, 30.95] as [number, number], city: "Ludhiana" },
  { name: "Raipur 400 kV", coordinates: [81.68, 21.30] as [number, number], city: "Raipur" },
  { name: "Guwahati 220 kV", coordinates: [91.78, 26.18] as [number, number], city: "Guwahati" },
  { name: "Shillong 132 kV", coordinates: [91.92, 25.60] as [number, number], city: "Shillong" },
  { name: "Agartala 132 kV", coordinates: [91.32, 23.86] as [number, number], city: "Agartala" },
  { name: "Kohima 132 kV", coordinates: [94.15, 25.72] as [number, number], city: "Kohima" },
];

export const POWER_SOURCES = [
  // UP Plants
  { name: "Anpara Thermal", type: "non-renewable", coordinates: [82.78, 24.20] as [number, number], connectedTo: ["Sarojini Nagar 220 kV", "Varanasi 220 kV"] },
  { name: "Rihand Super Thermal", type: "non-renewable", coordinates: [82.79, 24.02] as [number, number], connectedTo: ["Sarojini Nagar 220 kV", "Naini 220 kV"] },
  { name: "Obra Hydroelectric", type: "renewable", coordinates: [82.98, 24.42] as [number, number], connectedTo: ["Varanasi 220 kV", "Gorakhpur 220 kV"] },
  { name: "Matatila Hydroelectric", type: "renewable", coordinates: [78.38, 25.10] as [number, number], connectedTo: ["Jhansi 220 kV"] },
  { name: "Panki Thermal", type: "non-renewable", coordinates: [80.24, 26.48] as [number, number], connectedTo: ["Panki 220 kV"] },
  { name: "Parichha Thermal", type: "non-renewable", coordinates: [78.76, 25.51] as [number, number], connectedTo: ["Panki 220 kV", "Jhansi 220 kV", "Agra 220 kV"] },
  { name: "Meja Thermal", type: "non-renewable", coordinates: [81.88, 25.14] as [number, number], connectedTo: ["Naini 220 kV"] },
  { name: "Vindhyachal Super Thermal", type: "non-renewable", coordinates: [82.67, 24.10] as [number, number], connectedTo: ["Varanasi 220 kV"] },
  { name: "Gorakhpur Thermal", type: "non-renewable", coordinates: [83.37, 26.76] as [number, number], connectedTo: ["Gorakhpur 220 kV"] },
  { name: "Unchahar Thermal", type: "non-renewable", coordinates: [81.31, 25.91] as [number, number], connectedTo: ["Rae Bareli 220 kV"] },
  { name: "Harduaganj Thermal", type: "non-renewable", coordinates: [78.13, 28.02] as [number, number], connectedTo: ["Aligarh 220 kV", "Bareilly 220 kV", "Rampur 132 kV", "Moradabad 220 kV"] },
  { name: "Dadri Thermal", type: "non-renewable", coordinates: [77.60, 28.60] as [number, number], connectedTo: ["Saharanpur 220 kV", "Meerut 220 kV"] },

  // TN Plants
  { name: "North Chennai Thermal", type: "non-renewable", coordinates: [80.33, 13.25] as [number, number], connectedTo: ["North Chennai 400 kV", "Vellore 230 kV"] },
  { name: "Kalpakkam Nuclear", type: "non-renewable", coordinates: [80.17, 12.55] as [number, number], connectedTo: ["North Chennai 400 kV"] },
  { name: "Mettur Thermal", type: "non-renewable", coordinates: [77.82, 11.78] as [number, number], connectedTo: ["Coimbatore 230 kV", "Erode 230 kV", "Salem 230 kV", "Tiruppur 230 kV"] },
  { name: "Kudankulam Nuclear", type: "non-renewable", coordinates: [77.71, 8.16] as [number, number], connectedTo: ["Dindigul 230 kV", "Tirunelveli 230 kV"] },
  { name: "Tuticorin Thermal", type: "non-renewable", coordinates: [78.17, 8.75] as [number, number], connectedTo: ["Madurai 230 kV", "Tuticorin 230 kV"] },
  { name: "Neyveli Thermal", type: "non-renewable", coordinates: [79.48, 11.53] as [number, number], connectedTo: ["Thanjavur 230 kV", "Trichy 230 kV"] },
  { name: "Muppandal Wind Farm", type: "renewable", coordinates: [77.54, 8.25] as [number, number], connectedTo: ["Tirunelveli 230 kV", "Tuticorin 230 kV"] },
  { name: "Kamuthi Solar Power", type: "renewable", coordinates: [78.38, 9.35] as [number, number], connectedTo: ["Madurai 230 kV", "Thanjavur 230 kV"] },

  // MH Plants
  { name: "Koyna Hydroelectric", type: "renewable", coordinates: [73.75, 17.40] as [number, number], connectedTo: ["Pune 400 kV"] },
  { name: "Dhule Solar Power", type: "renewable", coordinates: [74.77, 20.90] as [number, number], connectedTo: ["Nashik 220 kV", "Amravati 220 kV"] },
  { name: "Koradi Thermal", type: "non-renewable", coordinates: [79.10, 21.25] as [number, number], connectedTo: ["Koradi 400 kV"] },
  { name: "Bhusawal Thermal", type: "non-renewable", coordinates: [75.84, 21.04] as [number, number], connectedTo: ["Nashik 220 kV"] },
  { name: "Parli Thermal", type: "non-renewable", coordinates: [76.50, 18.85] as [number, number], connectedTo: ["Aurangabad 220 kV"] },
  { name: "Solapur Thermal", type: "non-renewable", coordinates: [75.95, 17.60] as [number, number], connectedTo: ["Solapur 220 kV"] },
  { name: "Chandrapur Super Thermal", type: "non-renewable", coordinates: [79.30, 19.98] as [number, number], connectedTo: ["Amravati 220 kV"] },
  { name: "Trombay Thermal", type: "non-renewable", coordinates: [72.92, 19.00] as [number, number], connectedTo: ["Thane 220 kV", "Kalyan 220 kV"] },
  { name: "Tarapur Nuclear", type: "non-renewable", coordinates: [72.66, 19.83] as [number, number], connectedTo: ["Thane 220 kV"] },

  // KA Plants
  { name: "Raichur Thermal", type: "non-renewable", coordinates: [77.34, 16.21] as [number, number], connectedTo: ["Nelamangala 400 kV", "Belagavi 220 kV", "Hubli 220 kV", "Davanagere 220 kV"] },
  { name: "Pavagada Solar Park", type: "renewable", coordinates: [77.45, 14.25] as [number, number], connectedTo: ["Nelamangala 400 kV", "Tumakuru 220 kV"] },
  { name: "Jog Falls Hydroelectric", type: "renewable", coordinates: [74.81, 14.22] as [number, number], connectedTo: ["Shivamogga 220 kV", "Hubli 220 kV"] },
  { name: "Udupi Thermal", type: "non-renewable", coordinates: [74.79, 13.16] as [number, number], connectedTo: ["Mangalore 220 kV"] },
  { name: "Sharavathi Hydroelectric", type: "renewable", coordinates: [74.84, 14.17] as [number, number], connectedTo: ["Shivamogga 220 kV"] },
  { name: "Kaiga Nuclear", type: "non-renewable", coordinates: [74.43, 14.85] as [number, number], connectedTo: ["Hubli 220 kV", "Belagavi 220 kV"] },

  // AP Plants
  { name: "Vijayawada Thermal", type: "non-renewable", coordinates: [80.53, 16.60] as [number, number], connectedTo: ["Vijayawada 400 kV"] },
  { name: "Kurnool Solar Park", type: "renewable", coordinates: [78.28, 15.68] as [number, number], connectedTo: ["Tirupati 220 kV", "Vijayawada 400 kV"] },
  { name: "Simhadri Super Thermal", type: "non-renewable", coordinates: [83.12, 17.60] as [number, number], connectedTo: ["Vizag 400 kV"] },
  { name: "GVK Gautami Gas", type: "non-renewable", coordinates: [82.24, 16.98] as [number, number], connectedTo: ["Kakinada 220 kV"] },
  { name: "Rayalaseema Thermal", type: "non-renewable", coordinates: [78.47, 14.71] as [number, number], connectedTo: ["Tirupati 220 kV"] },

  // KL Plants
  { name: "Idukki Hydroelectric", type: "renewable", coordinates: [76.97, 9.84] as [number, number], connectedTo: ["Kazhakkoottam 220 kV", "Kalamassery 220 kV"] },
  { name: "Sabarigiri Hydroelectric", type: "renewable", coordinates: [77.15, 9.35] as [number, number], connectedTo: ["Kazhakkoottam 220 kV"] },

  // GJ Plants
  { name: "Mundra Thermal", type: "non-renewable", coordinates: [69.73, 22.82] as [number, number], connectedTo: ["Ahmedabad 400 kV", "Rajkot 220 kV"] },
  { name: "Ukai Thermal", type: "non-renewable", coordinates: [73.58, 21.22] as [number, number], connectedTo: ["Surat 220 kV", "Vadodara 220 kV"] },
  { name: "Charanka Solar Park", type: "renewable", coordinates: [71.20, 23.90] as [number, number], connectedTo: ["Ahmedabad 400 kV"] },
  { name: "Banas Solar Park", type: "renewable", coordinates: [71.50, 24.10] as [number, number], connectedTo: ["Ahmedabad 400 kV", "Rajkot 220 kV"] },
  { name: "Kakrapar Nuclear", type: "non-renewable", coordinates: [73.35, 21.23] as [number, number], connectedTo: ["Surat 220 kV"] },
  { name: "Wanakbori Thermal", type: "non-renewable", coordinates: [73.35, 22.85] as [number, number], connectedTo: ["Ahmedabad 400 kV", "Vadodara 220 kV"] },
  { name: "Dhuvaran Gas", type: "non-renewable", coordinates: [72.75, 22.25] as [number, number], connectedTo: ["Ahmedabad 400 kV", "Vadodara 220 kV"] },
  { name: "Kutch Wind Farm", type: "renewable", coordinates: [69.50, 23.50] as [number, number], connectedTo: ["Rajkot 220 kV"] },

  // RJ Plants
  { name: "Bhadla Solar Park", type: "renewable", coordinates: [72.38, 27.53] as [number, number], connectedTo: ["Jaipur 400 kV", "Jodhpur 220 kV"] },
  { name: "Dhirubhai Ambani Solar Park", type: "renewable", coordinates: [72.10, 26.50] as [number, number], connectedTo: ["Jodhpur 220 kV", "Udaipur 220 kV"] },
  { name: "Chhabra Thermal", type: "non-renewable", coordinates: [76.95, 24.62] as [number, number], connectedTo: ["Jaipur 400 kV", "Udaipur 220 kV"] },
  { name: "Kota Super Thermal", type: "non-renewable", coordinates: [75.85, 25.18] as [number, number], connectedTo: ["Jaipur 400 kV", "Udaipur 220 kV"] },
  { name: "Rawatbhata Nuclear", type: "non-renewable", coordinates: [75.61, 24.88] as [number, number], connectedTo: ["Jaipur 400 kV", "Udaipur 220 kV"] },
  { name: "Suratgarh Thermal", type: "non-renewable", coordinates: [73.90, 29.32] as [number, number], connectedTo: ["Jaipur 400 kV"] },
  { name: "Jaisalmer Wind Park", type: "renewable", coordinates: [70.92, 26.91] as [number, number], connectedTo: ["Jodhpur 220 kV"] },

  // MP Plants
  { name: "Vindhyachal Thermal (MP)", type: "non-renewable", coordinates: [82.67, 24.10] as [number, number], connectedTo: ["Bhopal 400 kV"] },
  { name: "Sasan Ultra Mega Power", type: "non-renewable", coordinates: [82.62, 23.97] as [number, number], connectedTo: ["Indore 220 kV"] },
  { name: "Rewa Ultra Mega Solar", type: "renewable", coordinates: [81.50, 24.50] as [number, number], connectedTo: ["Bhopal 400 kV", "Gwalior 220 kV"] },
  { name: "Satpura Thermal", type: "non-renewable", coordinates: [78.18, 22.10] as [number, number], connectedTo: ["Bhopal 400 kV", "Indore 220 kV"] },
  { name: "Amarkantak Thermal", type: "non-renewable", coordinates: [81.65, 23.15] as [number, number], connectedTo: ["Bhopal 400 kV"] },

  // WB Plants
  { name: "Kolaghat Thermal", type: "non-renewable", coordinates: [87.87, 22.42] as [number, number], connectedTo: ["Kolkata 400 kV"] },
  { name: "Bakreswar Thermal", type: "non-renewable", coordinates: [87.45, 23.83] as [number, number], connectedTo: ["Durgapur 220 kV"] },
  { name: "Mejia Thermal", type: "non-renewable", coordinates: [87.12, 23.45] as [number, number], connectedTo: ["Asansol 220 kV", "Durgapur 220 kV"] },
  { name: "Farakka Super Thermal", type: "non-renewable", coordinates: [87.89, 24.77] as [number, number], connectedTo: ["Kolkata 400 kV", "Durgapur 220 kV"] },
  { name: "Sagardighi Thermal", type: "non-renewable", coordinates: [88.10, 24.37] as [number, number], connectedTo: ["Kolkata 400 kV", "Siliguri 220 kV"] },

  // TS Plants
  { name: "Ramagundam Super Thermal", type: "non-renewable", coordinates: [79.45, 18.75] as [number, number], connectedTo: ["Hyderabad 400 kV", "Warangal 220 kV"] },
  { name: "Kothagudem Thermal", type: "non-renewable", coordinates: [80.68, 17.65] as [number, number], connectedTo: ["Hyderabad 400 kV"] },
  { name: "Jurala Hydroelectric", type: "renewable", coordinates: [77.70, 16.33] as [number, number], connectedTo: ["Hyderabad 400 kV"] },

  // OR Plants
  { name: "Talcher Super Thermal", type: "non-renewable", coordinates: [85.10, 20.91] as [number, number], connectedTo: ["Bhubaneswar 400 kV", "Cuttack 220 kV"] },
  { name: "Ib Valley Thermal", type: "non-renewable", coordinates: [83.85, 21.82] as [number, number], connectedTo: ["Bhubaneswar 400 kV"] },
  { name: "Hirakud Hydroelectric", type: "renewable", coordinates: [83.87, 21.53] as [number, number], connectedTo: ["Bhubaneswar 400 kV"] },

  // PB Plants
  { name: "Guru Gobind Singh Super Thermal", type: "non-renewable", coordinates: [76.58, 31.18] as [number, number], connectedTo: ["Amritsar 220 kV", "Jalandhar 220 kV"] },
  { name: "Rajpura Thermal", type: "non-renewable", coordinates: [76.60, 30.48] as [number, number], connectedTo: ["Jalandhar 220 kV", "Ludhiana 220 kV"] },
  { name: "Bhakra Nangal Hydroelectric", type: "renewable", coordinates: [76.43, 31.41] as [number, number], connectedTo: ["Amritsar 220 kV", "Jalandhar 220 kV"] },

  // HR Plants
  { name: "Panipat Thermal", type: "non-renewable", coordinates: [76.97, 29.39] as [number, number], connectedTo: ["Faridabad 220 kV", "Gurugram 400 kV"] },
  { name: "Rajiv Gandhi Thermal", type: "non-renewable", coordinates: [75.90, 29.35] as [number, number], connectedTo: ["Gurugram 400 kV"] },

  // BR Plants
  { name: "Kahalgaon Super Thermal", type: "non-renewable", coordinates: [87.23, 25.25] as [number, number], connectedTo: ["Bhagalpur 220 kV", "Muzaffarpur 220 kV"] },
  { name: "Barauni Thermal", type: "non-renewable", coordinates: [86.02, 25.40] as [number, number], connectedTo: ["Muzaffarpur 220 kV", "Patna 220 kV"] },
  { name: "Nabinagar Super Thermal", type: "non-renewable", coordinates: [84.12, 24.62] as [number, number], connectedTo: ["Gaya 220 kV", "Patna 220 kV"] },
  { name: "Talwandi Sabo Power Plant", type: "non-renewable", coordinates: [75.25, 29.98] as [number, number], connectedTo: ["Ludhiana 220 kV"] },
  { name: "Korba Super Thermal", type: "non-renewable", coordinates: [82.68, 22.38] as [number, number], connectedTo: ["Raipur 400 kV"] },
  { name: "Bongaigaon Thermal", type: "non-renewable", coordinates: [90.53, 26.37] as [number, number], connectedTo: ["Guwahati 220 kV"] },
  { name: "Umiam Hydroelectric", type: "renewable", coordinates: [91.89, 25.65] as [number, number], connectedTo: ["Shillong 132 kV"] },
  { name: "Palatana Gas", type: "non-renewable", coordinates: [91.35, 23.61] as [number, number], connectedTo: ["Agartala 132 kV"] },
  { name: "Doyang Hydroelectric", type: "renewable", coordinates: [94.28, 26.21] as [number, number], connectedTo: ["Kohima 132 kV"] },
];

