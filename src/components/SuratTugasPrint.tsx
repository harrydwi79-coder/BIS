/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SuratTugas, UserProfile } from '@/types';

interface SuratTugasPrintProps {
  surat: SuratTugas;
  pegawaiDetails: UserProfile[];
}

export const SuratTugasPrint = React.forwardRef<HTMLDivElement, SuratTugasPrintProps>(
  ({ surat, pegawaiDetails }, ref) => {
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    };

    return (
      <div ref={ref} className="p-12 font-serif w-[210mm] min-h-[297mm] mx-auto shadow-lg print:shadow-none" style={{ backgroundColor: '#ffffff', color: '#0f172a' }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 pb-4 mb-8" style={{ borderColor: '#0f172a' }}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl italic" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
              BSM
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">PT BERKARYA SINERGI MANDIRI</h1>
              <p className="text-[10px] max-w-[400px]" style={{ color: '#475569' }}>
                Vivo Business Park Blok I No. 17 Jl. Pembangunan 3, Neglasari, Kota Tangerang Prov. Banten
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded-full border flex items-center justify-center text-[8px]" style={{ borderColor: '#0f172a' }}>A</div>
            <div className="w-4 h-4 rounded-full border flex items-center justify-center text-[8px]" style={{ borderColor: '#0f172a' }}>D</div>
            <div className="w-4 h-4 rounded-full border flex items-center justify-center text-[8px]" style={{ borderColor: '#0f172a' }}>S</div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold underline decoration-1 underline-offset-4 mb-1">SURAT TUGAS</h2>
          <p className="text-sm font-bold">No. : {surat.nomorSurat}</p>
        </div>

        {/* Body */}
        <div className="space-y-6 text-sm leading-relaxed">
          <p>Dengan ini kami menugaskan untuk melakukan Perjalanan/Tugas Dinas kepada :</p>

          <table className="w-full border-collapse border text-center" style={{ borderColor: '#cbd5e1' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th className="border py-2 px-4 font-bold" style={{ borderColor: '#cbd5e1' }}>Nama</th>
                <th className="border py-2 px-4 font-bold" style={{ borderColor: '#cbd5e1' }}>NIK</th>
                <th className="border py-2 px-4 font-bold" style={{ borderColor: '#cbd5e1' }}>Jabatan</th>
                <th className="border py-2 px-4 font-bold" style={{ borderColor: '#cbd5e1' }}>Departemen</th>
              </tr>
            </thead>
            <tbody>
              {surat.pegawaiIds.map((id) => {
                const p = pegawaiDetails.find((peg) => peg.uid === id);
                return (
                  <tr key={id}>
                    <td className="border py-2 px-4" style={{ borderColor: '#cbd5e1' }}>{p?.displayName || '-'}</td>
                    <td className="border py-2 px-4" style={{ borderColor: '#cbd5e1' }}>{p?.nik || '-'}</td>
                    <td className="border py-2 px-4" style={{ borderColor: '#cbd5e1' }}>{p?.position || '-'}</td>
                    <td className="border py-2 px-4" style={{ borderColor: '#cbd5e1' }}>{p?.department || '-'}</td>
                  </tr>
                );
              })}
              {/* Fill empty rows if needed to match template */}
              {[...Array(Math.max(0, 3 - surat.pegawaiIds.length))].map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="border py-2 px-4 h-8" style={{ borderColor: '#cbd5e1' }}></td>
                  <td className="border py-2 px-4 h-8" style={{ borderColor: '#cbd5e1' }}></td>
                  <td className="border py-2 px-4 h-8" style={{ borderColor: '#cbd5e1' }}></td>
                  <td className="border py-2 px-4 h-8" style={{ borderColor: '#cbd5e1' }}></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-2 mt-8">
            <div className="flex gap-4">
              <span className="w-40 flex justify-between">○ Tanggal Berangkat <span>:</span></span>
              <span className="font-medium">{formatDate(surat.tanggalMulai)}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-40 flex justify-between">○ Tanggal Kembali <span>:</span></span>
              <span className="font-medium">{formatDate(surat.tanggalSelesai)}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-40 flex justify-between">○ Tempat Tujuan <span>:</span></span>
              <span className="font-medium">{surat.tempat}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-40 flex justify-between">○ Keperluan <span>:</span></span>
              <span className="font-medium">{surat.perihal}</span>
            </div>
          </div>

          <p className="mt-8">
            Demikian Surat Tugas ini dibuat untuk dapat dipergunakan sebagaimana mestinya, Atas kerjasamanya yang baik kami ucapkan terima kasih.
          </p>
        </div>

        {/* Signatures */}
        <div className="mt-20 grid grid-cols-2 gap-20 text-center">
          <div>
            <p className="mb-20 font-bold">Pelaksana Tugas,</p>
            <div className="relative inline-block">
              {/* Mock Signature */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-16 border-b-2 rotate-[-5deg] opacity-20" style={{ borderColor: '#0f172a' }} />
              <p className="font-bold underline">{surat.pegawaiNames[0]}</p>
            </div>
          </div>
          <div>
            <p className="mb-20 font-bold">Pemberi Tugas,</p>
            <div className="relative inline-block">
              {/* Mock Signature */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-16 border-b-2 rotate-[5deg] opacity-20" style={{ borderColor: '#0f172a' }} />
              <p className="font-bold underline">{surat.approverName || '..........................'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SuratTugasPrint.displayName = 'SuratTugasPrint';
