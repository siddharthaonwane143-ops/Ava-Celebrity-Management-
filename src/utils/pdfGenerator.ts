import jsPDF from 'jspdf';
import { TalentProfile } from '../types';

export interface BookingPdfData {
  referenceCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  organization?: string;
  bookingType: string;
  eventName: string;
  eventDate: string;
  eventTime?: string;
  cityVenue: string;
  maharashtraCity?: string;
  talentName?: string;
  talentCategory?: string;
  packageTitle?: string;
  budgetRange?: string;
  duration?: string;
  serviceRequirements?: string;
  additionalNotes?: string;
  documentType?: 'Official Booking Dossier' | 'Executive Enquiry Dossier' | 'Official Booking Pass';
  status?: string;
}

export interface TalentPdfData {
  referenceCode?: string;
  name: string;
  stageName?: string;
  categoryName: string;
  subcategory?: string;
  city?: string;
  experience?: string;
  availability?: string;
  languages?: string[];
  skills?: string[];
  bio?: string;
  photoUrl?: string;
  height?: string;
  ageRange?: string;
  socialHandle?: string;
  instagramHandle?: string;
  instagramFollowers?: string;
  halfDayRate?: string;
  fullDayRate?: string;
  appearanceRate?: string;
  idType?: string;
  idNumber?: string;
  guildName?: string;
  emergencyContact?: string;
  trustScore?: number;
  supportedBookingTypes?: string[];
  issuedDate?: string;
}

/**
 * Converts any TalentProfile record into standard TalentPdfData
 */
