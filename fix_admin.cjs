const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// The replacement script earlier likely replaced `const handleUpdate = async () => {` with the addition, and then some remnant of it was left.
// Let's just find the entire block that is malformed and replace it.

const addHandle = `  const handleAdd = async () => {
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
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
        await updateDoc(doc(db, 'users', editingUser.uid), {
            displayName: editingUser.displayName,
            position: editingUser.position,
            department: editingUser.department,
            role: editingUser.role,
            nik: editingUser.nik || '',
            plainPassword: editingUser.plainPassword || '',
            canApprove: editingUser.canApprove || false
        });
        toast.success('Profil pengguna berhasil diperbarui');
        setEditingUser(null);
    } catch (e: any) {
        toast.error('Gagal memperbarui profil: ' + e.message);
    }
  };`;

// We will replace everything between `const togglePasswordVisibility = ` and `return (` with our new handlers.
const startToken = "  const togglePasswordVisibility = (uid: string) => {\n    setShowPasswordMap(prev => ({ ...prev, [uid]: !prev[uid] }));\n  };";
const endToken = "  return (";

const startIdx = code.indexOf(startToken);
const endIdx = code.indexOf(endToken);

if (startIdx !== -1 && endIdx !== -1) {
  const newMiddle = `\n\n${startToken}\n\n${addHandle}\n\n`;
  code = code.substring(0, startIdx) + newMiddle + code.substring(endIdx);
  fs.writeFileSync('src/components/AdminPanel.tsx', code);
  console.log('Fixed');
} else {
  console.log('Tokens not found');
}
