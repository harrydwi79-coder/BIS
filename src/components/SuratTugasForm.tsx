/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Toaster, toast } from 'sonner';
import { 
  Save, 
  X, 
  Calendar as CalendarIcon,
  UserPlus,
  Trash2,
  Sparkles,
  Loader2
} from 'lucide-react';
import { generateSuratDescription } from '@/services/geminiService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { SuratTugas, UserProfile } from '@/types';

const formSchema = z.object({
  nomorSurat: z.string().min(5, 'Nomor surat minimal 5 karakter'),
  perihal: z.string().min(10, 'Perihal minimal 10 karakter'),
  deskripsi: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  tanggalMulai: z.string().min(1, 'Tanggal mulai harus diisi'),
  tanggalSelesai: z.string().min(1, 'Tanggal selesai harus diisi'),
  tempat: z.string().min(3, 'Tempat harus diisi'),
});

interface SuratTugasFormProps {
  initialData?: SuratTugas;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  allPegawai: UserProfile[];
  loading: boolean;
}

export default function SuratTugasForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  allPegawai,
  loading 
}: SuratTugasFormProps) {
  const [selectedPegawaiIds, setSelectedPegawaiIds] = React.useState<string[]>(
    initialData?.pegawaiIds || []
  );

  const [isGenerating, setIsGenerating] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomorSurat: initialData?.nomorSurat || '',
      perihal: initialData?.perihal || '',
      deskripsi: initialData?.deskripsi || '',
      tanggalMulai: initialData?.tanggalMulai || '',
      tanggalSelesai: initialData?.tanggalSelesai || '',
      tempat: initialData?.tempat || '',
    },
  });

  const handlePegawaiToggle = (uid: string) => {
    setSelectedPegawaiIds(prev => 
      prev.includes(uid) ? prev.filter(id => id !== uid) : [...prev, uid]
    );
  };

  const handleGenerateAI = async () => {
    const perihal = form.getValues('perihal');
    const tempat = form.getValues('tempat');
    
    if (!perihal || !tempat) {
      toast.error('Harap isi Perihal dan Tempat terlebih dahulu');
      return;
    }

    setIsGenerating(true);
    const description = await generateSuratDescription(perihal, tempat);
    setIsGenerating(false);

    if (description) {
      form.setValue('deskripsi', description);
      toast.success('Deskripsi berhasil dibuat oleh AI');
    } else {
      toast.error('Gagal membuat deskripsi dengan AI');
    }
  };

  const onFormSubmit = async (values: z.infer<typeof formSchema>) => {
    if (selectedPegawaiIds.length === 0) {
      alert('Pilih minimal satu pegawai');
      return;
    }
    
    const pegawaiNames = allPegawai
      .filter(p => selectedPegawaiIds.includes(p.uid))
      .map(p => p.displayName);

    await onSubmit({
      ...values,
      pegawaiIds: selectedPegawaiIds,
      pegawaiNames,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Edit Surat Tugas' : 'Buat Surat Tugas Baru'}
          </h2>
          <p className="text-sm text-slate-500">Lengkapi formulir di bawah ini dengan benar.</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onFormSubmit)} className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nomorSurat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Surat</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: 001/ST/HRD/2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="perihal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perihal</FormLabel>
                  <FormControl>
                    <Input placeholder="Tujuan penugasan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanggalMulai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Mulai</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tanggalSelesai"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Selesai</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tempat"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Tempat / Lokasi Penugasan</FormLabel>
                  <FormControl>
                    <Input placeholder="Lokasi tujuan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deskripsi"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <FormLabel>Deskripsi Tugas</FormLabel>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      className="text-accent hover:text-accent/80 h-7 text-[10px] font-bold uppercase tracking-wider"
                      onClick={handleGenerateAI}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Sparkles className="w-3 h-3 mr-1" />
                      )}
                      Generate dengan AI
                    </Button>
                  </div>
                  <FormControl>
                    <Textarea 
                      placeholder="Rincian tugas yang harus dilaksanakan..." 
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Daftar Pegawai yang Ditugaskan</Label>
              <span className="text-xs text-slate-500">{selectedPegawaiIds.length} Pegawai terpilih</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
              {allPegawai.map((pegawai) => (
                <div 
                  key={pegawai.uid}
                  onClick={() => handlePegawaiToggle(pegawai.uid)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedPegawaiIds.includes(pegawai.uid)
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedPegawaiIds.includes(pegawai.uid) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {pegawai.displayName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{pegawai.displayName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{pegawai.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {initialData ? 'Simpan Perubahan' : 'Simpan & Kirim'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
