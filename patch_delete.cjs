const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

code = code.replace(
  "import { Search, Edit2, Eye, EyeOff, Plus } from 'lucide-react';",
  "import { Search, Edit2, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';"
);
code = code.replace(
  "import { doc, updateDoc, setDoc } from 'firebase/firestore';",
  "import { doc, updateDoc, setDoc, deleteDoc } from 'firebase/firestore';"
);

const oldHandleUpdate = `  const handleUpdate = async () => {`;
const newHandleUpdate = `  const handleDelete = async (uid: string) => {
    if (window.confirm('Yakin ingin menghapus pengguna ini?')) {
        try {
            await deleteDoc(doc(db, 'users', uid));
            toast.success('Pengguna berhasil dihapus');
        } catch (e: any) {
            toast.error('Gagal menghapus pengguna: ' + e.message);
        }
    }
  };

  const handleUpdate = async () => {`;
code = code.replace(oldHandleUpdate, newHandleUpdate);

const oldActions = `<TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingUser(user); setShowDialogPassword(false); }}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </TableCell>`;
const newActions = `<TableCell className="text-right flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingUser(user); setShowDialogPassword(false); }}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  {currentUser?.email === 'bosbesak@perusahaan.com' && (
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(user.uid)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  )}
                </TableCell>`;
code = code.replace(oldActions, newActions);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
