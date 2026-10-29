import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { TalentProfile, TalentShow } from '../../types';
import {
  MapPin,
  Calendar,
  Users,
  Trophy,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Radio,
  Star,
  ArrowRight,
  Eye,
  Building2,
  X,
  Layers,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { MAHARASHTRA_CITIES, MAHARASHTRA_REGIONS, MaharashtraCity } from '../../data/maharashtraCities';

interface CityGeoData {
  city: MaharashtraCity;
  coordinates: [number, number]; // [longitude, latitude]
  talents: TalentProfile[];
  events: TalentShow[];
}

// Verified Geographic Coordinates for Maharashtra Cities [longitude, latitude]
export const MAHARASHTRA_CITY_COORDINATES: Record<string, [number, number]> = {
  'mumbai': [72.8777, 19.0760],
  'navi-mumbai': [73.0297, 19.0330],
  'thane': [72.9781, 19.2183],
  'kalyan-dombivli': [73.1352, 19.2403],
  'vasai-virar': [72.8091, 19.4259],
  'mira-bhayandar': [72.8561, 19.2952],
  'panvel': [73.1118, 18.9894],
  'palghar': [72.7663, 19.6967],
  'pune': [73.8567, 18.5204],
  'pimpri-chinchwad': [73.8042, 18.6298],
  'kolhapur': [74.2433, 16.7050],
  'solapur': [75.9064, 17.6599],
  'sangli': [74.5636, 16.8524],
  'satara': [73.9903, 17.6805],
  'karad': [74.1837, 17.2885],
  'baramati': [74.5815, 18.1517],
  'ichalkaranji': [74.4608, 16.6922],
  'pandharpur': [75.3283, 17.6778],
  'mahabaleshwar': [73.6586, 17.9307],
  'lonavala': [73.4072, 18.7557],
  'nagpur': [79.0882, 21.1458],
  'amravati': [77.7523, 20.9374],
  'akola': [77.0082, 20.7002],
  'chandrapur': [79.2961, 19.9615],
  'yavatmal': [78.1271, 20.3888],
  'wardha': [78.6022, 20.7453],
  'gondia': [80.1961, 21.4624],
  'bhandara': [79.6540, 21.1714],
  'gadchiroli': [80.0033, 20.1849],
  'washim': [77.1371, 20.1111],
  'buldhana': [76.1804, 20.5287],
  'csn-aurangabad': [75.3433, 19.8762],
  'nanded': [77.3150, 19.1383],
  'latur': [76.5604, 18.4088],
  'jalna': [75.8833, 19.8410],
  'parbhani': [76.7748, 19.2686],
  'beed': [75.7550, 18.9891],
  'dharashiv-osmanabad': [76.0419, 18.1856],
  'hingoli': [77.1396, 19.7188],
  'nashik': [73.7898, 19.9975],
  'jalgaon': [75.5626, 21.0077],
  'dhule': [74.7749, 20.9042],
  'ahilyanagar-ahmednagar': [74.7496, 19.0948],
  'nandurbar': [74.2403, 21.3697],
  'malegaon': [74.5265, 20.5539],
  'shirdi': [74.4762, 19.7668],
  'ratnagiri': [73.3120, 16.9902],
  'sindhudurg': [73.6823, 16.0270],
  'raigad-alibag': [72.8753, 18.6414],
  'chiplun': [73.5186, 17.5323]
};

// Simplified GeoJSON FeatureCollection outline for Maharashtra and its administrative divisions
const MAHARASHTRA_GEOJSON: GeoJSON.FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    // 1. Konkan & Mumbai Coastal Belt
    {
      type: 'Feature',
      properties: { name: 'Konkan & MMR', region: 'Konkan' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [72.65, 19.95], [72.90, 20.10], [73.35, 19.90], [73.40, 19.20],
          [73.55, 18.50], [73.60, 17.80], [73.50, 16.80], [73.80, 15.80],
          [73.50, 15.75], [73.20, 16.50], [72.95, 17.50], [72.75, 18.50],
          [72.70, 19.25], [72.65, 19.95]
        ]]
      }
    },
    // 2. Western Maharashtra (Desh)
    {
      type: 'Feature',
      properties: { name: 'Western Maharashtra', region: 'Western Maharashtra' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.40, 19.20], [74.20, 19.35], [74.90, 19.20], [75.35, 18.70],
          [76.10, 18.30], [76.00, 17.40], [75.60, 17.10], [74.80, 16.50],
          [74.20, 16.20], [73.80, 15.80], [73.50, 16.80], [73.60, 17.80],
          [73.55, 18.50], [73.40, 19.20]
        ]]
      }
    },
    // 3. North Maharashtra (Khandesh)
    {
      type: 'Feature',
      properties: { name: 'North Maharashtra (Khandesh)', region: 'North Maharashtra' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.35, 19.90], [74.10, 20.70], [73.90, 21.60], [74.80, 22.00],
          [75.80, 21.70], [76.20, 21.30], [76.00, 20.70], [75.30, 20.30],
          [74.60, 19.90], [74.20, 19.35], [73.40, 19.20], [73.35, 19.90]
        ]]
      }
    },
    // 4. Marathwada
    {
      type: 'Feature',
      properties: { name: 'Marathwada', region: 'Marathwada' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [74.90, 19.20], [75.30, 20.30], [76.00, 20.70], [76.60, 20.40],
          [77.40, 20.00], [77.80, 19.60], [77.70, 18.70], [77.20, 18.20],
          [76.40, 17.90], [76.10, 18.30], [75.35, 18.70], [74.90, 19.20]
        ]]
      }
    },
    // 5. Vidarbha
    {
      type: 'Feature',
      properties: { name: 'Vidarbha', region: 'Vidarbha' },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [76.20, 21.30], [76.90, 21.60], [78.20, 21.75], [79.40, 21.80],
          [80.50, 21.60], [80.90, 20.80], [80.40, 19.50], [79.80, 19.00],
          [78.90, 19.40], [77.80, 19.60], [77.40, 20.00], [76.60, 20.40],
          [76.00, 20.70], [76.20, 21.30]
        ]]
      }
    }
  ]
};

