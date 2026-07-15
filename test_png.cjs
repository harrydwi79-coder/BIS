const fs = require('fs');

const validPngB64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const validPngBuffer = Buffer.from(validPngB64, 'base64');

fs.writeFileSync('src/assets/logo1.png', validPngBuffer);
fs.writeFileSync('src/assets/logo2.png', validPngBuffer);
