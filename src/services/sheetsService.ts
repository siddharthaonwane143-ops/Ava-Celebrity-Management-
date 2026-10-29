import { getAccessToken, googleSignIn } from '../firebase';
import { TeamContactInquiry } from '../types';

/**
 * Download spreadsheet data as a clean CSV file that opens directly in Google Sheets & Excel.
 */
export function downloadCsvSpreadsheet(
  filename: string,
  headers: string[],
  rows: (string | number | boolean)[][]
): void {
  const escapeCell = (val: any) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvContent = [
    headers.map(escapeCell).join(','),
    ...rows.map((row) => row.map(escapeCell).join(','))
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export data to Google Sheets via Google Sheets API (OAuth) with seamless CSV fallback.
 */
export async function exportToGoogleSheet(
  sheetTitle: string,
  headers: string[],
  rows: (string | number | boolean)[][]
): Promise<{ spreadsheetUrl: string; spreadsheetId: string; downloadedCsv?: boolean }> {
  let token = await getAccessToken();

  if (!token) {
    // Seamlessly download CSV spreadsheet so user always gets the complete sheet instantly
    downloadCsvSpreadsheet(sheetTitle, headers, rows);
    return {
      spreadsheetUrl: '',
      spreadsheetId: '',
      downloadedCsv: true
    };
  }

  try {
    // 1. Create a new Spreadsheet in user's Google Drive
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: sheetTitle,
        },
      }),
    });

    if (!createRes.ok) {
      console.warn('Sheets API creation response not OK, downloading CSV fallback.');
      downloadCsvSpreadsheet(sheetTitle, headers, rows);
      return {
        spreadsheetUrl: '',
        spreadsheetId: '',
        downloadedCsv: true
      };
    }

    const createData = await createRes.json();
    const spreadsheetId = createData.spreadsheetId;
    const spreadsheetUrl = createData.spreadsheetUrl;

    // 2. Append header and data rows
    const allValues = [headers, ...rows];

    const appendRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: allValues,
        }),
      }
    );

    if (!appendRes.ok) {
      console.warn('Sheets API append failed, downloading CSV backup.');
      downloadCsvSpreadsheet(sheetTitle, headers, rows);
      return {
        spreadsheetUrl,
        spreadsheetId,
        downloadedCsv: true
      };
    }

    return { spreadsheetUrl, spreadsheetId, downloadedCsv: false };
  } catch (error: any) {
    console.warn('Network or API exception in exportToGoogleSheet, generating instant CSV spreadsheet:', error);
    downloadCsvSpreadsheet(sheetTitle, headers, rows);
    return {
      spreadsheetUrl: '',
      spreadsheetId: '',
      downloadedCsv: true
    };
  }
}

export async function syncTeamInquiriesToGoogleSheet(
  inquiries: TeamContactInquiry[],
  customTitle?: string
): Promise<{ spreadsheetUrl: string; spreadsheetId: string; count: number; downloadedCsv?: boolean }> {
  const headers = [
    'Inquiry Reference',
    'Contact Name',
    'Organization / Agency',
    'Inquiry Category',
    'Email Address',
    'Phone / Contact',
    'Preferred Event Date',
    'Budget Range',
    'Location / Venue',
    'Service Requirements',
    'Status',
    'Submitted At'
  ];

  const rows = inquiries.map((inq) => [
    inq.inquiryReference || '',
    inq.name || '',
    inq.organization || 'Individual / Private Client',
    inq.inquiryType || 'General Agency Inquiry',
    inq.email || '',
    inq.phone || '',
    inq.preferredDate || 'Flexible / TBD',
    inq.budgetRange || 'Unspecified',
    inq.cityVenue || 'Global / Remote',
    inq.requirements || '',
    inq.status || 'New',
    inq.createdAt ? new Date(inq.createdAt).toLocaleString() : ''
  ]);

  const title = customTitle || `AVA Celebrity Management - Team Inquiries (${new Date().toLocaleDateString()})`;
  const result = await exportToGoogleSheet(title, headers, rows);

  return {
    ...result,
    count: inquiries.length
  };
}
