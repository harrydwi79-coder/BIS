const fs = require('fs');

const svg1 = `<svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="40" fill="#e2e8f0" rx="4"/>
  <text x="60" y="24" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569" text-anchor="middle">LOGO BSM</text>
</svg>`;

const svg2 = `<svg width="100" height="40" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="40" fill="#e2e8f0" rx="4"/>
  <text x="50" y="24" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569" text-anchor="middle">LOGO ADS</text>
</svg>`;

const b64_1 = Buffer.from(svg1).toString('base64');
const b64_2 = Buffer.from(svg2).toString('base64');

fs.writeFileSync('src/assets/logos.ts', `export const logo1Base64 = 'data:image/svg+xml;base64,${b64_1}';\nexport const logo2Base64 = 'data:image/svg+xml;base64,${b64_2}';\n`);
