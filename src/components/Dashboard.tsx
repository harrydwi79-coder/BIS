/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowRight,
  Building2,
  Users,
  Briefcase,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import { SuratTugas, UserProfile } from '@/types';
import { BRANCH_CODES, DEPT_CODES } from '@/constants';
import { generateNomorSurat } from '@/lib/surat-utils';

interface DashboardProps {
  user: UserProfile | null;
  suratTugas: SuratTugas[];
  allPegawai: UserProfile[];
  onNewSurat: () => void;
  onViewSurat: (id: string) => void;
  onSubmitSurat: (data: any) => Promise<void>;
}

export default function Dashboard({ user, suratTugas, allPegawai, onNewSurat, onViewSurat, onSubmitSurat }: DashboardProps) {
  const nextSequence = suratTugas.length + 1;

  const [formData, setFormData] = React.useState({
    cabang: '',
    departemen: '',
    pegawaiIds: [] as string[],
    keterangan: '',
    perihal: '',
    nomorSurat: ''
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (formData.cabang && formData.departemen) {
      const generated = generateNomorSurat(formData.cabang, formData.departemen, nextSequence);
      setFormData(prev => ({ ...prev, nomorSurat: generated }));
    }
  }, [formData.cabang, formData.departemen, nextSequence]);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cabang || !formData.departemen || formData.pegawaiIds.length === 0 || !formData.perihal) {
      toast.error('Mohon lengkapi data surat tugas');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedPegawaiNames = allPegawai
        .filter(p => formData.pegawaiIds.includes(p.uid))
        .map(p => p.displayName);

      await onSubmitSurat({
        nomorSurat: formData.nomorSurat,
        perihal: formData.perihal,
        deskripsi: formData.keterangan,
        tempat: formData.cabang,
        cabang: formData.cabang,
        departemen: formData.departemen,
        pegawaiIds: formData.pegawaiIds,
        pegawaiNames: selectedPegawaiNames,
        tanggalMulai: new Date().toISOString().split('T')[0],
        tanggalSelesai: new Date().toISOString().split('T')[0],
      });

      setFormData({
        cabang: '',
        departemen: '',
        pegawaiIds: [],
        keterangan: '',
        perihal: '',
        nomorSurat: ''
      });
      toast.success('Surat tugas berhasil diajukan!');
    } catch (error) {
      toast.error('Gagal mengajukan surat tugas');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = [
    { 
      label: 'Total Surat', 
      value: suratTugas.length, 
      icon: FileText, 
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Menunggu Persetujuan', 
      value: suratTugas.filter(s => s.status === 'PENDING').length, 
      icon: Clock, 
      color: 'bg-amber-500',
      textColor: 'text-amber-600'
    },
    { 
      label: 'Disetujui', 
      value: suratTugas.filter(s => s.status === 'APPROVED').length, 
      icon: CheckCircle2, 
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    },
    { 
      label: 'Ditolak/Dibatalkan', 
      value: suratTugas.filter(s => ['REJECTED', 'CANCELLED'].includes(s.status)).length, 
      icon: AlertCircle, 
      color: 'bg-rose-500',
      textColor: 'text-rose-600'
    },
  ];

  const recentSurat = [...suratTugas]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);

  const today = new Date().toLocaleDateString('id-ID', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const quickActions = [
    { label: 'Buat Surat', icon: Plus, onClick: onNewSurat, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Histori Surat', icon: FileText, onClick: () => toast.info('Buka tab Histori'), color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Data Pegawai', icon: ArrowRight, onClick: () => toast.info('Buka tab Pegawai'), color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-sm font-medium text-text-muted mb-1">{today}</p>
          <h1 className="text-3xl font-bold text-text-main tracking-tight">Selamat Pagi, {user?.displayName}! 👋</h1>
          <p className="text-text-muted mt-1">Berikut adalah ringkasan aktivitas penugasan Anda hari ini.</p>
        </div>
        <div className="flex gap-3">
          {quickActions.map((action, i) => (
            <Button 
              key={i} 
              variant="outline" 
              className={`h-auto py-2.5 px-4 border-border hover:bg-slate-50 flex flex-col items-center gap-1 min-w-[100px]`}
              onClick={action.onClick}
            >
              <div className={`p-2 rounded-full ${action.bg} ${action.color}`}>
                <action.icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`${stat.color.replace('bg-', 'bg-opacity-10 text-')} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-extrabold text-text-main">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-text-main flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              Surat Tugas Terbaru
            </h2>
            <Button variant="link" className="text-accent font-bold text-sm p-0 h-auto">Lihat Semua</Button>
          </div>

          <div className="bg-white rounded-xl border border-border shadow-sm divide-y divide-border overflow-hidden">
            {recentSurat.length > 0 ? (
              recentSurat.map((surat) => (
                <div 
                  key={surat.id} 
                  className="group flex items-center justify-between p-5 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => onViewSurat(surat.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                      surat.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                      surat.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {surat.pegawaiNames[0]?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text-main group-hover:text-accent transition-colors">{surat.perihal}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">{surat.nomorSurat}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] text-text-muted">{new Date(surat.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      surat.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                      surat.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {surat.status === 'APPROVED' ? 'Disetujui' : surat.status === 'PENDING' ? 'Menunggu' : 'Ditolak'}
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-accent transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-slate-400 font-medium">Belum ada aktivitas penugasan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-text-main">Informasi Saya</h2>
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary to-accent" />
            <div className="px-6 pb-8">
              <div className="relative -mt-12 mb-4">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 border border-slate-200">
                    {user?.displayName?.charAt(0)}
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-text-main">{user?.displayName}</h3>
                <p className="text-sm font-bold text-accent uppercase tracking-wider">{user?.position}</p>
                <p className="text-xs text-text-muted">{user?.department} Department</p>
              </div>

              <div className="mt-8 space-y-4 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">ID Pegawai</span>
                  <span className="text-sm font-mono font-bold text-text-main">#PTBSM-{user?.uid.slice(0, 5).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Email</span>
                  <span className="text-sm font-medium text-text-main">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Hak Akses</span>
                  <Badge className="bg-primary/10 text-primary border-none text-[9px] font-bold uppercase tracking-wider">
                    {user?.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Announcement Placeholder */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-amber-900 uppercase tracking-tight">Pengumuman</h4>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Pastikan semua laporan hasil penugasan diunggah maksimal 3 hari setelah tanggal selesai tugas.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Surat Tugas Form */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-accent" />
          <h2 className="text-lg font-bold text-text-main">Input Surat Tugas Cepat</h2>
        </div>
        
        <Card className="border-border shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-border">
            <CardTitle className="text-base">Formulir Penugasan Baru</CardTitle>
            <CardDescription>Gunakan formulir ini untuk pengajuan surat tugas mendesak secara cepat.</CardDescription>
          </CardHeader>
          <form onSubmit={handleQuickSubmit}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="perihal">Perihal / Judul Tugas</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="perihal" 
                        placeholder="Contoh: Perbaikan Jaringan Cabang" 
                        className="pl-10"
                        value={formData.perihal}
                        onChange={(e) => setFormData({...formData, perihal: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nomorSurat">Nomor Surat (Otomatis)</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input 
                        id="nomorSurat" 
                        placeholder="Pilih Cabang & Dept..." 
                        className="pl-10 bg-slate-50 font-mono"
                        value={formData.nomorSurat}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cabang">Cabang</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                        <Select 
                          onValueChange={(value) => setFormData({...formData, cabang: value})}
                          value={formData.cabang}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Pilih Cabang" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(BRANCH_CODES).map(branch => (
                              <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="departemen">Departemen</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                        <Select 
                          onValueChange={(value) => setFormData({...formData, departemen: value})}
                          value={formData.departemen}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Pilih Dept" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.keys(DEPT_CODES).filter(d => d !== 'Parts').map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Pegawai yang Bertugas</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-slate-400 z-10" />
                      <Select 
                        value=""
                        onValueChange={(value: string) => {
                          if (!formData.pegawaiIds.includes(value)) {
                            setFormData({...formData, pegawaiIds: [...formData.pegawaiIds, value]});
                          }
                        }}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Pilih Pegawai" />
                        </SelectTrigger>
                        <SelectContent>
                          {allPegawai.map(p => (
                            <SelectItem key={p.uid} value={p.uid}>
                              {p.displayName} ({p.position})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Selected Pegawai Badges */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.pegawaiIds.map(id => {
                        const p = allPegawai.find(peg => peg.uid === id);
                        return (
                          <Badge key={id} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                            {p?.displayName}
                            <button 
                              type="button"
                              onClick={() => setFormData({...formData, pegawaiIds: formData.pegawaiIds.filter(pid => pid !== id)})}
                              className="hover:bg-slate-200 rounded-full p-0.5"
                            >
                              <Plus className="w-3 h-3 rotate-45" />
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keterangan">Keterangan Tambahan</Label>
                    <Textarea 
                      id="keterangan" 
                      placeholder="Detail tugas atau instruksi khusus..." 
                      className="min-h-[100px] resize-none"
                      value={formData.keterangan}
                      onChange={(e) => setFormData({...formData, keterangan: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 border-t border-border p-4 flex justify-end">
              <Button 
                type="submit" 
                className="bg-accent hover:bg-accent/90 text-white font-bold px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mengirim...' : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Ajukan Surat Tugas
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );


}
