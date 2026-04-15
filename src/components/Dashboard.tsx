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
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { SuratTugas, UserProfile } from '@/types';

interface DashboardProps {
  user: UserProfile | null;
  suratTugas: SuratTugas[];
  onNewSurat: () => void;
  onViewSurat: (id: string) => void;
}

export default function Dashboard({ user, suratTugas, onNewSurat, onViewSurat }: DashboardProps) {
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
    </div>
  );


}
