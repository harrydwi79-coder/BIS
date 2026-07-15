const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

code = code.replace("import { db } from '@/firebase';", "import { db, config } from '@/firebase';\nimport { initializeApp, getApps } from 'firebase/app';\nimport { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';");

const oldHandleAdd = `  const handleAdd = async () => {
    try {
        if (!newUser.email || !newUser.displayName) {
           toast.error('Email dan Nama Lengkap wajib diisi');
           return;
        }
        const newUid = 'user_' + Math.random().toString(36).substr(2, 9);
        await setDoc(doc(db, 'users', newUid), {
            uid: newUid,
            email: newUser.email,
            displayName: newUser.displayName,
            position: newUser.position || '',
            department: newUser.department || '',
            role: newUser.role || 'PEGAWAI',
            nik: newUser.nik || '',
            plainPassword: newUser.plainPassword || '',
            canApprove: newUser.canApprove || false,
            createdAt: Date.now()
        });
        toast.success('Pengguna berhasil ditambahkan');
        setIsAdding(false);
    } catch (e: any) {
        toast.error('Gagal menambah pengguna: ' + e.message);
    }
  };`;

const newHandleAdd = `  const handleAdd = async () => {
    try {
        if (!newUser.email || !newUser.displayName) {
           toast.error('Email dan Nama Lengkap wajib diisi');
           return;
        }
        
        let secondaryApp = getApps().find(app => app.name === 'Secondary');
        if (!secondaryApp) {
            secondaryApp = initializeApp(config, 'Secondary');
        }
        const secondaryAuth = getAuth(secondaryApp);
        
        const pwd = newUser.plainPassword || '123456';
        
        // Create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newUser.email, pwd);
        const newUid = userCredential.user.uid;
        
        await setDoc(doc(db, 'users', newUid), {
            uid: newUid,
            email: newUser.email,
            displayName: newUser.displayName,
            position: newUser.position || '',
            department: newUser.department || '',
            role: newUser.role || 'PEGAWAI',
            nik: newUser.nik || '',
            plainPassword: pwd,
            canApprove: newUser.canApprove || false,
            createdAt: Date.now()
        });
        
        // Also sign out the secondary auth so it doesn't leave a lingering session in that instance
        await secondaryAuth.signOut();
        
        toast.success('Pengguna berhasil ditambahkan');
        setIsAdding(false);
    } catch (e: any) {
        toast.error('Gagal menambah pengguna: ' + e.message);
    }
  };`;

code = code.replace(oldHandleAdd, newHandleAdd);
fs.writeFileSync('src/components/AdminPanel.tsx', code);
