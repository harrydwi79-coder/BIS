const fs = require('fs');
let code = fs.readFileSync('src/components/SuratTugasDetail.tsx', 'utf-8');
const badLinePattern = /\{surat\.status === 'PENDING'.*?\&\& \(\n/g;
const goodLine = `            {surat.status === 'PENDING' && (user?.canApprove || user?.role === 'ATASAN' || user?.role === 'ADMIN' || user?.email === 'bosbesak@perusahaan.com') && (\n`;

// Since it was mangled on one line, let's find the mangled text.
// The mangled text starts with "{surat.status === 'PENDING'" and ends with "( (" or similar.
const lines = code.split('\n');
const fixedLines = lines.map(line => {
  if (line.includes("{surat.status === 'PENDING'") && line.includes("user?.role === 'ATASAN'")) {
    return `            {surat.status === 'PENDING' && (user?.canApprove || user?.role === 'ATASAN' || user?.role === 'ADMIN' || user?.email === 'bosbesak@perusahaan.com') && (`
  }
  return line;
});

fs.writeFileSync('src/components/SuratTugasDetail.tsx', fixedLines.join('\n'));