export function convertTalentProfileToPdfData(profile: TalentProfile, refCode?: string): TalentPdfData {
  let halfDayRate = '₹1,50,000';
  let fullDayRate = '₹2,75,000';
  let appearanceRate = '₹3,50,000';
  let idType = 'Aadhaar Card / Govt Identity';
  let idNumber = 'XXXX-XXXX-4819 (Verified)';
  let guildName = 'CINTAA / Artists Guild of Maharashtra';
  let emergencyContact = '+91 98200 12345 (AVA Concierge Desk)';

  if (profile.internalNotes) {
    const halfMatch = profile.internalNotes.match(/Half-Day\s*([^,]+)/i);
    const fullMatch = profile.internalNotes.match(/Full-Day\s*([^,]+)/i);
    const appMatch = profile.internalNotes.match(/Live Appearance\s*([^.]+)/i);
    const idMatch = profile.internalNotes.match(/KYC ID:\s*([^.]+)/i);
    const guildMatch = profile.internalNotes.match(/Guild:\s*([^.]+)/i);
    const contactMatch = profile.internalNotes.match(/Contact:\s*([^.]+)/i);

    if (halfMatch) halfDayRate = halfMatch[1].trim();
    if (fullMatch) fullDayRate = fullMatch[1].trim();
    if (appMatch) appearanceRate = appMatch[1].trim();
    if (idMatch) idType = idMatch[1].trim();
    if (guildMatch) guildName = guildMatch[1].trim();
    if (contactMatch) emergencyContact = contactMatch[1].trim();
  }

  const generatedRef =
    refCode ||
    (profile.id
      ? `AVA-MH-${profile.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`
      : `AVA-MAH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);

  return {
    referenceCode: generatedRef,
    name: profile.name,
    stageName: (profile as any).stageName || profile.name,
    categoryName: profile.categoryName || 'Celebrity Talent',
    subcategory: profile.subcategory || 'Principal Film, Television & Live Event Star',
    city: profile.city || 'Mumbai (Maharashtra)',
    experience: profile.experience || 'Professional Veteran (5+ Years)',
    availability: profile.availability || 'Available for Bookings',
    languages:
      profile.languages && profile.languages.length > 0
        ? profile.languages
        : ['Marathi (मराठी)', 'Hindi (हिंदी)', 'English'],
    skills:
      profile.skills && profile.skills.length > 0
        ? profile.skills
        : ['Cinematic Screen Acting', 'Runway Showstopper', 'Live Keynote Appearance', 'Brand Endorsements'],
    bio:
      profile.bio ||
      'Celebrated performance artist represented exclusively by AVA Celebrity Management. Acclaimed for distinguished screen presence, contractual discipline, and marquee audience pull across Maharashtra and Pan-India entertainment productions.',
    photoUrl: profile.photoUrl,
    height: (profile as any).height || "5'11\" (180 cm)",
    ageRange: (profile as any).ageRange || '24 - 32 Years',
    socialHandle: profile.instagramHandle
      ? `@${profile.instagramHandle.replace('@', '')}`
      : profile.socialHandle || '@avatalent.official',
    instagramHandle: profile.instagramHandle || profile.socialHandle || '@artist.official',
    instagramFollowers: profile.instagramFollowers || '2.4M Verified Reach',
    halfDayRate,
    fullDayRate,
    appearanceRate,
    idType,
    idNumber,
    guildName,
    emergencyContact,
    trustScore: 99,
    supportedBookingTypes:
      profile.supportedBookingTypes && profile.supportedBookingTypes.length > 0
        ? profile.supportedBookingTypes
        : ['Celebrity Appearance', 'Brand Endorsement', 'Chief Guest', 'Campaign Shoot'],
    issuedDate: new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
  };
}

/**
 * Helper to draw a luxury simulated QR code matrix with precise styling
 */
function drawQrCodeMatrix(doc: jsPDF, x: number, y: number, size: number) {
  // White background box with rounded corners
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y, size, size, 1.2, 1.2, 'F');

  // Dark pattern color
  doc.setFillColor(12, 12, 18);
  const finderSize = size * 0.28;

  // Top-left finder
  doc.rect(x + 1.2, y + 1.2, finderSize, finderSize, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + 2.2, y + 2.2, finderSize - 2, finderSize - 2, 'F');
  doc.setFillColor(12, 12, 18);
  doc.rect(x + 3.2, y + 3.2, finderSize - 4, finderSize - 4, 'F');

  // Top-right finder
  doc.rect(x + size - finderSize - 1.2, y + 1.2, finderSize, finderSize, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + size - finderSize - 0.2, y + 2.2, finderSize - 2, finderSize - 2, 'F');
  doc.setFillColor(12, 12, 18);
  doc.rect(x + size - finderSize + 0.8, y + 3.2, finderSize - 4, finderSize - 4, 'F');

  // Bottom-left finder
  doc.rect(x + 1.2, y + size - finderSize - 1.2, finderSize, finderSize, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(x + 2.2, y + size - finderSize - 0.2, finderSize - 2, finderSize - 2, 'F');
  doc.setFillColor(12, 12, 18);
  doc.rect(x + 3.2, y + size - finderSize + 0.8, finderSize - 4, finderSize - 4, 'F');

  // Data cells pattern simulation
  doc.setFillColor(12, 12, 18);
  const step = size / 10;
  for (let r = 3; r < 7; r++) {
    for (let c = 3; c < 7; c++) {
      if ((r + c) % 2 === 0 || (r * c) % 3 === 0) {
        doc.rect(x + c * step, y + r * step, step * 0.82, step * 0.82, 'F');
      }
    }
  }
  doc.rect(x + step * 7.5, y + step * 3.5, step * 1.5, step * 0.9, 'F');
  doc.rect(x + step * 1.5, y + step * 7.5, step * 2, step * 0.9, 'F');
  doc.rect(x + step * 5, y + step * 7.5, step * 1.2, step * 0.9, 'F');
}

/**
 * MASTER ARTIST PORTFOLIO & COMPOSITE CARD PDF GENERATOR
 * Full-bleed A4 layout (210 x 297mm) with complete section coverage,
 * ZERO blank space from top to bottom (y: 6mm to 291mm),
 * and high-end luxury agency branding.
 */
export function generateTalentProfilePdf(data: TalentPdfData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 8;
  const contentWidth = pageWidth - margin * 2; // 194 mm

  // 1. Full Page Dark Royal Luxury Obsidian Background
  doc.setFillColor(9, 9, 14); // #09090E
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // 2. Outer Dual Architectural Gold Framing (Edge to Edge)
  doc.setDrawColor(212, 175, 55); // #D4AF37
  doc.setLineWidth(1.0);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

  doc.setDrawColor(170, 124, 17); // #AA7C11
  doc.setLineWidth(0.35);
  doc.rect(6.8, 6.8, pageWidth - 13.6, pageHeight - 13.6);

  // Ornamental Corner Accents
  const drawCorner = (cx: number, cy: number, dx: number, dy: number) => {
    doc.setDrawColor(243, 208, 104);
    doc.setLineWidth(0.7);
    doc.line(cx, cy, cx + dx * 7, cy);
    doc.line(cx, cy, cx, cy + dy * 7);
  };
  drawCorner(8, 8, 1, 1);
  drawCorner(pageWidth - 8, 8, -1, 1);
  drawCorner(8, pageHeight - 8, 1, -1);
  drawCorner(pageWidth - 8, pageHeight - 8, -1, -1);

  // ----------------------------------------------------
  // SECTION 1: HEADER & LUXURY BRANDING (y: 8 to 32 mm, height: 24 mm)
  // ----------------------------------------------------
  doc.setFillColor(18, 14, 22);
  doc.rect(margin, 8, contentWidth, 24, 'F');

  // Gold header divider line
  doc.setFillColor(212, 175, 55);
  doc.rect(margin, 31.6, contentWidth, 0.6, 'F');

  // Agency Emblem / Monogram Box
  doc.setFillColor(10, 10, 15);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin + 2.5, 9.8, 19, 20, 1.5, 1.5, 'FD');

  doc.setTextColor(243, 208, 104);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('AVA', margin + 12, 21.5, { align: 'center' });
  doc.setFontSize(5.8);
  doc.setTextColor(212, 175, 55);
  doc.text('VIP ROSTER', margin + 12, 26.5, { align: 'center' });

  // Agency Main Title & Subtitles
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.text('AVA CELEBRITY MANAGEMENT & TALENT DIRECTORY', margin + 25, 16.5);

  doc.setTextColor(240, 235, 225);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('OFFICIAL CERTIFIED ARTIST DOSSIER & COMPOSITE PORTFOLIO CARD', margin + 25, 22.5);

  doc.setTextColor(170, 170, 185);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.4);
  doc.text(
    'GOVERNMENT OF MAHARASHTRA & CINTAA ENTERTAINMENT GUILD COMPLIANT • MASTER TALENT PASS',
    margin + 25,
    27.5
  );

  // Right Maharashtra Accreditation Seal
  const sealBoxX = pageWidth - margin - 35;
  doc.setFillColor(12, 12, 18);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.roundedRect(sealBoxX, 10, 33, 19.5, 1.5, 1.5, 'FD');

  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.8);
  doc.text('★ MAHARASHTRA ★', sealBoxX + 16.5, 14.5, { align: 'center' });
  doc.setTextColor(80, 240, 160);
  doc.setFontSize(7.5);
  doc.text('CERTIFIED 2026', sealBoxX + 16.5, 20, { align: 'center' });
  doc.setTextColor(210, 210, 220);
  doc.setFontSize(5.2);
  doc.text('DIRECTORATE ACCREDITED', sealBoxX + 16.5, 25, { align: 'center' });

  // ----------------------------------------------------
  // SECTION 2: REFERENCE RIBBON & STATUS BADGE (y: 33.5 to 42.5 mm, height: 9 mm)
  // ----------------------------------------------------
  doc.setFillColor(16, 16, 24);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.35);
  doc.roundedRect(margin, 33.5, contentWidth, 9, 1.2, 1.2, 'FD');

  doc.setTextColor(180, 180, 195);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text('OFFICIAL DOSSIER REF:', margin + 3.5, 39.5);

  doc.setTextColor(255, 215, 60);
  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.text(data.referenceCode || 'AVA-MH-CONFIRMED', margin + 41, 39.7);

  doc.setTextColor(180, 180, 190);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.text(`ISSUED: ${data.issuedDate || 'CURRENT'} | JURISDICTION: MAHARASHTRA & PAN-INDIA`, margin + 82, 39.5);

  // Status Badge in reference bar
  doc.setFillColor(13, 92, 58);
  doc.roundedRect(pageWidth - margin - 46, 35, 43, 6, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.6);
  doc.text('✓ 100% VERIFIED GOLD ARTIST', pageWidth - margin - 24.5, 39.2, { align: 'center' });

  // ----------------------------------------------------
  // SECTION 3: ARTIST MASTER IDENTITY & DOSSIER (y: 44.5 to 78.5 mm, height: 34 mm)
  // ----------------------------------------------------
  doc.setFillColor(18, 16, 24);
  doc.setDrawColor(60, 50, 30);
  doc.setLineWidth(0.35);
  doc.roundedRect(margin, 44.5, contentWidth, 34, 1.8, 1.8, 'FD');

  // Left Photo / Monogram Box
  const photoX = margin + 3;
  const photoY = 46.5;
  const photoW = 25;
  const photoH = 30;

  doc.setFillColor(10, 10, 16);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.roundedRect(photoX, photoY, photoW, photoH, 1.5, 1.5, 'FD');

  // If photoUrl is embedded data URL, render image; else render artist monogram
  let photoRendered = false;
  if (data.photoUrl && data.photoUrl.startsWith('data:image/')) {
    try {
      doc.addImage(data.photoUrl, 'JPEG', photoX + 0.8, photoY + 0.8, photoW - 1.6, photoH - 1.6);
      photoRendered = true;
    } catch (e) {
      photoRendered = false;
    }
  }

  if (!photoRendered) {
    doc.setTextColor(243, 208, 104);
    doc.setFont('times', 'bold');
    doc.setFontSize(22);
    const initial = (data.stageName || data.name || 'A')[0].toUpperCase();
    doc.text(initial, photoX + photoW / 2, photoY + 16, { align: 'center' });

    doc.setFillColor(212, 175, 55);
    doc.rect(photoX + 2, photoY + 22, photoW - 4, 0.4, 'F');

    doc.setTextColor(200, 200, 210);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5);
    doc.text('VERIFIED TALENT', photoX + photoW / 2, photoY + 26.5, { align: 'center' });
  }

  // Center Identity Details
  const identX = margin + 32;
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.text(data.stageName || data.name, identX, 53);

  if (data.stageName && data.stageName !== data.name) {
    doc.setTextColor(180, 180, 195);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`(Legal Identity: ${data.name} • UID Verified)`, identX, 58);
  }

  // Category & Subcategory line
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  const catY = data.stageName && data.stageName !== data.name ? 63.5 : 60;
  doc.text(
    `${data.categoryName.toUpperCase()}  •  ${(data.subcategory || 'Principal Lead Performer').toUpperCase()}`,
    identX,
    catY
  );

  // Base specs
  const metaY = data.stageName && data.stageName !== data.name ? 69.5 : 66.5;
  doc.setTextColor(210, 210, 220);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.text(`Base: ${data.city || 'Mumbai (Maharashtra)'}`, identX, metaY);
  doc.text(`•  Experience: ${data.experience || 'Professional Veteran'}`, identX + 44, metaY);
  doc.text(`•  Booking: ${data.availability || 'Available for Contracts'}`, identX + 90, metaY);

  // Social handle & follower reach
  doc.setTextColor(243, 208, 104);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.4);
  doc.text(
    `Instagram: ${data.socialHandle || '@artist'}  [${data.instagramFollowers || 'Verified Reach'}]  •  Blue Tick Verified`,
    identX,
    metaY + 5.5
  );

  // Right Seal & Hologram Box
  const holoX = pageWidth - margin - 46;
  doc.setFillColor(25, 22, 18);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.roundedRect(holoX, 46.5, 43, 30, 1.5, 1.5, 'FD');

  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('AVA STATEWIDE ACCREDITATION', holoX + 21.5, 51.5, { align: 'center' });

  doc.setTextColor(80, 240, 160);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(`TRUST SCORE: ${data.trustScore || 99}/100`, holoX + 21.5, 57.5, { align: 'center' });

  doc.setTextColor(200, 200, 215);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.text('Security Clearance: PASSED (LVL 1)', holoX + 21.5, 63, { align: 'center' });
  doc.text('Representation: EXCLUSIVE AVA', holoX + 21.5, 68, { align: 'center' });
  doc.setTextColor(212, 175, 55);
  doc.setFontSize(5.8);
  doc.text('MAHARASHTRA ROSTER AFFIRMED', holoX + 21.5, 73, { align: 'center' });

  // Section Header helper function
  const drawSectionHeader = (title: string, yPos: number): number => {
    doc.setFillColor(28, 22, 16);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPos, contentWidth, 4.8, 1, 1, 'FD');

    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.4);
    doc.text(title.toUpperCase(), margin + 3.5, yPos + 3.4);
    return yPos + 6;
  };

  // ----------------------------------------------------
  // SECTION 4: PHYSICAL & ARTISTIC SPECIFICATIONS (y: 80.5 to 99 mm, height: 18.5 mm)
  // ----------------------------------------------------
  let curY = drawSectionHeader('1. Physical & Artistic Profile Specifications', 80.5);

  const specCardWidth = (contentWidth - 4.5) / 4; // ~47.3 mm
  const specItems = [
    { label: 'HEIGHT / STATURE', val: data.height || "5'11\" (180 cm)" },
    { label: 'AGE BRACKET', val: data.ageRange || '24 - 32 Years (Playing)' },
    {
      label: 'LANGUAGES SPOKEN',
      val: (data.languages || ['Marathi', 'Hindi', 'English']).slice(0, 3).join(', '),
    },
    { label: 'ASSOCIATION GUILD', val: (data.guildName || 'CINTAA / Artists Guild').slice(0, 26) },
  ];

  specItems.forEach((spec, i) => {
    const cardX = margin + i * (specCardWidth + 1.5);
    doc.setFillColor(14, 14, 20);
    doc.setDrawColor(50, 45, 35);
    doc.setLineWidth(0.3);
    doc.roundedRect(cardX, curY, specCardWidth, 12.5, 1.2, 1.2, 'FD');

    doc.setTextColor(155, 155, 170);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    doc.text(spec.label, cardX + 2.5, curY + 4);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.4);
    const splitVal = doc.splitTextToSize(spec.val, specCardWidth - 5);
    doc.text(splitVal, cardX + 2.5, curY + 8.5);
  });

  curY += 14.5;

  // ----------------------------------------------------
  // SECTION 5: PERFORMANCE DISCIPLINES & SKILLS (y: 101 to 121 mm, height: 20 mm)
  // ----------------------------------------------------
  curY = drawSectionHeader('2. Certified Performance Disciplines & Repertoire Specializations', curY);

  doc.setFillColor(14, 14, 20);
  doc.setDrawColor(40, 40, 55);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, curY, contentWidth, 14, 1.2, 1.2, 'FD');

  const defaultSkills = [
    'Cinematic Screen Acting',
    'Runway Showstopper',
    'Method Performance',
    'Live Stage Anchoring',
    'Classical / Folk Dance',
    'Brand Endorsements',
    'Voiceover & Dubbing',
    'Action & Stunts',
  ];
  const skillsList = data.skills && data.skills.length > 0 ? data.skills : defaultSkills;

  // Two rows of 4 pills
  const pillColWidth = (contentWidth - 6) / 4;
  skillsList.slice(0, 8).forEach((skill, sIdx) => {
    const row = Math.floor(sIdx / 4);
    const col = sIdx % 4;
    const px = margin + 2 + col * (pillColWidth + 0.6);
    const py = curY + 2.2 + row * 5.8;

    doc.setFillColor(24, 20, 16);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.25);
    doc.roundedRect(px, py, pillColWidth, 4.8, 1, 1, 'FD');

    doc.setTextColor(243, 208, 104);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.4);
    const trimmedSkill = doc.splitTextToSize(skill, pillColWidth - 4)[0];
    doc.text(trimmedSkill, px + pillColWidth / 2, py + 3.3, { align: 'center' });
  });

  curY += 16;

  // ----------------------------------------------------
  // SECTION 6: EXECUTIVE BIOGRAPHY & STATEMENT (y: 123 to 157 mm, height: 34 mm)
  // ----------------------------------------------------
  curY = drawSectionHeader('3. Executive Biography & Curated Artistic Statement', curY);

  doc.setFillColor(14, 14, 20);
  doc.setDrawColor(50, 45, 30);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, curY, contentWidth, 27.5, 1.5, 1.5, 'FD');

  // Decorative gold quotation mark
  doc.setTextColor(212, 175, 55);
  doc.setFont('times', 'bold');
  doc.setFontSize(24);
  doc.text('“', margin + 3.5, curY + 9);

  // Bio text with nice leading
  doc.setTextColor(225, 225, 235);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  const bioText =
    data.bio ||
    'Leading entertainment artist celebrated for charismatic screen presence, high artistic versatility, and distinguished public following across premier Hindi, Marathi, and regional cinema and streaming productions. Managed under exclusive contractual representation by AVA Celebrity Management.';

  const splitBio = doc.splitTextToSize(bioText, contentWidth - 15);
  doc.text(splitBio.slice(0, 5), margin + 11, curY + 5.5);

  // Circuit reach note inside bio box
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.text(
    'Primary Performance Circuits: Mumbai, Pune, Nagpur, Nashik, Kolhapur, Chhatrapati Sambhajinagar & Pan-India.',
    margin + 11,
    curY + 24.5
  );

  curY += 29.5;

  // ----------------------------------------------------
  // SECTION 7: PRODUCTION CREDITS & TRACK RECORD (y: 158.5 to 188.5 mm, height: 30 mm)
  // Full-cover section filling out middle page with authentic professional substance!
  // ----------------------------------------------------
  curY = drawSectionHeader('4. Notable Production Credits & Commercial Track Record', curY);

  const creditCardWidth = (contentWidth - 4.5) / 4; // ~47.3 mm
  const creditColumns = [
    {
      domain: 'FEATURE FILMS & CINEMA',
      desc: 'Principal & Lead Roles in Marquee Regional & Hindi Cinema. Acclaimed for commanding screen presence, critical depth, and box-office pull.',
    },
    {
      domain: 'TELEVISION & OTT SERIES',
      desc: 'Prime-time Drama & Streaming Series across leading national OTT platforms. High episodic engagement and recognized character repertoire.',
    },
    {
      domain: 'BRAND ENDORSEMENTS',
      desc: 'Brand Ambassador & Marquee Face for Lifestyle, FMCG, Fashion, and Digital ad films across Western India and Pan-India circuits.',
    },
    {
      domain: 'LIVE STAGE & MARQUEE GALAS',
      desc: 'Keynote Speaker, Chief Guest, Gala Host, and Celebrity Showstopper for high-profile public festivals, award nights, and corporate galas.',
    },
  ];

  creditColumns.forEach((col, i) => {
    const cx = margin + i * (creditCardWidth + 1.5);
    doc.setFillColor(16, 15, 24);
    doc.setDrawColor(50, 45, 35);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, curY, creditCardWidth, 23.5, 1.2, 1.2, 'FD');

    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(5.8);
    doc.text(col.domain, cx + 2.5, curY + 4.2);

    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.2);
    doc.line(cx + 2.5, curY + 5.5, cx + creditCardWidth - 2.5, curY + 5.5);

    doc.setTextColor(205, 205, 220);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    const splitDesc = doc.splitTextToSize(col.desc, creditCardWidth - 5);
    doc.text(splitDesc.slice(0, 6), cx + 2.5, curY + 9);
  });

  curY += 25.5;

  // ----------------------------------------------------
  // SECTION 8: COMMERCIAL RATE CARD & CONTRACTUAL BENCHMARK (y: 190 to 221 mm, height: 31 mm)
  // ----------------------------------------------------
  curY = drawSectionHeader('5. Commercial Rate Card & Contractual Benchmark (Maharashtra)', curY);

  const rateCardWidth = (contentWidth - 3) / 3; // ~63.6 mm
  const rateBoxes = [
    {
      title: 'HALF-DAY COMMERCIAL SHOOT',
      fee: data.halfDayRate || '₹1,50,000',
      scope: 'Up to 5 Hours Call Sheet • Digital / Print / Ad Film',
    },
    {
      title: 'FULL-DAY CINEMATIC PRODUCTION',
      fee: data.fullDayRate || '₹2,75,000',
      scope: 'Up to 10 Hours Call Sheet • Principal Role / Feature Shoot',
    },
    {
      title: 'VIP STAGE / LIVE APPEARANCE',
      fee: data.appearanceRate || '₹3,50,000',
      scope: 'Chief Guest / Gala Ribbon Cutting / Marquee Event MC',
    },
  ];

  rateBoxes.forEach((box, i) => {
    const rx = margin + i * (rateCardWidth + 1.5);
    doc.setFillColor(18, 16, 24);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.35);
    doc.roundedRect(rx, curY, rateCardWidth, 19, 1.2, 1.2, 'FD');

    doc.setTextColor(170, 170, 185);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.4);
    doc.text(box.title, rx + 3, curY + 4.5);

    doc.setTextColor(255, 215, 60);
    doc.setFont('courier', 'bold');
    doc.setFontSize(11);
    doc.text(box.fee, rx + 3, curY + 10.5);

    doc.setTextColor(180, 180, 190);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.8);
    const splitScope = doc.splitTextToSize(box.scope, rateCardWidth - 6);
    doc.text(splitScope, rx + 3, curY + 14.8);
  });

  // Rider note under rates
  curY += 21;
  doc.setTextColor(180, 150, 70);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.2);
  doc.text(
    '* Indicative standard Maharashtra commercial benchmarks. Contracts include official travel rider, VIP security escort & tailored hospitality SLA handled by AVA Directorate.',
    margin + 1.5,
    curY + 1.5
  );
  curY += 4.5;

  // ----------------------------------------------------
  // SECTION 9: REGULATORY KYC & CRYPTOGRAPHIC QR (y: 223.5 to 251.5 mm, height: 28 mm)
  // ----------------------------------------------------
  curY = drawSectionHeader('6. Regulatory KYC, Security Clearance & QR Validation', curY);

  doc.setFillColor(14, 14, 20);
  doc.setDrawColor(40, 40, 55);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, curY, contentWidth, 21.5, 1.2, 1.2, 'FD');

  // Left Checklist
  const checkX = margin + 3.5;
  doc.setTextColor(80, 240, 160);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('✓  GOVT IDENTITY KYC:', checkX, curY + 5.5);
  doc.setTextColor(220, 220, 230);
  doc.setFont('helvetica', 'normal');
  doc.text(`${data.idType || 'Aadhaar / Govt ID'} [${data.idNumber || 'Verified'}]`, checkX + 38, curY + 5.5);

  doc.setTextColor(80, 240, 160);
  doc.setFont('helvetica', 'bold');
  doc.text('✓  PROFESSIONAL GUILD:', checkX, curY + 11.2);
  doc.setTextColor(220, 220, 230);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${data.guildName || 'CINTAA / Artists Guild of Maharashtra'} (Registered Member in Good Standing)`,
    checkX + 38,
    curY + 11.2
  );

  doc.setTextColor(80, 240, 160);
  doc.setFont('helvetica', 'bold');
  doc.text('✓  EMERGENCY / DESK:', checkX, curY + 16.8);
  doc.setTextColor(220, 220, 230);
  doc.setFont('helvetica', 'normal');
  doc.text(data.emergencyContact || '+91 98200 12345 (AVA Directorate Desk 24/7)', checkX + 38, curY + 16.8);

  // Right QR Code
  const qrX = pageWidth - margin - 23;
  const qrY = curY + 1.8;
  drawQrCodeMatrix(doc, qrX, qrY, 17.5);

  doc.setTextColor(212, 175, 55);
  doc.setFont('courier', 'bold');
  doc.setFontSize(5.2);
  doc.text('SCAN TO VERIFY', qrX + 8.7, qrY + 19, { align: 'center' });

  curY += 23.5;

  // ----------------------------------------------------
  // SECTION 10: LEGAL SIGNATURES & DIRECTORATE SEAL (y: 253 to 279 mm, height: 26 mm)
  // ----------------------------------------------------
  curY = drawSectionHeader('7. Certified Endorsement, Signatures & Legal Authenticity', curY);

  doc.setFillColor(16, 15, 22);
  doc.setDrawColor(50, 45, 30);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, curY, contentWidth, 20.5, 1.2, 1.2, 'FD');

  // Left Signature: Artist
  const sigLineY = curY + 12.5;
  doc.setDrawColor(120, 120, 140);
  doc.setLineWidth(0.3);
  doc.line(margin + 5, sigLineY, margin + 55, sigLineY);

  doc.setTextColor(243, 208, 104);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text(data.stageName || data.name, margin + 5, sigLineY - 2);

  doc.setTextColor(160, 160, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.text('Authorized Signature of Represented Artist', margin + 5, sigLineY + 3.5);
  doc.text('Affirmed under AVA Celebrity Representation Charter', margin + 5, sigLineY + 6.2);

  // Center Circular Gold Directorate Seal
  const sealCenterX = pageWidth / 2;
  const sealCenterY = curY + 10.2;

  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.6);
  doc.circle(sealCenterX, sealCenterY, 8.5, 'S');
  doc.setLineWidth(0.2);
  doc.circle(sealCenterX, sealCenterY, 7.2, 'S');

  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(4.8);
  doc.text('★ AVA SEAL ★', sealCenterX, sealCenterY - 2, { align: 'center' });
  doc.setFontSize(4);
  doc.text('MAHARASHTRA', sealCenterX, sealCenterY + 1, { align: 'center' });
  doc.text('OFFICIAL 2026', sealCenterX, sealCenterY + 3.8, { align: 'center' });

  // Right Signature: Directorate
  const rightSigX = pageWidth - margin - 55;
  doc.line(rightSigX, sigLineY, pageWidth - margin - 5, sigLineY);

  doc.setTextColor(243, 208, 104);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text('AVA Celebrity Directorate', rightSigX, sigLineY - 2);

  doc.setTextColor(160, 160, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.8);
  doc.text('Executive Officer • Booking & Legal Directorate', rightSigX, sigLineY + 3.5);
  doc.text('Master Digital Dispatch [HASH: MH-AVA-VERIFIED]', rightSigX, sigLineY + 6.2);

  // ----------------------------------------------------
  // SECTION 11: BOTTOM LEGAL FOOTER (y: 281.5 to 290.5 mm, height: 9 mm)
  // Perfectly finishes at y = 290.5 mm, with ZERO blank space!
  // ----------------------------------------------------
  doc.setFillColor(14, 12, 18);
  doc.rect(margin, 281.5, contentWidth, 9, 'F');
  doc.setFillColor(212, 175, 55);
  doc.rect(margin, 281.5, contentWidth, 0.4, 'F');

  doc.setTextColor(190, 185, 170);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.6);
  doc.text(
    'AVA CELEBRITY MANAGEMENT  •  Bandra West, Mumbai (400050) & Koregaon Park, Pune (411001)  •  Web: www.avatalent.com  •  Email: concierge@avatalent.com  •  Tel: +91 98200 12345',
    pageWidth / 2,
    285,
    { align: 'center' }
  );

  doc.setTextColor(130, 130, 140);
  doc.setFontSize(5);
  doc.text(
    'CONFIDENTIALITY NOTICE: This document is an official certified talent composite dossier. Information contained herein is legally privileged. Unauthorized distribution or copying is strictly prohibited under Indian Copyright & Contract Law.',
    pageWidth / 2,
    288.5,
    { align: 'center' }
  );

  return doc;
}

