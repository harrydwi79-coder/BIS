const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

code = code.replace(
  "import { Search, Edit2, Eye, EyeOff } from 'lucide-react';",
  "import { Search, Edit2, Eye, EyeOff, Plus } from 'lucide-react';"
);

code = code.replace(
  "import { doc, updateDoc } from 'firebase/firestore';",
  "import { doc, updateDoc, setDoc } from 'firebase/firestore';"
);

code = code.replace(
  "const [editingUser, setEditingUser] = useState<UserProfile | null>(null);",
  "const [editingUser, setEditingUser] = useState<UserProfile | null>(null);\n  const [isAdding, setIsAdding] = useState(false);\n  const [newUser, setNewUser] = useState<Partial<UserProfile>>({ role: 'PEGAWAI', canApprove: false });"
);

code = code.replace(
  "      <div className=\"relative max-w-md\">\n        <Search className=\"absolute left-3 top-3 h-4 w-4 text-slate-400\" />\n        <Input \n          placeholder=\"Cari email atau nama...\" \n          className=\"pl-10\"\n          value={searchQuery}\n          onChange={(e) => setSearchQuery(e.target.value)}\n        />\n      </div>",
  `      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Cari email atau nama..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => { setIsAdding(true); setNewUser({ role: 'PEGAWAI', canApprove: false, email: '', displayName: '', position: '', department: '' }); }} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengguna
        </Button>
      </div>`
);

code = code.replace(
  "              <TableHead>Jabatan & Dept</TableHead>\n              <TableHead>Role</TableHead>\n              <TableHead className=\"text-right\">Aksi</TableHead>",
  "              <TableHead>Jabatan & Dept</TableHead>\n              <TableHead>Role</TableHead>\n              <TableHead>Otoritas</TableHead>\n              <TableHead className=\"text-right\">Aksi</TableHead>"
);

code = code.replace(
  "                <TableCell>\n                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>\n                </TableCell>\n                <TableCell className=\"text-right\">",
  "                <TableCell>\n                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>\n                </TableCell>\n                <TableCell>\n                  {user.canApprove ? <Badge className=\"bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200\">Approval</Badge> : <span className=\"text-slate-400 text-sm\">-</span>}\n                </TableCell>\n                <TableCell className=\"text-right\">"
);

// We need to inject handleAdd
const handleUpdateCode = `
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
  };
`;
const handleAddCode = `
  const handleAdd = async () => {
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
`;

code = code.replace(
  "  const handleUpdate = async () => {",
  handleAddCode + "\n" + handleUpdateCode.replace("  const handleUpdate = async () => {", "const handleUpdate = async () => {")
);
// We might have duplicate handleUpdate if we are not careful, let's use a simpler regex

fs.writeFileSync('src/components/AdminPanel.tsx', code);
