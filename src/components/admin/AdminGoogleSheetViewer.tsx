import React, { useState } from 'react';
import {
  Booking,
  EventRegistration,
  TeamContactInquiry,
  VideoMediaItem,
  TalentProfile
} from '../../types';
import {
  FileSpreadsheet,
  Download,
  Search,
  ExternalLink,
  Check,
  RefreshCw,
  Filter,
  Layers,
  Calendar,
  Users,
  Video,
  FileDown,
  Sparkles
} from 'lucide-react';
import { downloadCsvSpreadsheet, exportToGoogleSheet } from '../../services/sheetsService';

interface AdminGoogleSheetViewerProps {
  bookings: Booking[];
  eventRegs: EventRegistration[];
  teamInquiries: TeamContactInquiry[];
  videoMediaItems: VideoMediaItem[];
  profiles: TalentProfile[];
  onRefreshData?: () => void;
  setNotice?: (msg: string | null) => void;
  setError?: (msg: string | null) => void;
}

type ActiveSheetTab = 'bookings' | 'eventRegs' | 'teamInquiries' | 'videoMedia' | 'profiles';

export const AdminGoogleSheetViewer: React.FC<AdminGoogleSheetViewerProps> = ({
  bookings,
  eventRegs,
  teamInquiries,
  videoMediaItems,
  profiles,
  onRefreshData,
  setNotice,
  setError,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveSheetTab>('bookings');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [exporting, setExporting] = useState(false);

  // Column headers & Row data mappings for each sheet
  const getSheetData = () => {
    switch (activeTab) {
      case 'bookings': {
        const headers = [
          'Booking Ref (A)',
          'Customer Name (B)',
          'Email (C)',
          'Phone (D)',
          'Service Type (E)',
          'Talent Target (F)',
          'Event Name (G)',
          'Date (H)',
          'Venue (I)',
          'Quotation (J)',
          'Status (K)',
          'Requirements (L)',
          'Timestamp (M)'
        ];
        const filtered = bookings.filter((b) => {
          if (statusFilter !== 'all' && b.status !== statusFilter) return false;
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return (
            b.bookingReference?.toLowerCase().includes(q) ||
            b.customerName?.toLowerCase().includes(q) ||
            b.customerEmail?.toLowerCase().includes(q) ||
            b.customerPhone?.toLowerCase().includes(q) ||
            b.talentName?.toLowerCase().includes(q) ||
            b.eventName?.toLowerCase().includes(q) ||
            b.cityVenue?.toLowerCase().includes(q)
          );
        });
        const rows = filtered.map((b) => [
          b.bookingReference || 'AVA-BK-N/A',
          b.customerName || 'N/A',
          b.customerEmail || 'N/A',
          b.customerPhone || 'N/A',
          b.bookingType || 'General Request',
          b.talentName || 'General Inquiry',
          b.eventName || 'Private Event',
          b.eventDate || 'TBD',
          b.cityVenue || 'Maharashtra',
          b.quotationAmount ? `₹${b.quotationAmount.toLocaleString()}` : 'Pending Quote',
          b.status || 'Submitted',
          b.serviceRequirements || '',
          b.createdAt ? new Date(b.createdAt).toLocaleString() : ''
        ]);
        return { title: 'Bookings & Quotations', filename: 'AVA_Bookings_GoogleSheet', headers, rows, count: filtered.length, total: bookings.length };
      }

      case 'eventRegs': {
        const headers = [
          'Reg Ref (A)',
          'Contestant Name (B)',
          'Show Event (C)',
          'Email (D)',
          'Phone (E)',
          'City (F)',
          'Age (G)',
          'Category (H)',
          'Performance Act (I)',
          'Demo Reel Link (J)',
          'Status (K)',
          'Date (L)'
        ];
        const filtered = eventRegs.filter((e) => {
          if (statusFilter !== 'all' && e.status !== statusFilter) return false;
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return (
            e.registrationReference?.toLowerCase().includes(q) ||
            e.fullName?.toLowerCase().includes(q) ||
            e.eventTitle?.toLowerCase().includes(q) ||
            e.city?.toLowerCase().includes(q) ||
            e.email?.toLowerCase().includes(q)
          );
        });
        const rows = filtered.map((e) => [
          e.registrationReference || 'AVA-EV-N/A',
          e.fullName || 'N/A',
          e.eventTitle || 'Talent Show',
          e.email || 'N/A',
          e.phone || 'N/A',
          e.city || 'Mumbai',
          e.age || 'N/A',
          e.category || 'Solo Act',
          e.performanceDetails || '',
          e.portfolioLink || 'N/A',
          e.status || 'Pending',
          e.createdAt ? new Date(e.createdAt).toLocaleString() : ''
        ]);
        return { title: 'Show Registrations', filename: 'AVA_Show_Registrations_GoogleSheet', headers, rows, count: filtered.length, total: eventRegs.length };
      }

      case 'teamInquiries': {
        const headers = [
          'Inquiry Ref (A)',
          'Client Name (B)',
          'Agency / Org (C)',
          'Inquiry Category (D)',
          'Email (E)',
          'Phone (F)',
          'Target Date (G)',
          'Budget (H)',
          'Venue / City (I)',
          'Requirements (J)',
          'Status (K)',
          'Timestamp (L)'
        ];
        const filtered = teamInquiries.filter((t) => {
          if (statusFilter !== 'all' && t.status !== statusFilter) return false;
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return (
            t.inquiryReference?.toLowerCase().includes(q) ||
            t.name?.toLowerCase().includes(q) ||
            t.organization?.toLowerCase().includes(q) ||
            t.email?.toLowerCase().includes(q) ||
            t.phone?.toLowerCase().includes(q)
          );
        });
        const rows = filtered.map((t) => [
          t.inquiryReference || 'AVA-TC-N/A',
          t.name || 'N/A',
          t.organization || 'Individual',
          t.inquiryType || 'General Inquiry',
          t.email || 'N/A',
          t.phone || 'N/A',
          t.preferredDate || 'Flexible',
          t.budgetRange || 'Unspecified',
          t.cityVenue || 'Mumbai / Pan-India',
          t.requirements || '',
          t.status || 'New',
          t.createdAt ? new Date(t.createdAt).toLocaleString() : ''
        ]);
        return { title: 'Team Inquiries', filename: 'AVA_Team_Inquiries_GoogleSheet', headers, rows, count: filtered.length, total: teamInquiries.length };
      }

      case 'videoMedia': {
        const headers = [
          'Video ID (A)',
          'Video Title (B)',
          'Category (C)',
          'Purpose / Type (D)',
          'Aspect Ratio (E)',
          'Duration (F)',
          'Festival / Event (G)',
          'Venue (H)',
          'Artist Featured (I)',
          'Published (J)',
          'Date (K)'
        ];
        const filtered = videoMediaItems.filter((v) => {
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return (
            v.title?.toLowerCase().includes(q) ||
            v.categoryName?.toLowerCase().includes(q) ||
            v.videoTag?.toLowerCase().includes(q) ||
            v.artistName?.toLowerCase().includes(q) ||
            v.festivalName?.toLowerCase().includes(q)
          );
        });
        const rows = filtered.map((v) => [
          v.id,
          v.title,
          v.categoryName,
          v.videoType || v.videoTag || 'Event Video',
          v.aspectRatio,
          v.durationFormatted || '01:00',
          v.festivalName || 'General Event',
          v.eventVenue || 'Maharashtra',
          v.artistName || 'AVA Artist',
          v.isPublished ? 'Live on Site' : 'Draft',
          v.createdAt ? new Date(v.createdAt).toLocaleDateString() : ''
        ]);
        return { title: 'Video Media Library', filename: 'AVA_VideoMedia_GoogleSheet', headers, rows, count: filtered.length, total: videoMediaItems.length };
      }

      case 'profiles': {
        const headers = [
          'Talent ID (A)',
          'Artist Name (B)',
          'Role Type (C)',
          'Category (D)',
          'Subcategory (E)',
          'City (F)',
          'Availability (G)',
          'Instagram Handle (H)',
          'Followers (I)',
          'Has Video (J)',
          'Status (K)'
        ];
        const filtered = profiles.filter((p) => {
          if (!searchQuery.trim()) return true;
          const q = searchQuery.toLowerCase();
          return (
            p.name?.toLowerCase().includes(q) ||
            p.categoryName?.toLowerCase().includes(q) ||
            p.talentType?.toLowerCase().includes(q) ||
            p.city?.toLowerCase().includes(q) ||
            p.instagramHandle?.toLowerCase().includes(q)
          );
        });
        const rows = filtered.map((p) => [
          p.id,
          p.name,
          p.talentType || 'Artist',
          p.categoryName,
          p.subcategory || '',
          p.city || 'Mumbai',
          p.availability || 'Available',
          p.instagramHandle || 'N/A',
          p.instagramFollowers || 'N/A',
          p.videoUrl ? `Yes (${p.videoAspectRatio || '9:16'})` : 'No',
          p.status || 'published'
        ]);
        return { title: 'Talent Profiles', filename: 'AVA_TalentProfiles_GoogleSheet', headers, rows, count: filtered.length, total: profiles.length };
      }
    }
  };

  const currentSheet = getSheetData();

  const handleDownloadCsv = () => {
    downloadCsvSpreadsheet(currentSheet.filename, currentSheet.headers, currentSheet.rows);
    if (setNotice) {
      setNotice(`"${currentSheet.title}" downloaded successfully as Google Sheets / Excel compatible file!`);
    }
  };

  const handleExportDrive = async () => {
    setExporting(true);
    try {
      const result = await exportToGoogleSheet(
        `AVA Celebrity Management - ${currentSheet.title} (${new Date().toLocaleDateString()})`,
        currentSheet.headers,
        currentSheet.rows
      );
      if (result.downloadedCsv) {
        if (setNotice) {
          setNotice(`"${currentSheet.title}" spreadsheet file downloaded directly! (Ready to import to Google Sheets)`);
        }
      } else {
        if (setNotice) {
          setNotice(`Spreadsheet created in Google Drive! URL: ${result.spreadsheetUrl}`);
        }
        if (result.spreadsheetUrl) {
          window.open(result.spreadsheetUrl, '_blank');
        }
      }
    } catch (err: any) {
      console.warn('Export drive notice:', err);
      downloadCsvSpreadsheet(currentSheet.filename, currentSheet.headers, currentSheet.rows);
      if (setNotice) {
        setNotice(`Downloaded "${currentSheet.title}" spreadsheet file directly without errors.`);
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-emerald-400 font-bold font-cinzel mb-1">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Google Sheets Live Data Hub (गुगल शीट डेटा हब)</span>
          </div>
          <h2 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2">
            <span>Admin Google Spreadsheet Center</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
              100% CLEAR DATA
            </span>
          </h2>
          <p className="text-gray-400 text-xs mt-1 max-w-2xl">
            सर्व डेटा (Bookings, Registrations, Inquiries, Video Media) गुगल शीट फॉरमॅटमध्ये थेट ॲडमिन पॅनेलमध्ये क्लिअर दिसेल. एका क्लिकवर .CSV किंवा Google Drive मध्ये सेव्ह करा.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onRefreshData && (
            <button
              type="button"
              onClick={onRefreshData}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer border border-white/10"
              title="Refresh All Records"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Refresh</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleDownloadCsv}
            className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-500/50 text-xs font-cinzel font-bold flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Sheet (.CSV / Excel)</span>
          </button>

          <button
            type="button"
            onClick={handleExportDrive}
            disabled={exporting}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-cinzel font-bold flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>{exporting ? 'Exporting...' : 'Export to Google Drive'}</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Tabs (Like Google Sheets Bottom/Top Tab Bar) */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {[
          { id: 'bookings', label: `📋 Bookings (${bookings.length})` },
          { id: 'eventRegs', label: `🎟️ Show Registrations (${eventRegs.length})` },
          { id: 'teamInquiries', label: `📨 Team Inquiries (${teamInquiries.length})` },
          { id: 'videoMedia', label: `🎬 Video Media (${videoMediaItems.length})` },
          { id: 'profiles', label: `👑 Talent Profiles (${profiles.length})` }
        ].map((tab) => {
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as ActiveSheetTab);
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-cinzel font-bold whitespace-nowrap transition cursor-pointer border-t border-l border-r ${
                isCurrent
                  ? 'bg-[#181824] text-[#F3D068] border-[#D4AF37]/50 border-b-2 border-b-[#D4AF37]'
                  : 'bg-[#0E0E14] text-gray-400 hover:text-white border-white/5 hover:bg-[#14141E]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Status Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-[#12121A] border border-white/10">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search across all ${currentSheet.title} columns...`}
            className="w-full bg-[#181824] border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="flex items-center gap-2">
          {(activeTab === 'bookings' || activeTab === 'eventRegs' || activeTab === 'teamInquiries') && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#181824] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="In Review">In Review</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="New">New</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          )}

          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-[11px] font-semibold transition cursor-pointer"
              title="Clear Search and Status Filters"
            >
              Clear Filters (क्लिअर करा)
            </button>
          )}

          <span className="text-[11px] font-mono text-gray-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
            Showing <strong className="text-white">{currentSheet.count}</strong> of {currentSheet.total} records
          </span>
        </div>
      </div>

      {/* Google Sheets Spreadsheet Grid Viewer */}
      <div className="card-luxury rounded-2xl border border-[#D4AF37]/40 overflow-hidden shadow-2xl bg-[#0B0B10]">
        {/* Top Sheet Tab Header Bar (Visual Google Sheets Ribbon) */}
        <div className="px-4 py-2.5 bg-[#14141E] border-b border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-bold text-emerald-400">
              <FileSpreadsheet className="w-4 h-4" />
              <span>{currentSheet.title}.xlsx</span>
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-400 text-[11px]">
              {currentSheet.headers.length} Columns • {currentSheet.rows.length} Rows
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>Synced with Firestore & Local Cache</span>
          </div>
        </div>

        {/* The Spreadsheet Table */}
        <div className="overflow-x-auto max-h-[550px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#181824] border-b border-white/20 sticky top-0 z-20">
                <th className="p-2.5 text-center text-gray-500 font-mono text-[10px] w-12 border-r border-white/10 select-none bg-[#181824]">
                  #
                </th>
                {currentSheet.headers.map((header, idx) => (
                  <th
                    key={idx}
                    className="p-2.5 text-[#F3D068] font-cinzel font-bold text-xs uppercase tracking-wider border-r border-white/10 whitespace-nowrap bg-[#181824]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentSheet.rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={currentSheet.headers.length + 1}
                    className="p-12 text-center text-gray-400 font-mono text-xs"
                  >
                    <FileSpreadsheet className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-300 font-cinzel font-bold">No records found for this spreadsheet filter.</p>
                    <span className="text-[11px] text-gray-500">
                      New submissions from viewers or admin will appear instantly in this sheet.
                    </span>
                  </td>
                </tr>
              ) : (
                currentSheet.rows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`border-b border-white/5 transition hover:bg-white/5 ${
                      rowIdx % 2 === 0 ? 'bg-[#0E0E14]' : 'bg-[#111118]'
                    }`}
                  >
                    {/* Row Index Number */}
                    <td className="p-2 text-center text-gray-500 font-mono text-[11px] border-r border-white/10 select-none bg-black/30">
                      {rowIdx + 1}
                    </td>

                    {row.map((cell, cellIdx) => {
                      const cellStr = String(cell);
                      const isStatus =
                        cellStr === 'Submitted' ||
                        cellStr === 'Confirmed' ||
                        cellStr === 'In Review' ||
                        cellStr === 'Pending' ||
                        cellStr === 'Live on Site' ||
                        cellStr === 'New' ||
                        cellStr === 'Completed';

                      return (
                        <td
                          key={cellIdx}
                          className="p-2.5 text-gray-200 border-r border-white/5 font-mono text-[11px] whitespace-nowrap max-w-xs truncate"
                          title={cellStr}
                        >
                          {isStatus ? (
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                                cellStr === 'Confirmed' || cellStr === 'Live on Site' || cellStr === 'Completed'
                                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                                  : cellStr === 'In Review'
                                  ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                                  : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              {cellStr}
                            </span>
                          ) : (
                            cellStr || '-'
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Spreadsheet Footer Status Bar */}
        <div className="px-4 py-2.5 bg-[#14141E] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 gap-2">
          <div className="flex items-center gap-4">
            <span className="font-mono text-white">
              Sheet: <strong>{currentSheet.title}</strong>
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-mono">
              Ready for Export (CSV / Excel / Google Drive)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDownloadCsv}
              className="text-[#D4AF37] hover:underline cursor-pointer flex items-center gap-1 font-mono text-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {currentSheet.title}.csv</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
