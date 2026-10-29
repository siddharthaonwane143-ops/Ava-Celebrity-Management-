import { Testimonial } from '../types';

// Editorial testimonials without demo ratings.
// Ratings are ONLY displayed for genuine, verified live ratings submitted by real clients.
export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  // 1. Client Success Story - Luxury Fashion Gala
  {
    id: 'test-client-vogue-2026',
    name: 'Nandita Singhania',
    title: 'Executive Producer & Show Director',
    organization: 'Couture Fashion Week India',
    authorType: 'client',
    category: 'Haute Couture Runway',
    city: 'Mumbai',
    quote:
      'AVA provided 12 certified runway supermodels and celebrity showstoppers for our Mumbai Couture Gala. The coordination was flawless: transparent contractual riders, VIP security protocols, and on-schedule backstage rehearsals. Our marquee sponsors were thrilled.',
    projectOutcome: '12 Runway Models • 2 Celebrity Showstoppers',
    verifiedBadge: 'Verified Producer',
    date: 'February 2026',
    isFeatured: true,
    isRealRating: false,
    isLiveRating: false,
  },
  // 2. Artist Success Story - Film & OTT Actor
  {
    id: 'test-artist-devansh-2026',
    name: 'Devansh Malhotra',
    title: 'A-List Leading Actor & Action Star',
    organization: 'AVA Exclusive Talent Roster',
    authorType: 'artist',
    category: 'Cinema & Streaming',
    city: 'Mumbai (Juhu)',
    quote:
      'Exclusive representation through AVA transformed my career trajectory. From multi-city brand endorsement deals to contractual OTT guarantees, their team handles every legal detail with complete financial transparency. An artist can focus 100% on craft.',
    projectOutcome: '3 Marquee OTT Deals • Pan-India Campaign',
    verifiedBadge: 'Exclusive AVA Artist',
    date: 'January 2026',
    isFeatured: true,
    isRealRating: false,
    isLiveRating: false,
  },
  // 3. Client Success Story - Corporate Flagship Launch
  {
    id: 'test-client-auto-2026',
    name: 'Rohan Deshmukh',
    title: 'Head of Brand Marketing & Events',
    organization: 'Pinnacle Luxury Automotive',
    authorType: 'client',
    category: 'Automotive VIP Launch',
    city: 'Pune',
    quote:
      'For our flagship electric luxury sedan unveiling at The Westin Pune, we required a bilingual prime-time anchor and an orchestral playback ensemble. AVA dispatched Natasha D’Souza and sound teams within 48 hours. The digital contract pass system is unmatched in India.',
    projectOutcome: 'VIP Arena Launch • 1,800 HNI Guests',
    verifiedBadge: 'Enterprise Client',
    date: 'March 2026',
    isFeatured: true,
    isRealRating: false,
    isLiveRating: false,
  },
  // 4. Artist Success Story - Playback Singer & Arena Performer
  {
    id: 'test-artist-ananya-2026',
    name: 'Ananya Roy',
    title: 'Playback Vocalist & Live Arena Artist',
    organization: 'Bollywood & International Tours',
    authorType: 'artist',
    category: 'Live Music & Arena',
    city: 'Mumbai / Pune',
    quote:
      'Performing 25 arena concerts across Maharashtra and internationally requires reliable rider logistics. AVA guarantees sound technical parameters, hotel security, and instantaneous digital payment escrows. They are true guardians of performing artists.',
    projectOutcome: '25-City Arena Tour • 80,000+ Fans',
    verifiedBadge: 'Verified Vocalist',
    date: 'February 2026',
    isFeatured: true,
    isRealRating: false,
    isLiveRating: false,
  },
  // 5. Client Success Story - Film Production & Casting
  {
    id: 'test-client-dharma-2026',
    name: 'Tanvi Kelkar',
    title: 'Director of Casting & Talent Scouting',
    organization: 'Starlight Cinema & Marathi OTT',
    authorType: 'client',
    category: 'Film & Web Series Casting',
    city: 'Mumbai',
    quote:
      'We auditioned over 40 performers through AVA’s audition portal for a high-budget period drama. The background verification, self-tape standards, and availability trackers saved our production crew weeks of tedious back-and-forth.',
    projectOutcome: 'Casting Completed in 5 Days • 8 Roles Filled',
    verifiedBadge: 'Verified Casting Director',
    date: 'January 2026',
    isFeatured: true,
    isRealRating: false,
    isLiveRating: false,
  },
  // 6. Artist Success Story - High Fashion Model
  {
    id: 'test-artist-kabir-2026',
    name: 'Kabir Varma',
    title: 'Editorial Supermodel & Runway Icon',
    organization: 'Milan & Mumbai Fashion Week',
    authorType: 'artist',
    category: 'High Fashion & Luxury',
    city: 'Mumbai (Bandra)',
    quote:
      'AVA ensures zero commission discrepancies and enforces strict NDA protections for editorial campaigns. Their digital portal lets me track every campaign enquiry, shoot date, and contract approval with a single click.',
    projectOutcome: '14 Editorial Covers • 6 Fashion Weeks',
    verifiedBadge: 'Exclusive Supermodel',
    date: 'March 2026',
    isFeatured: true,
    isRealRating: false,
    isLiveRating: false,
  },
  // 7. Client Success Story - Stadium Festival & Conclave
  {
    id: 'test-client-poonawalla-2026',
    name: 'Vikramaditya Bhosale',
    title: 'Festival Director & Cultural Curator',
    organization: 'Maharashtra Heritage Grand Gala',
    authorType: 'client',
    category: 'Cultural Conclave & Arena',
    city: 'Kolhapur / Pune',
    quote:
      'Booking traditional fusion ensembles and celebrity hosts for a 10,000-person festival is high pressure. AVA provided instant PDF contract passes with QR security, ensuring verified artist check-in at the stadium gates without a hitch.',
    projectOutcome: '10,000+ Attendees • Zero Rider Delays',
    verifiedBadge: 'Festival Curator',
    date: 'February 2026',
    isFeatured: true,
    isRealRating: false,
    isLiveRating: false,
  },
  // 8. Artist Success Story - Choreographer & Dance Ensemble Director
  {
    id: 'test-artist-riya-2026',
    name: 'Riya Kulkarni',
    title: 'Principal Choreographer & Dance Director',
    organization: 'AVA Dance Repertory',
    authorType: 'artist',
    category: 'Choreography & Stage',
    city: 'Thane',
    quote:
      'Managing a 30-dancer troupe for live television award ceremonies is complex. AVA guarantees rehearsal insurance, stage rider compliance, and timely disbursements. It gives creators the freedom to produce world-class art.',
    projectOutcome: 'Live Telecast • 30 Troupe Dancers',
    verifiedBadge: 'Master Choreographer',
    date: 'January 2026',
    isFeatured: true,
    isRealRating: false,
    isLiveRating: false,
  }
];
