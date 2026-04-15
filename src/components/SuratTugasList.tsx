/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  FileText,
  Calendar
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SuratTugas, UserProfile } from '@/types';

interface SuratTugasListProps {
  suratTugas: SuratTugas[];
  user: UserProfile | null;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SuratTugasList({ 
  suratTugas, 
  user, 
  onView, 
  onEdit, 
  onDelete 
}: SuratTugasListProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('ALL');

  const filteredData = suratTugas.filter(item => {
    const matchesSearch = 
      item.nomorSurat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.perihal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.pegawaiNames.some(name => name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">Disetujui</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Menunggu</Badge>;
      case 'REJECTED':
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 border-rose-200">Ditolak</Badge>;
      case 'DRAFT':
        return <Badge variant="outline" className="text-slate-500">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="title-text">
          <h1 className="text-2xl font-bold text-text-main">Histori Surat Tugas</h1>
          <p className="text-sm text-text-muted">Mengelola dan melacak penugasan resmi perusahaan.</p>
        </div>
        {(user?.role === 'ADMIN' || user?.role === 'ATASAN') && (
          <Button onClick={() => toast.info('Gunakan tab Buat Surat')} className="bg-accent hover:bg-accent/90 text-white font-semibold px-6">
            + Buat Surat Baru
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input 
            placeholder="Cari nomor surat atau nama pegawai..." 
            className="pl-10 bg-white border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-10 border-border bg-white text-text-muted">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-10 border-border bg-white text-text-muted">
            <Download className="w-4 h-4 mr-2" />
            Ekspor
          </Button>
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-text-muted py-4">Nomor Surat</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-text-muted py-4">Nama Pegawai</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-text-muted py-4">Tujuan Tugas</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-text-muted py-4">Tanggal</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-text-muted py-4">Status</TableHead>
              <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest text-text-muted py-4">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-b border-border last:border-0">
                  <TableCell className="font-bold text-sm text-text-main">
                    {item.nomorSurat}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-text-main">
                    {item.pegawaiNames.join(', ')}
                  </TableCell>
                  <TableCell className="text-sm text-text-muted">
                    {item.perihal}
                  </TableCell>
                  <TableCell className="text-sm text-text-muted">
                    {new Date(item.tanggalMulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(item.status)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="text-accent text-xs font-bold hover:underline"
                        onClick={() => onView(item.id)}
                      >
                        Detail
                      </button>
                      {(user?.role === 'ADMIN' || (user?.role === 'ATASAN' && item.status === 'PENDING')) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => onEdit(item.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDelete(item.id)}
                              className="text-rose-600 focus:text-rose-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-text-muted">
                    <FileText className="w-12 h-12 mb-4 opacity-10" />
                    <p>Tidak ada surat tugas yang ditemukan.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="bg-slate-50/50 border-t border-border px-6 py-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-text-muted">
          <div>Menampilkan {filteredData.length} dari {suratTugas.length} surat</div>
          <div className="flex gap-4">
            <button className="hover:text-accent transition-colors">[ Sebelumnya ]</button>
            <button className="hover:text-accent transition-colors">[ Selanjutnya ]</button>
          </div>
        </div>
      </div>
    </div>
  );

}
