const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf-8');
code = code.replace(
  'allow write: if isOwner(userId);',
  "allow write: if isOwner(userId) || (isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN') || (isAuthenticated() && request.auth.token.email == 'bosbesak@perusahaan.com');"
);
fs.writeFileSync('firestore.rules', code);
