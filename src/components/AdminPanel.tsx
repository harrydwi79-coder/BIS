import React, { useState } from 'react';
import { UserProfile, UserRole } from '@/types';
import { db } from '@/firebase';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from './ui/table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Search, Edit2, Eye, EyeOff, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AdminPanelProps {
  users: UserProfile[];
}

export default function AdminPanel({ users }: AdminPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState<Partial<UserProfile>>({ role: 'PEGAWAI', canApprove: false });
  const [showPasswordMap, setShowPasswordMap] = useState<{[key: string]: boolean}>({});
  const [showDialogPassword, setShowDialogPassword] = useState(false);

  const filteredUsers = users.filter(u => 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );



  const togglePasswordVisibility = (uid: string) => {
    setShowPasswordMap(prev => ({ ...prev, [uid]: !prev[uid] }));
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Panel - Monitor Pengguna</h1>
        <p className="text-slate-500">Kelola dan edit detail seluruh akun pengguna di sistem.</p>
      </div>

      <div className="flex items-center justify-between">
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
              <TableHead>Otoritas</TableHead>
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
                <TableCell>
                  {user.canApprove ? <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200">Approval</Badge> : <span className="text-slate-400 text-sm">-</span>}
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

            {isAdding && (
        <Dialog open={isAdding} onOpenChange={(open) => !open && setIsAdding(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={newUser.email || ''} onChange={(e) => setNewUser({...newUser, email: e.target.value})} placeholder="nama@perusahaan.com" />
              </div>
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={newUser.displayName || ''} onChange={(e) => setNewUser({...newUser, displayName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Password Mock</Label>
                <Input type="password" value={newUser.plainPassword || ''} onChange={(e) => setNewUser({...newUser, plainPassword: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>NIK</Label>
                <Input value={newUser.nik || ''} onChange={(e) => setNewUser({...newUser, nik: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Jabatan</Label>
                <Input value={newUser.position || ''} onChange={(e) => setNewUser({...newUser, position: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Departemen</Label>
                <Input value={newUser.department || ''} onChange={(e) => setNewUser({...newUser, department: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newUser.role || 'PEGAWAI'} onValueChange={(v: any) => setNewUser({...newUser, role: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PEGAWAI">PEGAWAI</SelectItem>
                        <SelectItem value="ATASAN">ATASAN</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Otoritas Approval</Label>
                  <p className="text-sm text-slate-500">Izinkan pengguna ini menyetujui surat tugas</p>
                </div>
                <Switch 
                  checked={newUser.canApprove || false} 
                  onCheckedChange={(c) => setNewUser({...newUser, canApprove: c})} 
                />
              </div>
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={() => setIsAdding(false)}>Batal</Button>
               <Button onClick={handleAdd}>Tambah Pengguna</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Otoritas Approval</Label>
                  <p className="text-sm text-slate-500">Izinkan pengguna ini menyetujui surat tugas</p>
                </div>
                <Switch 
                  checked={editingUser.canApprove || false} 
                  onCheckedChange={(c) => setEditingUser({...editingUser, canApprove: c})} 
                />
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
