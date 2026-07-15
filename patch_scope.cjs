const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

code = code.replace(
`  const handleAdd = async () => {
    try {
        if (!newUser.email || !newUser.displayName) {
           toast.error('Email dan Nama Lengkap wajib diisi');
           return;
        }`,
`  const handleAdd = async () => {
    let secondaryAuth: any = null;
    try {
        if (!newUser.email || !newUser.displayName) {
           toast.error('Email dan Nama Lengkap wajib diisi');
           return;
        }`
);

code = code.replace(
`        const secondaryAuth = getAuth(secondaryApp);`,
`        secondaryAuth = getAuth(secondaryApp);`
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
