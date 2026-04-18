/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  Loader2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { SuratTugas, UserProfile } from '@/types';
import { SuratTugasPrint } from './SuratTugasPrint';

interface SuratTugasDetailProps {
  surat: SuratTugas;
  user: UserProfile | null;
  allPegawai: UserProfile[];
  onBack: () => void;
  onApprove?: (id: string) => Promise<void>;
  onReject?: (id: string) => Promise<void>;
  loading?: boolean;
}

export default function SuratTugasDetail({ 
  surat, 
  user, 
  allPegawai,
  onBack, 
  onApprove, 
  onReject,
  loading 
}: SuratTugasDetailProps) {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const printRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Surat_Tugas_${surat.nomorSurat.replace(/\//g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return { label: 'Disetujui', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 };
      case 'PENDING':
        return { label: 'Menunggu Persetujuan', color: 'bg-amber-100 text-amber-700', icon: Clock };
      case 'REJECTED':
        return { label: 'Ditolak', color: 'bg-rose-100 text-rose-700', icon: XCircle };
      default:
        return { label: status, color: 'bg-slate-100 text-slate-700', icon: FileText };
    }
  };

  const statusInfo = getStatusInfo(surat.status);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-slate-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <div className="flex items-center gap-2">
          {surat.status === 'APPROVED' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownloadPDF}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Hidden Print Template */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div className="bg-white">
          <SuratTugasPrint 
            ref={printRef} 
            surat={surat} 
            pegawaiDetails={allPegawai} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-slate-200 shadow-sm overflow-hidden">
          <div className={`h-2 ${statusInfo.color.split(' ')[0]}`} />
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <Badge className={`${statusInfo.color} border-none px-3 py-1`}>
                <statusInfo.icon className="w-3 h-3 mr-1" />
                {statusInfo.label}
              </Badge>
              <span className="text-xs text-slate-400">Dibuat: {new Date(surat.createdAt).toLocaleString('id-ID')}</span>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">{surat.perihal}</CardTitle>
            <p className="text-slate-500 font-mono text-sm">{surat.nomorSurat}</p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Waktu Penugasan</p>
                  <p className="text-sm font-medium text-slate-700">
                    {new Date(surat.tanggalMulai).toLocaleDateString('id-ID')} - {new Date(surat.tanggalSelesai).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lokasi</p>
                  <p className="text-sm font-medium text-slate-700">{surat.tempat}</p>
                </div>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Deskripsi Tugas</p>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {surat.deskripsi}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Pegawai yang Ditugaskan</p>
              <div className="flex flex-wrap gap-2">
                {surat.pegawaiNames.map((name, i) => (
                  <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 px-3 py-1">
                    <Users className="w-3 h-3 mr-1" />
                    {name}
                  </Badge>
                ))}
              </div>
            </div>

            {surat.status === 'PENDING' && (user?.role === 'ATASAN' || user?.role === 'ADMIN' || user?.email === 'bosbesak@perusahaan.com') && (
              <div className="flex items-center gap-3 pt-4">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => onApprove?.(surat.id)}
                  disabled={loading}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Setujui Surat
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => onReject?.(surat.id)}
                  disabled={loading}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Tolak Surat
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Informasi Pembuat</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                  {surat.pembuatName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{surat.pembuatName}</p>
                  <p className="text-xs text-slate-500">Pembuat Dokumen</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Histori Perubahan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="px-6 pb-6 space-y-6">
                {surat.history && surat.history.length > 0 ? (
                  surat.history.map((h, i) => (
                    <div key={h.id} className="relative pl-6 pb-2 last:pb-0">
                      {i !== surat.history.length - 1 && (
                        <div className="absolute left-[7px] top-2 bottom-0 w-[2px] bg-slate-100" />
                      )}
                      <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500 z-10" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{h.action}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Oleh {h.userName} • {new Date(h.timestamp).toLocaleString('id-ID')}
                        </p>
                        {h.details && (
                          <p className="text-[10px] text-slate-400 mt-1 italic">{h.details}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">Belum ada histori.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
