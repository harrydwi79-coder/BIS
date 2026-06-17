import React, { useState } from 'react';
import { UserProfile, UserRole } from '@/types';
import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Search, Edit2, Eye, EyeOff } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AdminPanelProps {
  users: UserProfile[];
}

export default function AdminPanel({ users }: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<{[key: string]: boolean}>({});
  const [showDialogPassword, setShowDialogPassword] = useState(false);

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePasswordVisibility = (uid: string) => {
    setShowPasswordMap(prev => ({ ...prev, [uid]: !prev[uid] }));
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
            plainPassword: editingUser.plainPassword || ''
        });
        toast.success('Profil pengguna berhasil diperbarui');
        setEditingUser(null);
    } catch (e: any) {
        toast.error('Gagal memperbarui profil: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Panel - Monitor Pengguna</h1>
        <p className="text-slate-500">Kelola dan edit detail seluruh akun pengguna di sistem.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Cari email atau nama..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>NIK</TableHead>
              <TableHead>Jabatan & Dept</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map(user => {
              const isVisible = showPasswordMap[user.uid];
              const passDisplay = user.plainPassword ? (isVisible ? user.plainPassword : '••••••••') : '-';
              return (
              <TableRow key={user.uid}>
                <TableCell className="font-medium">{user.displayName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{passDisplay}</span>
                    {user.plainPassword && (
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => togglePasswordVisibility(user.uid)}>
                        {isVisible ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    )}
                  </div>
                </TableCell>
                <TableCell>{user.nik || '-'}</TableCell>
                <TableCell>
                  <div className="text-sm">{user.position}</div>
                  <div className="text-xs text-slate-500">{user.department}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingUser(user); setShowDialogPassword(false); }}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </div>

      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Detail Pengguna</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={editingUser.displayName} onChange={(e) => setEditingUser({...editingUser, displayName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Email (Read Only)</Label>
                <Input value={editingUser.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input 
                    type={showDialogPassword ? 'text' : 'password'} 
                    value={editingUser.plainPassword || ''} 
                    onChange={(e) => setEditingUser({...editingUser, plainPassword: e.target.value})} 
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1 h-8 w-8 text-slate-500" 
                    onClick={() => setShowDialogPassword(!showDialogPassword)}
                  >
                    {showDialogPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Mengubah ini hanya mengubah tampilan di panel admin lokal untuk mockup (tidak mensinkronisasi auth firebase).</p>
              </div>
              <div className="space-y-2">
                <Label>NIK</Label>
                <Input value={editingUser.nik || ''} onChange={(e) => setEditingUser({...editingUser, nik: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Jabatan</Label>
                <Input value={editingUser.position} onChange={(e) => setEditingUser({...editingUser, position: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Departemen</Label>
                <Input value={editingUser.department} onChange={(e) => setEditingUser({...editingUser, department: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={editingUser.role} onValueChange={(v: UserRole) => setEditingUser({...editingUser, role: v})}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PEGAWAI">PEGAWAI</SelectItem>
                        <SelectItem value="ATASAN">ATASAN</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={() => setEditingUser(null)}>Batal</Button>
               <Button onClick={handleUpdate}>Simpan Perubahan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
