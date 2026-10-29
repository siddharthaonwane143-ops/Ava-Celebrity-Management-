export type RobotSpecialistId =
  | 'prime'
  | 'casting'
  | 'finance'
  | 'matchmaker'
  | 'media'
  | 'legal'
  | 'security'
  | 'telecast'
  | 'sponsorship'
  | 'voice'
  | 'checkout';

export interface RobotSpecialist {
  id: RobotSpecialistId;
  code: string;
  channel: string;
  nameMr: string;
  nameHi: string;
  nameEn: string;
  roleMr: string;
  roleHi: string;
  roleEn: string;
  descMr: string;
  descHi: string;
  descEn: string;
  armorColor: number;
  visorColor: number;
  glowColor: number;
  accentHex: string;
  borderHex: string;
  bgGradient: string;
  activeTaskMr: string;
  activeTaskHi: string;
  activeTaskEn: string;
  defaultAction: 'booking' | 'talent' | 'rates' | 'auditions' | 'shows';
}

export const ROBOT_FLEET: RobotSpecialist[] = [
  {
    id: 'prime',
    code: 'AVA-01',
    channel: 'CH-01',
    nameMr: 'एव्हीए प्राईम (सुवर्ण मुख्य अधिकारी)',
    nameHi: 'एवीए प्राइम (स्वर्ण मुख्य अधिकारी)',
    nameEn: 'AVA Prime (Executive Command)',
    roleMr: 'मुख्य स्वागताध्यक्ष व व्हीआयपी मार्गदर्शक',
    roleHi: 'मुख्य स्वागताध्यक्ष एवं वीआईपी मार्गदर्शक',
    roleEn: 'Executive Host & VIP Concierge',
    descMr: 'संपूर्ण व्यासपीठाचे नियंत्रण, पाहुण्यांचे स्वागत आणि सर्व ११ रोबोट्सचे संचालन करतो.',
    descHi: 'संपूर्ण मंच का नियंत्रण, अतिथियों का स्वागत और सभी 11 रोबोट्स का संचालन करता है।',
    descEn: 'Master fleet orchestrator coordinating VIP protocol and autonomous operations.',
    armorColor: 0xe6bf45, // 24K Luxury Gold
    visorColor: 0x00f2fe, // Cyan Cyber
    glowColor: 0xf3d068,
    accentHex: '#D4AF37',
    borderHex: '#F3D068',
    bgGradient: 'from-amber-950/40 via-[#120F06] to-[#08080C]',
    activeTaskMr: 'सर्व ११ स्वायत्त रोबोट्स सज्ज आहेत. प्रेक्षक आदेशाची प्रतीक्षा करत आहे.',
    activeTaskHi: 'सभी 11 स्वायत्त रोबोट्स तैयार हैं। दर्शक आदेश की प्रतीक्षा कर रहा है।',
    activeTaskEn: 'All 11 autonomous robots active on neural network. Ready for commands.',
    defaultAction: 'booking'
  },
  {
    id: 'casting',
    code: 'AVA-02',
    channel: 'CH-02',
    nameMr: 'क्रोनो-कास्टिंग (निवड चाचणी तज्ज्ञ)',
    nameHi: 'क्रोनो-कास्टिंग (ऑडिशन विशेषज्ञ)',
    nameEn: 'Chrono-Casting (Audition Specialist)',
    roleMr: 'ऑडिशन व अभिनय निवड तज्ज्ञ',
    roleHi: 'ऑडिशन एवं अभिनय चयन विशेषज्ञ',
    roleEn: 'Casting Calls & Audition Director',
    descMr: 'मराठी व हिंदी चित्रपट, नाटके आणि वेब मालिकांच्या ऑडिशनचे निकष तपासतो.',
    descHi: 'फिल्मों, नाटकों और धारावाहिकों के लिए ऑडिशन नियमों का विश्लेषण करता है।',
    descEn: 'Analyzes acting scripts, casting eligibility, and production schedules.',
    armorColor: 0x991b1b, // Crimson Ruby
    visorColor: 0xff1744, // Ruby Laser Red
    glowColor: 0xff5252,
    accentHex: '#ef4444',
    borderHex: '#f87171',
    bgGradient: 'from-red-950/40 via-[#180808] to-[#08080C]',
    activeTaskMr: 'चित्रपट व मालिकांसाठी ऑडिशन अर्ज व पात्रता तपासणी चालू आहे.',
    activeTaskHi: 'फिल्मों और नाटकों के लिए ऑडिशन आवेदन एवं पात्रता जांच जारी है।',
    activeTaskEn: 'Scanning casting registry and production scripts for upcoming auditions.',
    defaultAction: 'auditions'
  },
  {
    id: 'finance',
    code: 'AVA-03',
    channel: 'CH-03',
    nameMr: 'अपेक्स-फायनान्स (मानधन विश्लेषक)',
    nameHi: 'एपेक्स-फाइनेंस (मानदेय विश्लेषक)',
    nameEn: 'Apex-Finance (Rate Valuation)',
    roleMr: 'कलाकार मानधन व व्यावसायिक दर विश्लेषक',
    roleHi: 'कलाकार मानदेय एवं व्यावसायिक दर विश्लेषक',
    roleEn: 'Commercial Rate & Budget Benchmark',
    descMr: 'अर्धा दिवस, पूर्ण दिवस आणि थेट उपस्थितीचे अधिकृत व्यावसायिक दर मोजतो.',
    descHi: 'आधे दिन, पूरे दिन और लाइव उपस्थिति के आधिकारिक व्यावसायिक दरों का मूल्यांकन करता है।',
    descEn: 'Calculates real-time celebrity appearance fees, travel riders, and budget tiers.',
    armorColor: 0x065f46, // Emerald Platinum
    visorColor: 0x10b981, // Emerald Cyber Green
    glowColor: 0x34d399,
    accentHex: '#10b981',
    borderHex: '#34d399',
    bgGradient: 'from-emerald-950/40 via-[#071710] to-[#08080C]',
    activeTaskMr: 'महाराष्ट्र राज्यस्तरावरील अधिकृत मानधन व प्रवास भत्त्यांचे मूल्यांकन चालू आहे.',
    activeTaskHi: 'राज्यस्तरीय आधिकारिक मानदेय और यात्रा भत्तों का मूल्यांकन जारी है।',
    activeTaskEn: 'Benchmarking commercial rates and logistics riders for celebrity booking.',
    defaultAction: 'rates'
  },
  {
    id: 'matchmaker',
    code: 'AVA-04',
    channel: 'CH-04',
    nameMr: 'न्युरल-मॅच (सेलिब्रिटी शोधक)',
    nameHi: 'न्यूरल-मैच (सेलिब्रिटी खोजकर्ता)',
    nameEn: 'Neural-Match (Talent Scout)',
    roleMr: 'उत्सव व कार्यक्रमासाठी योग्य कलाकार निवड',
    roleHi: 'समारोह एवं आयोजनों के लिए उपयुक्त कलाकार चयन',
    roleEn: 'Event & Brand Celebrity Matchmaker',
    descMr: 'विवाहसोहळे, संगीत रजनी आणि कॉर्पोरेट संमेलनांसाठी सर्वोत्तम कलाकार निवडतो.',
    descHi: 'विवाह समारोह, संगीत संध्या और कॉर्पोरेट सम्मेलनों के लिए सर्वश्रेष्ठ कलाकार खोजता है।',
    descEn: 'Matches event themes, budgets, and crowds with ideal celebrity headliners.',
    armorColor: 0x581c87, // Royal Amethyst
    visorColor: 0xc084fc, // Amethyst Glow
    glowColor: 0xa855f7,
    accentHex: '#a855f7',
    borderHex: '#c084fc',
    bgGradient: 'from-purple-950/40 via-[#13071c] to-[#08080C]',
    activeTaskMr: 'कार्यक्रमाच्या भव्यतेनुसार अव्वल सेलिब्रिटीजची पडताळणी चालू आहे.',
    activeTaskHi: 'समारोह की भव्यता के अनुसार शीर्ष कलाकारों की जांच जारी है।',
    activeTaskEn: 'Matching event profile with 500+ verified Marathi and Bollywood artists.',
    defaultAction: 'talent'
  },
  {
    id: 'media',
    code: 'AVA-05',
    channel: 'CH-05',
    nameMr: 'ऑप्टी-लेन्स (व्हिडिओ व शोरील तज्ज्ञ)',
    nameHi: 'ऑप्टी-लेंस (वीडियो एवं शोरील विशेषज्ञ)',
    nameEn: 'Opti-Lens (Showreel Inspector)',
    roleMr: '४K व्हिडिओ, उत्सव व शोरील निरीक्षक',
    roleHi: '4K वीडियो, महोत्सव एवं शोरील निरीक्षक',
    roleEn: '4K Showreel & Media Video Inspector',
    descMr: 'कलाकारांचे मूळ व्हिडिओ, लाइव्ह परफॉर्मन्स आणि ४K चित्रीकरण तपासतो.',
    descHi: 'कलाकारों के मूल वीडियो, लाइव प्रस्तुति और 4K रिकॉर्डिंग की जांच करता है।',
    descEn: 'Verifies 4K video portfolios, cinematic showreels, and festival performance clips.',
    armorColor: 0x1e3a8a, // Cobalt Sapphire
    visorColor: 0x38bdf8, // Sky Cyan
    glowColor: 0x60a5fa,
    accentHex: '#3b82f6',
    borderHex: '#60a5fa',
    bgGradient: 'from-blue-950/40 via-[#061226] to-[#08080C]',
    activeTaskMr: 'कलाकारांच्या अधिकृत ४K शोरील्स आणि व्हिडिओंची तपासणी पूर्ण झाली आहे.',
    activeTaskHi: 'कलाकारों के आधिकारिक 4K शोरील्स और वीडियो की जांच पूरी हो गई है।',
    activeTaskEn: 'Streaming high-fidelity 4K media reels and past event broadcasts.',
    defaultAction: 'talent'
  },
  {
    id: 'legal',
    code: 'AVA-06',
    channel: 'CH-06',
    nameMr: 'सायबर-ज्युरीस (कायदेशीर करार तज्ज्ञ)',
    nameHi: 'साइबर-ज्यूरिस (विधिक अनुबंध विशेषज्ञ)',
    nameEn: 'Cyber-Juris (Legal Contracts)',
    roleMr: 'करारनामा, गोपनीयता व सुरक्षित अटी लेखक',
    roleHi: 'अनुबंध पत्र, गोपनीयता एवं सुरक्षा नियम लेखक',
    roleEn: 'Performance Contracts & Legal Riders',
    descMr: 'कलाकार आणि आयोजक यांच्यात अचूक, सुरक्षित व अधिकृत करारनामा तयार करतो.',
    descHi: 'कलाकार और आयोजक के बीच पूर्णतः सुरक्षित एवं आधिकारिक अनुबंध तैयार करता है।',
    descEn: 'Drafts strict performance riders, NDAs, advance schedules, and cancellation clauses.',
    armorColor: 0x334155, // Steel Titanium
    visorColor: 0x06b6d4, // Ice Diamond Cyan
    glowColor: 0x22d3ee,
    accentHex: '#06b6d4',
    borderHex: '#22d3ee',
    bgGradient: 'from-cyan-950/40 via-[#07161b] to-[#08080C]',
    activeTaskMr: 'गोपनीयता, हक्क संरक्षण आणि अधिकृत कराराचे प्रारूप तयार केले जात आहे.',
    activeTaskHi: 'गोपनीयता, अधिकार संरक्षण और आधिकारिक अनुबंध का प्रारूप तैयार किया जा रहा है।',
    activeTaskEn: 'Generating tamper-proof performance agreements and VIP hospitality riders.',
    defaultAction: 'booking'
  },
  {
    id: 'security',
    code: 'AVA-07',
    channel: 'CH-07',
    nameMr: 'इजीस-शील्ड (सुरक्षा व व्हीआयपी प्रोटोकॉल)',
    nameHi: 'एजिस-शील्ड (सुरक्षा एवं वीआईपी प्रोटोकॉल)',
    nameEn: 'Aegis-Shield (Event Security)',
    roleMr: 'गर्दी नियंत्रण, सुरक्षा रक्षक व व्यासपीठ बंदोबस्त',
    roleHi: 'भीड़ नियंत्रण, अंगरक्षक एवं मंच सुरक्षा व्यवस्था',
    roleEn: 'Crowd Security & Bouncer Protocol',
    descMr: 'सेलिब्रिटींची सुरक्षित ने-आण, अंगरक्षक आणि रेड-कार्पेट सुरक्षा आखतो.',
    descHi: 'सेलिब्रिटीज की सुरक्षित आवाजाही, बाउंसर और रेड-कार्पेट सुरक्षा की योजना बनाता है।',
    descEn: 'Coordinates armed bodyguards, transit convoys, barricading, and green-room security.',
    armorColor: 0x78350f, // Amber Tungsten
    visorColor: 0xf59e0b, // Amber Warning Light
    glowColor: 0xfbbf24,
    accentHex: '#f59e0b',
    borderHex: '#fbbf24',
    bgGradient: 'from-amber-950/40 via-[#181005] to-[#08080C]',
    activeTaskMr: 'व्यासपीठ बंदोबस्त, बाउंसर सुरक्षा आणि आणीबाणी योजना कार्यान्वित आहे.',
    activeTaskHi: 'मंच सुरक्षा, बाउंसर व्यवस्था और आपातकालीन योजना सक्रिय है।',
    activeTaskEn: 'Enforcing Tier-1 VIP perimeter escort protocols and venue security gates.',
    defaultAction: 'booking'
  },
  {
    id: 'telecast',
    code: 'AVA-08',
    channel: 'CH-08',
    nameMr: 'ओरायन-स्ट्रीम (थेट उपग्रह प्रक्षेपण)',
    nameHi: 'ओरियन-स्ट्रीम (सीधा उपग्रह प्रसारण)',
    nameEn: 'Orion-Stream (Satellite Live)',
    roleMr: '४K थेट उपग्रह प्रक्षेपण व कॅमेरा समन्वय',
    roleHi: '4K सीधा उपग्रह प्रसारण एवं कैमरा समन्वय',
    roleEn: '4K Live Satellite & OTT Streaming',
    descMr: 'महाराष्ट्रातील भव्य कार्यक्रमांचे थेट प्रक्षेपण आणि डिजिटल प्रवाह नियंत्रित करतो.',
    descHi: 'भव्य आयोजनों का सीधा लाइव प्रसारण और डिजिटल स्ट्रीमिंग नियंत्रित करता है।',
    descEn: 'Manages multi-camera 4K satellite live uplinks and global social streaming.',
    armorColor: 0x0f172a, // Obsidian Space
    visorColor: 0x14b8a6, // Satellite Teal
    glowColor: 0x2dd4bf,
    accentHex: '#14b8a6',
    borderHex: '#2dd4bf',
    bgGradient: 'from-teal-950/40 via-[#051715] to-[#08080C]',
    activeTaskMr: 'उपग्रह वाहिनी थेट जोडली गेली आहे. ४K थेट प्रक्षेपणाचा दर्जा १००% शुद्ध आहे.',
    activeTaskHi: 'उपग्रह चैनल सीधा जुड़ गया है। 4K सीधे प्रसारण की गुणवत्ता 100% उत्तम है।',
    activeTaskEn: 'Synchronizing multi-angle 4K optical feed and satellite transmission uplink.',
    defaultAction: 'shows'
  },
  {
    id: 'sponsorship',
    code: 'AVA-09',
    channel: 'CH-09',
    nameMr: 'सिनर्जी-कोअर (प्रायोजक व ब्रँड समन्वय)',
    nameHi: 'सिनर्जी-कोर (प्रायोजक एवं ब्रांड समन्वय)',
    nameEn: 'Synergy-Core (Brand Partnerships)',
    roleMr: 'प्रायोजक, कॉर्पोरेट भागीदारी व ब्रँडिंग',
    roleHi: 'प्रायोजक, कॉर्पोरेट साझेदारी एवं ब्रांडिंग',
    roleEn: 'Sponsor Integration & Endorsements',
    descMr: 'कार्यक्रमांसाठी आघाडीचे प्रायोजक आणि सेलिब्रिटी ब्रँड करार घडवून आणतो.',
    descHi: 'कार्यक्रमों के लिए प्रमुख प्रायोजक और सेलिब्रिटी ब्रांड अनुबंध संपन्न कराता है।',
    descEn: 'Connects title sponsors, fashion partners, and commercial brand ambassadorships.',
    armorColor: 0x713f12, // Imperial Topaz
    visorColor: 0xfacc15, // Radiant Yellow
    glowColor: 0xfde047,
    accentHex: '#eab308',
    borderHex: '#facc15',
    bgGradient: 'from-yellow-950/40 via-[#181404] to-[#08080C]',
    activeTaskMr: 'शीर्ष प्रायोजक आणि ब्रँड भागीदारी सूचीचे विश्लेषण चालू आहे.',
    activeTaskHi: 'शीर्ष प्रायोजक और ब्रांड साझेदारी सूची का विश्लेषण जारी है।',
    activeTaskEn: 'Mapping corporate sponsor decks and celebrity brand endorsement tiers.',
    defaultAction: 'shows'
  },
  {
    id: 'voice',
    code: 'AVA-10',
    channel: 'CH-10',
    nameMr: 'व्होकॅलिस (शुद्ध भाषा ध्वनी विश्लेषक)',
    nameHi: 'वोकेलिस (शुद्ध भाषा ध्वनि विश्लेषक)',
    nameEn: 'Vocalis (Pure Acoustic Voice)',
    roleMr: 'मराठी, हिंदी व इंग्रजी शुद्ध उच्चार व ध्वनी',
    roleHi: 'मराठी, हिंदी एवं अंग्रेजी शुद्ध उच्चारण एवं ध्वनि',
    roleEn: 'Pure Voice & Phonetic Engine',
    descMr: 'भाषा भेसळ न करता निवडलेल्या भाषेमध्ये १००% शुद्ध संवाद व आवाज प्रदान करतो.',
    descHi: 'बिना किसी भाषा मिश्रण के चुनी हुई भाषा में 100% शुद्ध संवाद एवं स्वर प्रदान करता है।',
    descEn: 'Delivers pure-language synthesized speech and phonetic transcription without mixing.',
    armorColor: 0x075985, // Sky Chromium
    visorColor: 0x0ea5e9, // Electric Plasma
    glowColor: 0x38bdf8,
    accentHex: '#0284c7',
    borderHex: '#38bdf8',
    bgGradient: 'from-sky-950/40 via-[#061724] to-[#08080C]',
    activeTaskMr: 'मिश्रणमुक्त १००% शुद्ध भाषा ध्वनी प्रणाली कार्यान्वित आहे.',
    activeTaskHi: 'मिश्रण रहित 100% शुद्ध भाषा ध्वनि प्रणाली सक्रिय है।',
    activeTaskEn: 'Enforcing zero-mix pure phonetic language output across all acoustic channels.',
    defaultAction: 'talent'
  },
  {
    id: 'checkout',
    code: 'AVA-11',
    channel: 'CH-11',
    nameMr: 'फास्टट्रॅक-व्हीआयपी (तत्काळ बुकिंग समन्वयक)',
    nameHi: 'फास्टट्रैक-वीआईपी (तत्काल बुकिंग समन्वयक)',
    nameEn: 'FastTrack-VIP (Instant Booking)',
    roleMr: 'थेट आरक्षण, व्हॉट्सॲप संदेश व तारीख राखीव',
    roleHi: 'सीधा आरक्षण, व्हाट्सएप संदेश एवं तिथि सुरक्षित',
    roleEn: 'Instant VIP Booking & WhatsApp Dispatch',
    descMr: 'कलाकारांची तारीख राखीव करून थेट व्हॉट्सॲप आणि ईमेलवर तात्काळ आरक्षण पाठवतो.',
    descHi: 'कलाकारों की तिथि सुरक्षित कर सीधे व्हाट्सएप और ईमेल पर तत्काल आरक्षण भेजता है।',
    descEn: 'Dispatches instant booking requests to artist management desks with priority RSVP.',
    armorColor: 0x831843, // Rose Gold Platinum
    visorColor: 0xf43f5e, // Radiant Rose
    glowColor: 0xfb7185,
    accentHex: '#f43f5e',
    borderHex: '#fb7185',
    bgGradient: 'from-rose-950/40 via-[#180710] to-[#08080C]',
    activeTaskMr: 'थेट व्हीआयपी आरक्षण प्रपत्र सज्ज आहे. तारीख निश्चिती सुरू आहे.',
    activeTaskHi: 'सीधा वीआईपी आरक्षण प्रपत्र तैयार है। तिथि निर्धारण जारी है।',
    activeTaskEn: 'Generating priority VIP booking slips and direct WhatsApp confirmation.',
    defaultAction: 'booking'
  }
];