// Curated live events & booked tours across Maharashtra venues
const SAMPLE_MAHARASHTRA_BOOKED_SHOWS: TalentShow[] = [
  {
    id: 'booked-event-mumbai-fashion-gala',
    title: 'AVA Haute Couture Fashion Gala 2026',
    category: 'Fashion & Runway',
    bannerUrl: '',
    description: 'Premier A-list showstoppers, red carpet arrivals, and live satellite 4K broadcast.',
    eventDate: 'November 28, 2026',
    registrationDeadline: 'November 15, 2026',
    format: 'Hybrid',
    venue: 'Jio World Convention Centre, BKC',
    city: 'Mumbai',
    eligibility: 'Supermodels, designers & VIP guests',
    feeType: 'Paid',
    feeAmount: '₹5,000 - ₹25,000',
    status: 'Registration Open',
    isPublished: true,
    registeredCount: 380,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booked-event-pune-symphony',
    title: 'Pune Symphony Arena: Live Bollywood Orchestra',
    category: 'Singers & Playback Musicians',
    bannerUrl: '',
    description: 'Headline playback vocalists and 45-piece live instrumental acoustic symphony.',
    eventDate: 'December 05, 2026',
    registrationDeadline: 'November 25, 2026',
    format: 'Physical',
    venue: 'Balewadi Stadium & Arena',
    city: 'Pune',
    eligibility: 'All Music Lovers & VIP Passholders',
    feeType: 'Paid',
    feeAmount: '₹1,500',
    status: 'Registration Open',
    isPublished: true,
    registeredCount: 650,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booked-event-nagpur-youth-fest',
    title: 'Vidarbha Star Talent Awards & Arena Concert',
    category: 'Celebrity Appearance',
    bannerUrl: '',
    description: 'Annual celebrity awards honoring central India performers with live stage headline act.',
    eventDate: 'December 12, 2026',
    registrationDeadline: 'December 01, 2026',
    format: 'Physical',
    venue: 'Suresh Bhat Auditorium, Reshimbagh',
    city: 'Nagpur',
    eligibility: 'Nominated Artists & Public Audience',
    feeType: 'Free',
    status: 'Registration Open',
    isPublished: true,
    registeredCount: 410,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booked-event-nashik-film-conclave',
    title: 'Godavari International Film & Casting Conclave',
    category: 'Actors & Actresses',
    bannerUrl: '',
    description: 'Screenwriting panels, monologue audition screenings, and A-list director roundtables.',
    eventDate: 'December 20, 2026',
    registrationDeadline: 'December 10, 2026',
    format: 'Physical',
    venue: 'Mahakavi Kalidas Kalamandir',
    city: 'Nashik',
    eligibility: 'Actors, Directors & Film Students',
    feeType: 'Paid',
    feeAmount: '₹800',
    status: 'Registration Open',
    isPublished: true,
    registeredCount: 290,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booked-event-kolhapur-marathi-theatre',
    title: 'Mahalaxmi Natya Mahotsav & Classical Stage Festival',
    category: 'Dancers & Stage Drama',
    bannerUrl: '',
    description: 'Celebrated Marathi and Sanskrit dramatic performances, classical Kathak & Lavani showcases.',
    eventDate: 'January 08, 2027',
    registrationDeadline: 'December 28, 2026',
    format: 'Physical',
    venue: 'Keshavrao Bhosale Natyagruha',
    city: 'Kolhapur',
    eligibility: 'Theatre troupes and certified performers',
    feeType: 'Paid',
    feeAmount: '₹500',
    status: 'Registration Open',
    isPublished: true,
    registeredCount: 310,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'booked-event-aurangabad-heritage',
    title: 'Ellora-Ajanta Heritage Cultural Pageant',
    category: 'Cultural & Live Production',
    bannerUrl: '',
    description: 'Spectacular historic monument projection mapping, classical fusion dance, and royal celebrity arrivals.',
    eventDate: 'January 16, 2027',
    registrationDeadline: 'January 05, 2027',
    format: 'Physical',
    venue: 'Prozone Amphitheatre',
    city: 'Chhatrapati Sambhaji Nagar (Aurangabad)',
    eligibility: 'Open Invitation & VIP Dignitaries',
    feeType: 'Free',
    status: 'Registration Open',
    isPublished: true,
    registeredCount: 520,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

interface MaharashtraTalentEventMapProps {
  profiles: TalentProfile[];
  shows?: TalentShow[];
  onViewProfile: (profile: TalentProfile) => void;
  onBookTalent: (profile: TalentProfile) => void;
  onFilterByCity?: (cityName: string) => void;
  onCloseMap?: () => void;
}

export const MaharashtraTalentEventMap: React.FC<MaharashtraTalentEventMapProps> = ({
  profiles,
  shows = [],
  onViewProfile,
  onBookTalent,
  onFilterByCity,
  onCloseMap
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeLayer, setActiveLayer] = useState<'all' | 'talent' | 'events'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('All Maharashtra');
  const [selectedCityId, setSelectedCityId] = useState<string | null>('mumbai');
  const [hoveredCity, setHoveredCity] = useState<CityGeoData | null>(null);

  // Combine live and default shows
  const allShows = useMemo(() => {
    const list = [...shows];
    for (const sample of SAMPLE_MAHARASHTRA_BOOKED_SHOWS) {
      if (!list.some((s) => s.id === sample.id || s.title === sample.title)) {
        list.push(sample);
      }
    }
    return list;
  }, [shows]);

  // Map cities to talents and events
  const cityGeoDataMap = useMemo(() => {
    const map = new Map<string, CityGeoData>();

    MAHARASHTRA_CITIES.forEach((city) => {
      const coords = MAHARASHTRA_CITY_COORDINATES[city.id] || [75.0, 19.0];

      // Match talent profiles to this city
      const cityTalents = profiles.filter((p) => {
        if (!p.city) return false;
        const pCity = p.city.toLowerCase();
        const cName = city.name.toLowerCase();
        const cId = city.id.toLowerCase();
        return pCity.includes(cName) || pCity.includes(cId) || (cId === 'mumbai' && pCity.includes('bandra'));
      });

      // Match shows/events to this city
      const cityEvents = allShows.filter((s) => {
        if (!s.city) return false;
        const sCity = s.city.toLowerCase();
        const cName = city.name.toLowerCase();
        const cId = city.id.toLowerCase();
        return sCity.includes(cName) || sCity.includes(cId) || (cId === 'csn-aurangabad' && (sCity.includes('aurangabad') || sCity.includes('sambhaji')));
      });

      map.set(city.id, {
        city,
        coordinates: coords,
        talents: cityTalents,
        events: cityEvents
      });
    });

    return map;
  }, [profiles, allShows]);

  // Aggregate stats
  const totalMappedTalents = useMemo(() => {
    let count = 0;
    cityGeoDataMap.forEach((d) => (count += d.talents.length));
    return count > 0 ? count : profiles.length;
  }, [cityGeoDataMap, profiles]);

  const totalMappedEvents = useMemo(() => {
    let count = 0;
    cityGeoDataMap.forEach((d) => (count += d.events.length));
    return count;
  }, [cityGeoDataMap]);

  const activeHubsCount = useMemo(() => {
    let count = 0;
    cityGeoDataMap.forEach((d) => {
      if (d.talents.length > 0 || d.events.length > 0) count++;
    });
    return count;
  }, [cityGeoDataMap]);

  // Selected city data
  const selectedCityData = useMemo(() => {
    if (!selectedCityId) return null;
    return cityGeoDataMap.get(selectedCityId) || null;
  }, [selectedCityId, cityGeoDataMap]);

  // D3 Rendering & Projection
  useEffect(() => {
    if (!svgRef.current) return;

    const width = 860;
    const height = 580;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Defs for luxury gold gradients and glowing drop shadows
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'gold-glow').attr('x', '-30%').attr('y', '-30%').attr('width', '160%').attr('height', '160%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    filter.append('feMerge').selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', (d) => d);

    // Event red glow filter
    const redFilter = defs.append('filter').attr('id', 'red-glow').attr('x', '-40%').attr('y', '-40%').attr('width', '180%').attr('height', '180%');
    redFilter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'blur');
    redFilter.append('feMerge').selectAll('feMergeNode')
      .data(['blur', 'SourceGraphic'])
      .enter()
      .append('feMergeNode')
      .attr('in', (d) => d);

    // Linear gradient for map background
    const bgGradient = defs.append('linearGradient').attr('id', 'map-bg').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    bgGradient.append('stop').attr('offset', '0%').attr('stop-color', '#12121A').attr('stop-opacity', '0.95');
    bgGradient.append('stop').attr('offset', '50%').attr('stop-color', '#18121E').attr('stop-opacity', '0.95');
    bgGradient.append('stop').attr('offset', '100%').attr('stop-color', '#0F0F14').attr('stop-opacity', '0.95');

    // Gradient for transit lines
    const arcGradient = defs.append('linearGradient').attr('id', 'arc-gradient').attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '100%');
    arcGradient.append('stop').attr('offset', '0%').attr('stop-color', '#D4AF37').attr('stop-opacity', '0.8');
    arcGradient.append('stop').attr('offset', '100%').attr('stop-color', '#E11D48').attr('stop-opacity', '0.9');

    // Master zoomable group
    const g = svg.append('g').attr('class', 'map-container');

    // D3 Projection configured specifically for Maharashtra
    const projection = d3.geoMercator()
      .center([76.6, 18.9]) // Centered on Maharashtra
      .scale(3200)
      .translate([width / 2, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // 1. Draw Regional Land Polygons
    g.append('g')
      .attr('class', 'regions-group')
      .selectAll('path')
      .data(MAHARASHTRA_GEOJSON.features)
      .enter()
      .append('path')
      .attr('d', pathGenerator as any)
      .attr('fill', 'url(#map-bg)')
      .attr('stroke', '#D4AF37')
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', 1.2)
      .attr('class', 'region-path transition-all duration-300')
      .style('cursor', 'pointer')
      .on('mouseenter', function (_event, d: any) {
        d3.select(this)
          .attr('stroke', '#F3D068')
          .attr('stroke-width', 2)
          .attr('stroke-opacity', 0.8)
          .attr('fill', '#201828');
      })
      .on('mouseleave', function () {
        d3.select(this)
          .attr('stroke', '#D4AF37')
          .attr('stroke-width', 1.2)
          .attr('stroke-opacity', 0.35)
          .attr('fill', 'url(#map-bg)');
      });

    // 2. Event Transit Flight Arcs (connecting Mumbai headliner studio to major event hubs)
    const mumbaiCoords = projection(MAHARASHTRA_CITY_COORDINATES['mumbai']) || [width / 4, height / 2];
    const destinationCityKeys = ['pune', 'nagpur', 'nashik', 'kolhapur', 'csn-aurangabad'];

    const arcsGroup = g.append('g').attr('class', 'event-transit-arcs');

    destinationCityKeys.forEach((destKey) => {
      const destCoords = projection(MAHARASHTRA_CITY_COORDINATES[destKey]);
      if (!destCoords) return;

      const [x1, y1] = mumbaiCoords;
      const [x2, y2] = destCoords;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;

      arcsGroup.append('path')
        .attr('d', `M${x1},${y1}A${dr},${dr} 0 0,1 ${x2},${y2}`)
        .attr('fill', 'none')
        .attr('stroke', 'url(#arc-gradient)')
        .attr('stroke-width', 1.4)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', activeLayer === 'talent' ? 0.15 : 0.65)
        .style('pointer-events', 'none');
    });

    // 3. City Nodes & Interactive Hubs
    const nodesGroup = g.append('g').attr('class', 'city-nodes');

    const cityList = Array.from(cityGeoDataMap.values()).filter((item) => {
      if (selectedRegion !== 'All Maharashtra' && item.city.region !== selectedRegion) {
        return false;
      }
      return true;
    });

    cityList.forEach((item) => {
      const projected = projection(item.coordinates);
      if (!projected) return;
      const [x, y] = projected;

      const hasTalent = item.talents.length > 0;
      const hasEvents = item.events.length > 0;
      const isSelected = selectedCityId === item.city.id;

      // Filter layer logic
      if (activeLayer === 'talent' && !hasTalent && !item.city.popularForEvents) return;
      if (activeLayer === 'events' && !hasEvents) return;

      const cityGroup = nodesGroup.append('g')
        .attr('transform', `translate(${x},${y})`)
        .attr('class', `city-node cursor-pointer select-none`)
        .on('click', () => {
          setSelectedCityId(item.city.id);
        })
        .on('mouseenter', () => {
          setHoveredCity(item);
        })
        .on('mouseleave', () => {
          setHoveredCity(null);
        });

      // Animated Pulse Ring for Booked Events
      if (hasEvents && activeLayer !== 'talent') {
        cityGroup.append('circle')
          .attr('r', 14)
          .attr('fill', 'none')
          .attr('stroke', '#E11D48')
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.8)
          .attr('class', 'animate-ping')
          .style('transform-origin', 'center');

        cityGroup.append('circle')
          .attr('r', 10)
          .attr('fill', 'rgba(225, 29, 72, 0.25)')
          .attr('stroke', '#FB7185')
          .attr('stroke-width', 1.2)
          .attr('filter', 'url(#red-glow)');
      }

      // Outer Glow for Selected City
      if (isSelected) {
        cityGroup.append('circle')
          .attr('r', 13)
          .attr('fill', 'none')
          .attr('stroke', '#D4AF37')
          .attr('stroke-width', 2.5)
          .attr('filter', 'url(#gold-glow)');
      }

      // Base Node Jewel
      const baseRadius = hasEvents ? 7 : (hasTalent ? 6 : 4);
      cityGroup.append('circle')
        .attr('r', baseRadius)
        .attr('fill', hasEvents ? '#E11D48' : (hasTalent ? '#D4AF37' : '#4B5563'))
        .attr('stroke', '#FFFFFF')
        .attr('stroke-width', isSelected ? 2 : 1)
        .attr('filter', hasTalent || isSelected ? 'url(#gold-glow)' : null);

      // Inner Core
      cityGroup.append('circle')
        .attr('r', 2)
        .attr('fill', '#FFFFFF');

      // City Label
      const isMajor = ['mumbai', 'pune', 'nagpur', 'nashik', 'kolhapur', 'csn-aurangabad'].includes(item.city.id);
      if (isMajor || isSelected || hasEvents) {
        const textLabel = cityGroup.append('text')
          .attr('x', 0)
          .attr('y', -10)
          .attr('text-anchor', 'middle')
          .attr('fill', isSelected ? '#F3D068' : (hasEvents ? '#FDA4AF' : '#E5E7EB'))
          .attr('font-size', isSelected ? '11px' : (isMajor ? '10px' : '9px'))
          .attr('font-family', 'Cinzel, sans-serif')
          .attr('font-weight', isSelected || isMajor ? 'bold' : 'normal')
          .attr('stroke', '#08080C')
          .attr('stroke-width', 2.5)
          .attr('paint-order', 'stroke')
          .text(item.city.name);

        // Badge indicator on major nodes
        if (hasEvents) {
          textLabel.text(`★ ${item.city.name}`);
        }
      }
    });

  }, [cityGeoDataMap, selectedRegion, activeLayer, selectedCityId]);

  // Zoom control helpers
  const handleZoomIn = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      1.3
    );
  };

  const handleZoomOut = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(
      d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
      0.7
    );
  };

  const handleResetZoom = () => {
    if (!svgRef.current) return;
    d3.select(svgRef.current).transition().duration(500).call(
      d3.zoom<SVGSVGElement, unknown>().transform as any,
      d3.zoomIdentity
    );
    setSelectedCityId('mumbai');
  };

  return (
    <div className="card-luxury rounded-2xl border-gold-glow overflow-hidden bg-[#0A0A0F] shadow-2xl relative my-6">
      {/* Top Header & Map Action Bar */}
      <div className="p-4 sm:p-6 border-b border-white/10 bg-gradient-to-r from-[#1B050B] via-[#0E0E16] to-[#1F1808] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#F3D068] text-[10px] font-cinzel font-bold tracking-widest uppercase mb-2 shadow">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>MAHARASHTRA GEOGRAPHIC TALENT & EVENT VISUALIZATION • POWERED BY D3</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <span>Statewide Talent Roster & Live Booked Galas</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
              Live Interactive Map
            </span>
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Explore verified artists and scheduled celebrity appearances across all 36 Maharashtra districts using responsive vector cartography.
          </p>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Active Hubs</span>
            <span className="text-sm font-cinzel font-black text-[#D4AF37]">{activeHubsCount} Cities</span>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
            <span className="text-[10px] text-gray-400 uppercase font-mono block">Booked Galas</span>
            <span className="text-sm font-cinzel font-black text-rose-400">{totalMappedEvents} Live</span>
          </div>
          {onCloseMap && (
            <button
              onClick={onCloseMap}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition cursor-pointer"
              title="Close Map View"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Layer Filter Toolbar */}
      <div className="p-3 sm:px-6 bg-[#0E0E14] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Layer Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveLayer('all')}
            className={`px-3 py-1.5 rounded-lg font-cinzel font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeLayer === 'all'
                ? 'bg-[#D4AF37] text-black shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Nodes</span>
          </button>
          <button
            onClick={() => setActiveLayer('talent')}
            className={`px-3 py-1.5 rounded-lg font-cinzel font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeLayer === 'talent'
                ? 'bg-[#D4AF37] text-black shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Talent Locations ({totalMappedTalents})</span>
          </button>
          <button
            onClick={() => setActiveLayer('events')}
            className={`px-3 py-1.5 rounded-lg font-cinzel font-bold text-xs transition cursor-pointer flex items-center gap-1.5 ${
              activeLayer === 'events'
                ? 'bg-rose-600 text-white shadow'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Booked Events & Tours ({totalMappedEvents})</span>
          </button>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400">Region:</span>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-[#14141E] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          >
            {MAHARASHTRA_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Stage: SVG Canvas + City Inspector Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* D3 Vector Map Canvas (8 Columns on Desktop) */}
        <div ref={containerRef} className="lg:col-span-7 xl:col-span-8 relative bg-gradient-to-b from-[#08080C] to-[#0A0A10] overflow-hidden flex items-center justify-center p-2">
          <svg
            ref={svgRef}
            viewBox="0 0 860 580"
            className="w-full h-auto max-h-[580px] select-none"
            style={{ touchAction: 'none' }}
          />

          {/* Map Controls Floating Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-[#12121A]/90 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-xl z-20">
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-[#D4AF37]" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-[#D4AF37]" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Legend Floating Overlay */}
          <div className="absolute bottom-4 left-4 p-2.5 rounded-xl bg-[#0E0E14]/90 backdrop-blur-md border border-white/10 text-[11px] text-gray-300 space-y-1.5 shadow-lg pointer-events-none z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48] animate-ping" />
              <span>Booked Live Gala / Concert Arena</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]" />
              <span>AVA Talent Home Base</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 border-t border-dashed border-[#D4AF37]" />
              <span>Executive Tour Transit Corridor</span>
            </div>
          </div>

          {/* Hover Tooltip Overlay */}
          {hoveredCity && (
            <div className="absolute top-4 left-4 pointer-events-none z-30 p-2.5 rounded-xl bg-black/90 border border-[#D4AF37]/50 shadow-2xl animate-fadeIn text-xs">
              <div className="font-cinzel font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{hoveredCity.city.name} ({hoveredCity.city.marathiName})</span>
              </div>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">{hoveredCity.city.region}</div>
              <div className="mt-1 pt-1 border-t border-white/10 flex items-center gap-3 text-[11px]">
                <span className="text-[#D4AF37]">Talents: {hoveredCity.talents.length}</span>
                <span className="text-rose-400">Events: {hoveredCity.events.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected City Inspector & Details Drawer (4-5 Columns on Desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0C0C12] p-4 sm:p-6 flex flex-col justify-between overflow-y-auto max-h-[580px]">
          {selectedCityData ? (
            <div className="space-y-5 animate-fadeIn">
              {/* City Headline */}
              <div className="border-b border-white/10 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                    {selectedCityData.city.region}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    Lat/Long: {selectedCityData.coordinates[1].toFixed(2)}°N, {selectedCityData.coordinates[0].toFixed(2)}°E
                  </span>
                </div>

                <h3 className="font-cinzel text-xl sm:text-2xl font-black text-white mt-2 flex items-center gap-2">
                  <span>{selectedCityData.city.name}</span>
                  <span className="text-sm font-normal text-[#D4AF37]">({selectedCityData.city.marathiName})</span>
                </h3>

                <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                  {selectedCityData.city.popularForEvents
                    ? 'Major Maharashtra entertainment hub with dedicated luxury concert arenas, corporate gala auditoriums, and high-frequency talent bookings.'
                    : 'Strategic regional center with verified performing talent and ongoing cultural showcases.'}
                </p>
              </div>

              {/* Booked Events in this City */}
              <div>
                <h4 className="font-cinzel text-xs uppercase tracking-widest text-rose-400 font-bold mb-2.5 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Scheduled Shows & Booked Galas ({selectedCityData.events.length})</span>
                </h4>

                {selectedCityData.events.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedCityData.events.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 rounded-xl bg-[#14141E] border border-rose-500/20 hover:border-rose-500/50 transition group"
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-white group-hover:text-[#F3D068] transition">
                            {event.title}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 font-mono border border-rose-500/30">
                            {event.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[#D4AF37]" />
                            {event.eventDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 text-cyan-400" />
                            {event.venue}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/5 text-gray-400 text-xs text-center border border-white/5">
                    No major arena galas currently scheduled in this city. Private bookings available.
                  </div>
                )}
              </div>

              {/* Artists & Talent Based in this City */}
              <div>
                <h4 className="font-cinzel text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-2.5 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>Artists & Talent Based Here ({selectedCityData.talents.length})</span>
                </h4>

                {selectedCityData.talents.length > 0 ? (
                  <div className="space-y-2.5">
                    {selectedCityData.talents.map((talent) => (
                      <div
                        key={talent.id}
                        className="p-3 rounded-xl bg-[#14141E] border border-white/10 hover:border-[#D4AF37]/50 transition flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {talent.photoUrl ? (
                            <img
                              src={talent.photoUrl}
                              alt={talent.name}
                              className="w-9 h-9 rounded-full object-cover border border-[#D4AF37]/50 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#2A0812] border border-[#D4AF37]/50 flex items-center justify-center text-xs font-bold text-[#F3D068] shrink-0">
                              {talent.name[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-cinzel text-xs font-bold text-white block truncate group-hover:text-[#F3D068] transition">
                              {talent.name}
                            </span>
                            <span className="text-[10px] text-gray-400 block truncate">
                              {talent.categoryName} • {talent.subcategory || 'Certified Artist'}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => onViewProfile(talent)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition cursor-pointer"
                            title="View Full Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onBookTalent(talent)}
                            className="btn-gold px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase cursor-pointer"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-white/5 text-gray-400 text-xs text-center border border-white/5">
                    Talent submissions open for this district. Inquire via AVA Casting Bureau.
                  </div>
                )}
              </div>

              {/* Action: Filter Directory by this City */}
              {onFilterByCity && (
                <div className="pt-2">
                  <button
                    onClick={() => onFilterByCity(selectedCityData.city.name)}
                    className="w-full py-2.5 rounded-xl bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#F3D068] hover:text-black border border-[#D4AF37]/40 text-xs font-cinzel font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <span>Filter Directory by {selectedCityData.city.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 text-xs p-6">
              <Compass className="w-10 h-10 mb-2 text-[#D4AF37]/40" />
              <p>Click on any city node on the vector map to inspect local artists and booked galas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