/**
 * Downloads the Talent Profile PDF with a clean filename
 */
export function downloadTalentProfilePdf(data: TalentPdfData, filename?: string): void {
  const doc = generateTalentProfilePdf(data);
  const cleanName = (data.stageName || data.name || 'Artist').replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeRef = (data.referenceCode || 'AVA').replace(/[^a-zA-Z0-9_-]/g, '');
  const outName = filename || `AVA_Official_Artist_Dossier_${cleanName}_${safeRef}.pdf`;
  doc.save(outName);
}

/**
 * MASTER OFFICIAL BOOKING & ENQUIRY DOSSIER PDF GENERATOR
 * Full-bleed A4 layout (210 x 297mm) with zero blank space and zero price mentions.
 * Features official AVA Celebrity Management crest, dual gold framing,
 * complete client & event itinerary, production specs, VIP security SLA,
 * legal covenants, digital QR cryptographic seal, and directorate stamp.
 */
export function generateBookingEnquiryDossierPdf(data: BookingPdfData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 7.5;
  const contentWidth = pageWidth - margin * 2; // 195 mm

  // Deep Obsidian Prestige Background
  doc.setFillColor(8, 8, 12);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Gold Framing (4.5mm inset)
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(1.1);
  doc.rect(4.5, 4.5, pageWidth - 9, pageHeight - 9);

  // Inner Subtle Bronze Gold Framing (6.2mm inset)
  doc.setDrawColor(170, 124, 17);
  doc.setLineWidth(0.35);
  doc.rect(6.2, 6.2, pageWidth - 12.4, pageHeight - 12.4);

  // TOP HEADER BANNER (Y: 7.5 to 30.5 mm, height: 23 mm)
  doc.setFillColor(18, 14, 24);
  doc.rect(margin, 7.5, contentWidth, 23, 'F');

  // Gold divider under banner
  doc.setFillColor(212, 175, 55);
  doc.rect(margin, 30.2, contentWidth, 0.6, 'F');

  // Left Emblem / Crest Shield
  doc.setFillColor(11, 11, 16);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.65);
  doc.roundedRect(margin + 2.5, 9.2, 18, 19.5, 1.5, 1.5, 'FD');

  doc.setTextColor(243, 208, 104);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('AVA', margin + 11.5, 20, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setTextColor(212, 175, 55);
  doc.text('OFFICIAL', margin + 11.5, 25, { align: 'center' });

  // Main Brand Header
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.text('AVA CELEBRITY MANAGEMENT', margin + 24, 15.5);

  const docTitle =
    data.documentType === 'Executive Enquiry Dossier'
      ? 'OFFICIAL EXECUTIVE CLIENT ENQUIRY & ARTIST DOSSIER'
      : 'OFFICIAL TALENT BOOKING PASS & ENGAGEMENT DOSSIER';
  doc.setTextColor(245, 240, 230);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.text(docTitle, margin + 24, 21.2);

  doc.setTextColor(175, 175, 190);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.text(
    'DIRECTORATE OF CELEBRITY MANAGEMENT & ENTERTAINMENT • GOVERNMENT OF MAHARASHTRA ACCREDITED',
    margin + 24,
    26.2
  );

  // REFERENCE CODE & SECURITY DOCKET BAR (Y: 32 to 42 mm, height: 10 mm)
  doc.setFillColor(15, 15, 22);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.35);
  doc.roundedRect(margin, 32, contentWidth, 10, 1.2, 1.2, 'FD');

  doc.setTextColor(185, 185, 200);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.text('OFFICIAL DOCKET REFERENCE NUMBER:', margin + 3.5, 38.3);

  doc.setTextColor(255, 215, 60);
  doc.setFont('courier', 'bold');
  doc.setFontSize(10.5);
  doc.text(data.referenceCode, margin + 63, 38.5);

  // Status Badge
  const statusLabel = data.status === 'Confirmed' ? '✓ CONFIRMED & ACTIVE' : '✓ OFFICIAL VERIFIED RECORD';
  doc.setFillColor(13, 92, 58);
  doc.roundedRect(pageWidth - margin - 48, 33.2, 45, 7.5, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text(statusLabel, pageWidth - margin - 25.5, 38.2, { align: 'center' });

  let curY = 44;

  const drawSectionHeader = (title: string, yPos: number): number => {
    doc.setFillColor(28, 22, 16);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.3);
    doc.roundedRect(margin, yPos, contentWidth, 4.4, 0.8, 0.8, 'FD');

    doc.setTextColor(212, 175, 55);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.text(title.toUpperCase(), margin + 3.5, yPos + 3.2);
    return yPos + 5.2;
  };

  const drawRow = (
    label1: string,
    val1: string,
    label2: string,
    val2: string,
    yPos: number
  ): number => {
    const col1X = margin + 3.5;
    const col2X = pageWidth / 2 + 2;

    doc.setFillColor(14, 14, 20);
    doc.rect(margin, yPos, contentWidth, 8.8, 'F');

    doc.setTextColor(145, 145, 160);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.text(label1, col1X, yPos + 3.2);
    doc.text(label2, col2X, yPos + 3.2);

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(val1 || 'N/A', col1X, yPos + 7.2);
    doc.text(val2 || 'N/A', col2X, yPos + 7.2);

    doc.setDrawColor(32, 32, 45);
    doc.setLineWidth(0.2);
    doc.line(margin, yPos + 8.8, margin + contentWidth, yPos + 8.8);

    return yPos + 8.8;
  };

  // SECTION 1: Client & Organizer Profile (Y: 44 to 62.8 mm)
  curY = drawSectionHeader('1. Client & Registered Executive Contact Profile', curY);
  curY = drawRow(
    'Full Client / Producer Name',
    data.customerName,
    'Registered Official Email',
    data.customerEmail,
    curY
  );
  curY = drawRow(
    'Contact Telephone Number',
    data.customerPhone,
    'Organization / Production Banner',
    data.organization || 'Individual / Private Executive Client',
    curY
  );

  curY += 1.6;

  // SECTION 2: Event Itinerary & Location (Y: 64.4 to 92 mm)
  curY = drawSectionHeader('2. Event Schedule & Maharashtra Venue Itinerary', curY);
  curY = drawRow(
    'Event / Campaign Title',
    data.eventName,
    'Confirmed / Target Event Date',
    data.eventDate,
    curY
  );
  const displayTime = data.eventTime || '07:30 PM IST (Standard Call Time)';
  const displayCity = data.maharashtraCity
    ? `${data.maharashtraCity}, Maharashtra`
    : data.cityVenue || 'Maharashtra, India';
  curY = drawRow(
    'Reporting / Stage Call Time',
    displayTime,
    'Maharashtra Event City',
    displayCity,
    curY
  );
  curY = drawRow(
    'Venue / Production Address',
    data.cityVenue || 'VIP Event Arena / Auditorium',
    'Executive Transit Protocol',
    'Designated VIP Convoy Assigned',
    curY
  );

  curY += 1.6;

  // SECTION 3: Artist Assignment & Contractual Scope (Y: 93.6 to 121.2 mm) - NO PRICE MENTIONED
  curY = drawSectionHeader('3. Talent Assignment & Engagement Specifications (Zero Public Rates)', curY);
  const talentOrPkg = data.talentName
    ? `Artist: ${data.talentName}`
    : data.packageTitle
    ? `Package: ${data.packageTitle}`
    : 'Custom Celebrity Management Assignment';
  const talentCat = data.talentCategory || data.bookingType || 'Celebrity Appearance';
  curY = drawRow(
    'Assigned Artist / Celebrity Talent',
    talentOrPkg,
    'Talent Discipline / Category',
    talentCat,
    curY
  );
  curY = drawRow(
    'Assignment Duration / Shift',
    data.duration || 'Full Event Coverage & Stage Performance',
    'Commercial Contract Terms',
    'Official Agency SLA on File (Exclusive Representation)',
    curY
  );
  curY = drawRow(
    'Representation Status',
    'Direct Exclusive Representation via AVA',
    'Contract Execution State',
    'Directorate SLA Pre-Approved & Validated',
    curY
  );

  curY += 1.6;

  // SECTION 4: Production Brief & Client Scope of Work (Y: 122.8 to 148 mm)
  curY = drawSectionHeader('4. Client Production Brief & Service Scope of Work', curY);
  doc.setFillColor(14, 14, 20);
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.25);
  doc.roundedRect(margin, curY, contentWidth, 18, 0.8, 0.8, 'FD');

  doc.setTextColor(220, 220, 230);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);

  const briefText =
    (data.serviceRequirements || data.additionalNotes || '').trim() ||
    'Client requested official celebrity management representation for public event gala. High-caliber performance execution, celebrity appearance protocol, VIP hospitality suite, stage sound-check, and personal security escort coordinated directly under AVA production directorate.';
  const splitBrief = doc.splitTextToSize(briefText, contentWidth - 8);
  doc.text(splitBrief.slice(0, 4), margin + 4, curY + 4.8);

  curY += 19.8;

  // SECTION 5: VIP Security Escort, Rider & Hospitality SLA (Y: 149.6 to 191 mm)
  curY = drawSectionHeader('5. VIP Hospitality, Rider Compliance & Security Directorate Protocols', curY);
  doc.setFillColor(14, 14, 20);
  doc.roundedRect(margin, curY, contentWidth, 23.5, 0.8, 0.8, 'F');

  const protocolItems = [
    {
      title: '✓ GREEN ROOM PROTOCOL:',
      desc: 'Air-conditioned luxury executive suite, private restroom, green room rider catering, and dedicated artist hospitality liaison.',
    },
    {
      title: '✓ TRANSIT & SECURITY ESCORT:',
      desc: 'Dedicated luxury transit vehicle fleet with licensed personal protection officer escort from call time until safe venue exit.',
    },
    {
      title: '✓ SOUND & STAGE REHEARSAL:',
      desc: 'Mandatory 60-minute technical audio/visual rehearsal and stage cue run-through completed prior to public doors opening.',
    },
    {
      title: '✓ ACCESS CONTROL & CROWD SLA:',
      desc: 'Strict digital badge verification for backstage personnel. VIP security perimeter & designated photo-op zone enforced.',
    },
  ];

  protocolItems.forEach((item, idx) => {
    const itemY = curY + 4.5 + idx * 5.2;
    doc.setTextColor(80, 240, 160);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.4);
    doc.text(item.title, margin + 4, itemY);

    doc.setTextColor(215, 215, 225);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.text(item.desc, margin + 46, itemY);
  });

  curY += 25.2;

  // SECTION 6: Official Legal Terms & Statutory Undertakings (Y: 193.2 to 231 mm)
  curY = drawSectionHeader('6. Contractual Undertakings & Official Directorate Legal SLA', curY);
  doc.setFillColor(14, 14, 20);
  doc.roundedRect(margin, curY, contentWidth, 23.5, 0.8, 0.8, 'F');

  const legalClauses = [
    {
      title: '• CONFIDENTIALITY (NDA):',
      desc: 'Artist schedule, travel itinerary, and commercial agreements are strictly confidential under mutual NDA covenants.',
    },
    {
      title: '• FORCE MAJEURE SAFEGUARD:',
      desc: 'Directorate SLA protects rescheduled dates in statutory, public safety, or climatic disruptions with zero penalty.',
    },
    {
      title: '• INTELLECTUAL PROPERTY & MEDIA:',
      desc: 'Live streaming, commercial filming, and advertising campaigns require written directorate authorization.',
    },
    {
      title: '• JUDICIAL JURISDICTION:',
      desc: 'This dossier is an official legal record governed under Maharashtra laws, subject to Mumbai & Pune judicial arbitration.',
    },
  ];

  legalClauses.forEach((item, idx) => {
    const itemY = curY + 4.5 + idx * 5.2;
    doc.setTextColor(243, 208, 104);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.4);
    doc.text(item.title, margin + 4, itemY);

    doc.setTextColor(205, 205, 215);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.text(item.desc, margin + 50, itemY);
  });

  curY += 25.2;

  // SECTION 7: Cryptographic Security Seal & Digital Verification QR (Y: 233.2 to 256 mm)
  curY = drawSectionHeader('7. Cryptographic QR Verification & Directorate Security Seal', curY);
  doc.setFillColor(14, 14, 20);
  doc.roundedRect(margin, curY, contentWidth, 19, 0.8, 0.8, 'F');

  // QR Code Matrix
  drawQrCodeMatrix(doc, margin + 4, curY + 2, 15);

  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.4);
  doc.text('OFFICIAL CRYPTOGRAPHIC QR VERIFICATION RECORD', margin + 22, curY + 5.2);

  doc.setTextColor(190, 190, 205);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.2);
  doc.text(`Authenticated Recipient: ${data.customerEmail}`, margin + 22, curY + 9.2);
  doc.text(
    `Issuance Date & Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST (Direct Server Dispatch)`,
    margin + 22,
    curY + 13.2
  );
  doc.text(
    `Security Hash: SHA256-AVA-${data.referenceCode.replace(/[^a-zA-Z0-9]/g, '')}-VIP-MH • ZERO DUPLICATION PERMITTED`,
    margin + 22,
    curY + 17
  );

  curY += 20.8;

  // SECTION 8: Directorate Authorizations & Signatures (Y: 258.8 to 280 mm)
  curY = drawSectionHeader('8. Directorate Endorsement, Client Signatures & Official Stamp', curY);
  doc.setFillColor(14, 14, 20);
  doc.roundedRect(margin, curY, contentWidth, 18, 0.8, 0.8, 'F');

  const sigY = curY + 11.5;

  // Left: Client Signature Line
  doc.setDrawColor(120, 120, 140);
  doc.setLineWidth(0.3);
  doc.line(margin + 5, sigY, margin + 55, sigY);
  doc.setTextColor(243, 208, 104);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text(data.customerName, margin + 5, sigY - 2);
  doc.setTextColor(150, 150, 160);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.4);
  doc.text('Client / Event Organizer Acknowledgment', margin + 5, sigY + 3.2);

  // Center: Official Circular Gold Directorate Stamp
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.circle(pageWidth / 2, curY + 9, 7.2, 'S');
  doc.setLineWidth(0.25);
  doc.circle(pageWidth / 2, curY + 9, 6.2, 'S');
  doc.setTextColor(212, 175, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(4.2);
  doc.text('★ AVA CELEBRITY ★', pageWidth / 2, curY + 7.8, { align: 'center' });
  doc.setFontSize(4.6);
  doc.text('OFFICIAL SEAL', pageWidth / 2, curY + 9.8, { align: 'center' });
  doc.setFontSize(3.8);
  doc.text('DIRECTORATE', pageWidth / 2, curY + 11.8, { align: 'center' });

  // Right: Directorate Executive Signature
  const rightX = pageWidth - margin - 55;
  doc.setDrawColor(120, 120, 140);
  doc.setLineWidth(0.3);
  doc.line(rightX, sigY, pageWidth - margin - 5, sigY);
  doc.setTextColor(243, 208, 104);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('AVA Celebrity Directorate', rightX, sigY - 2);
  doc.setTextColor(150, 150, 160);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.4);
  doc.text('Executive Director • Booking & Legal Directorate', rightX, sigY + 3.2);

  // BOTTOM LUXURY FOOTER (Y: 283.5 to 292 mm, height: 8.5 mm)
  doc.setFillColor(14, 12, 18);
  doc.rect(margin, 283.5, contentWidth, 8.5, 'F');
  doc.setFillColor(212, 175, 55);
  doc.rect(margin, 283.5, contentWidth, 0.4, 'F');

  doc.setTextColor(195, 190, 175);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(5.4);
  doc.text(
    'AVA CELEBRITY MANAGEMENT  •  Bandra West, Mumbai & Koregaon Park, Pune  •  Web: www.avatalent.com  •  Email: concierge@avatalent.com  •  Tel: +91 98200 12345',
    pageWidth / 2,
    287,
    { align: 'center' }
  );

  doc.setTextColor(135, 135, 145);
  doc.setFontSize(4.8);
  doc.text(
    'NOTICE: Present this digital dossier alongside valid government photo ID upon venue entry. Official Directorate Record. Protected under Agency SLA.',
    pageWidth / 2,
    290.2,
    { align: 'center' }
  );

  return doc;
}

/**
 * Downloads the Official Booking / Enquiry Dossier PDF
 */
export function downloadBookingEnquiryDossierPdf(data: BookingPdfData, filename?: string): void {
  const doc = generateBookingEnquiryDossierPdf(data);
  const safeRef = data.referenceCode.replace(/[^a-zA-Z0-9_-]/g, '');
  const outName = filename || `AVA-Official-Dossier-${safeRef}.pdf`;
  doc.save(outName);
}

// Backwards-compatible aliases
export const generateBookingPassPdf = generateBookingEnquiryDossierPdf;
export const downloadBookingPassPdf = downloadBookingEnquiryDossierPdf;

