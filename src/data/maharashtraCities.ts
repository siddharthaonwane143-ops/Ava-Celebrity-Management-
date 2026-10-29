export interface MaharashtraCity {
  id: string;
  name: string;
  marathiName: string;
  region: 'Mumbai MMR' | 'Western Maharashtra' | 'Vidarbha' | 'Marathwada' | 'North Maharashtra' | 'Konkan';
  popularForEvents?: boolean;
}

export const MAHARASHTRA_CITIES: MaharashtraCity[] = [
  // Mumbai MMR
  { id: 'mumbai', name: 'Mumbai', marathiName: 'मुंबई', region: 'Mumbai MMR', popularForEvents: true },
  { id: 'navi-mumbai', name: 'Navi Mumbai', marathiName: 'नवी मुंबई', region: 'Mumbai MMR', popularForEvents: true },
  { id: 'thane', name: 'Thane', marathiName: 'ठाणे', region: 'Mumbai MMR', popularForEvents: true },
  { id: 'kalyan-dombivli', name: 'Kalyan - Dombivli', marathiName: 'कल्याण - डोंबिवली', region: 'Mumbai MMR' },
  { id: 'vasai-virar', name: 'Vasai - Virar', marathiName: 'वसई - विरार', region: 'Mumbai MMR' },
  { id: 'mira-bhayandar', name: 'Mira - Bhayandar', marathiName: 'मीरा - भाईंदर', region: 'Mumbai MMR' },
  { id: 'panvel', name: 'Panvel', marathiName: 'पनवेल', region: 'Mumbai MMR', popularForEvents: true },
  { id: 'palghar', name: 'Palghar', marathiName: 'पालघर', region: 'Mumbai MMR' },

  // Western Maharashtra
  { id: 'pune', name: 'Pune', marathiName: 'पुणे', region: 'Western Maharashtra', popularForEvents: true },
  { id: 'pimpri-chinchwad', name: 'Pimpri - Chinchwad', marathiName: 'पिंपरी - चिंचवड', region: 'Western Maharashtra', popularForEvents: true },
  { id: 'kolhapur', name: 'Kolhapur', marathiName: 'कोल्हापूर', region: 'Western Maharashtra', popularForEvents: true },
  { id: 'solapur', name: 'Solapur', marathiName: 'सोलापूर', region: 'Western Maharashtra', popularForEvents: true },
  { id: 'sangli', name: 'Sangli - Miraj', marathiName: 'सांगली - मिरज', region: 'Western Maharashtra', popularForEvents: true },
  { id: 'satara', name: 'Satara', marathiName: 'सातारा', region: 'Western Maharashtra' },
  { id: 'karad', name: 'Karad', marathiName: 'कराड', region: 'Western Maharashtra' },
  { id: 'baramati', name: 'Baramati', marathiName: 'बारामती', region: 'Western Maharashtra' },
  { id: 'ichalkaranji', name: 'Ichalkaranji', marathiName: 'इचलकरंजी', region: 'Western Maharashtra' },
  { id: 'pandharpur', name: 'Pandharpur', marathiName: 'पंढरपूर', region: 'Western Maharashtra' },
  { id: 'mahabaleshwar', name: 'Mahabaleshwar', marathiName: 'महाबळेश्वर', region: 'Western Maharashtra', popularForEvents: true },
  { id: 'lonavala', name: 'Lonavala - Khandala', marathiName: 'लोणावळा - खंडाळा', region: 'Western Maharashtra', popularForEvents: true },

  // Vidarbha
  { id: 'nagpur', name: 'Nagpur', marathiName: 'नागपूर', region: 'Vidarbha', popularForEvents: true },
  { id: 'amravati', name: 'Amravati', marathiName: 'अमरावती', region: 'Vidarbha', popularForEvents: true },
  { id: 'akola', name: 'Akola', marathiName: 'अकोला', region: 'Vidarbha' },
  { id: 'chandrapur', name: 'Chandrapur', marathiName: 'चंद्रपूर', region: 'Vidarbha' },
  { id: 'yavatmal', name: 'Yavatmal', marathiName: 'यवतमाळ', region: 'Vidarbha' },
  { id: 'wardha', name: 'Wardha', marathiName: 'वर्धा', region: 'Vidarbha' },
  { id: 'gondia', name: 'Gondia', marathiName: 'गोंदिया', region: 'Vidarbha' },
  { id: 'bhandara', name: 'Bhandara', marathiName: 'भंडारा', region: 'Vidarbha' },
  { id: 'gadchiroli', name: 'Gadchiroli', marathiName: 'गडचिरोली', region: 'Vidarbha' },
  { id: 'washim', name: 'Washim', marathiName: 'वाशिम', region: 'Vidarbha' },
  { id: 'buldhana', name: 'Buldhana (Shegaon)', marathiName: 'बुलढाणा (शेगाव)', region: 'Vidarbha' },

  // Marathwada
  { id: 'csn-aurangabad', name: 'Chhatrapati Sambhaji Nagar (Aurangabad)', marathiName: 'छत्रपती संभाजीनगर (औरंगाबाद)', region: 'Marathwada', popularForEvents: true },
  { id: 'nanded', name: 'Nanded', marathiName: 'नांदेड', region: 'Marathwada', popularForEvents: true },
  { id: 'latur', name: 'Latur', marathiName: 'लातूर', region: 'Marathwada', popularForEvents: true },
  { id: 'jalna', name: 'Jalna', marathiName: 'जालना', region: 'Marathwada' },
  { id: 'parbhani', name: 'Parbhani', marathiName: 'परभणी', region: 'Marathwada' },
  { id: 'beed', name: 'Beed', marathiName: 'बीड', region: 'Marathwada' },
  { id: 'dharashiv-osmanabad', name: 'Dharashiv (Osmanabad)', marathiName: 'धाराशिव (उस्मानाबाद)', region: 'Marathwada' },
  { id: 'hingoli', name: 'Hingoli', marathiName: 'हिंगोली', region: 'Marathwada' },

  // North Maharashtra
  { id: 'nashik', name: 'Nashik', marathiName: 'नाशिक', region: 'North Maharashtra', popularForEvents: true },
  { id: 'jalgaon', name: 'Jalgaon', marathiName: 'जळगाव', region: 'North Maharashtra', popularForEvents: true },
  { id: 'dhule', name: 'Dhule', marathiName: 'धुळे', region: 'North Maharashtra' },
  { id: 'ahilyanagar-ahmednagar', name: 'Ahilyanagar (Ahmednagar)', marathiName: 'अहिल्यानगर (अहमदनगर)', region: 'North Maharashtra', popularForEvents: true },
  { id: 'nandurbar', name: 'Nandurbar', marathiName: 'नंदुरबार', region: 'North Maharashtra' },
  { id: 'malegaon', name: 'Malegaon', marathiName: 'मालेगाव', region: 'North Maharashtra' },
  { id: 'shirdi', name: 'Shirdi', marathiName: 'शिर्डी', region: 'North Maharashtra', popularForEvents: true },

  // Konkan
  { id: 'ratnagiri', name: 'Ratnagiri', marathiName: 'रत्नागिरी', region: 'Konkan', popularForEvents: true },
  { id: 'sindhudurg', name: 'Sindhudurg (Sawantwadi)', marathiName: 'सिंधुदुर्ग (सावंतवाडी)', region: 'Konkan' },
  { id: 'raigad-alibag', name: 'Raigad (Alibag)', marathiName: 'रायगड (अलिबाग)', region: 'Konkan', popularForEvents: true },
  { id: 'chiplun', name: 'Chiplun', marathiName: 'चिपळूण', region: 'Konkan' },
];

export const MAHARASHTRA_REGIONS = [
  'All Maharashtra',
  'Mumbai MMR',
  'Western Maharashtra',
  'Vidarbha',
  'Marathwada',
  'North Maharashtra',
  'Konkan',
] as const;
