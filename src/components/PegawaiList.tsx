/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Edit, 
  Shield, 
  Mail,
  Briefcase
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { UserProfile, UserRole } from '@/types';

interface PegawaiListProps {
  pegawai: UserProfile[];
  onEdit: (uid: string) => void;
  onAdd: () => void;
}

export default function PegawaiList({ pegawai, onEdit, onAdd }: PegawaiListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredPegawai = pegawai.filter(p => 
    p.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200">Admin</Badge>;
      case 'ATASAN':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Atasan</Badge>;
      case 'PEGAWAI':
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200">Pegawai</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Pegawai</h1>
          <p className="text-slate-500">Kelola informasi dan hak akses pegawai.</p>
        </div>
        <Button onClick={onAdd} className="bg-primary hover:bg-primary/90 text-white font-semibold">
          <UserPlus className="w-4 h-4 mr-2" />
          Tambah Pegawai
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Cari nama, email, atau jabatan..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead>Nama Pegawai</TableHead>
              <TableHead>Email & Departemen</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPegawai.length > 0 ? (
              filteredPegawai.map((p) => (
                <TableRow key={p.uid} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {p.displayName.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-900">{p.displayName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Mail className="w-3 h-3" />
                        {p.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider">
                        <Briefcase className="w-3 h-3" />
                        {p.department}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {p.position}
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(p.role)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(p.uid)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Profil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Shield className="mr-2 h-4 w-4" />
                          Ubah Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Users className="w-12 h-12 mb-4 opacity-20" />
                    <p>Tidak ada data pegawai yang ditemukan.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
