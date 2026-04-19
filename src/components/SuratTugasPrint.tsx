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
      <div ref={ref} className="p-12 font-sans w-[210mm] min-h-[297mm] mx-auto shadow-lg print:shadow-none" style={{ backgroundColor: '#ffffff', color: '#000000' }}>
        {/* Header */}
        <div className="text-center pt-8 pb-4 mb-4">
          <h1 className="text-2xl font-bold tracking-tight inline-block border-b-2 border-black pb-1 mb-2">
            PT BERKARYA SINERGI MANDIRI
          </h1>
          <h2 className="text-xl font-bold mb-4">SURAT TUGAS</h2>
          <p className="text-sm font-bold">No. : {surat.nomorSurat}</p>
        </div>

        {/* Title / removed old title section to combine with header */}

        {/* Body */}
        <div className="space-y-6 text-sm leading-relaxed">
          <p>Dengan ini kami menugaskan untuk melakukan Perjalanan/Tugas Dinas kepada :</p>

          <table className="w-full border-collapse border border-black text-center text-sm" style={{ borderColor: '#000000' }}>
            <thead>
              <tr>
                <th className="border border-black py-1 px-4 font-bold w-1/4" style={{ borderColor: '#000000' }}>Nama</th>
                <th className="border border-black py-1 px-4 font-bold w-1/4" style={{ borderColor: '#000000' }}>NIK</th>
                <th className="border border-black py-1 px-4 font-bold w-1/4" style={{ borderColor: '#000000' }}>Jabatan</th>
                <th className="border border-black py-1 px-4 font-bold w-1/4" style={{ borderColor: '#000000' }}>Departement</th>
              </tr>
            </thead>
            <tbody>
              {surat.pegawaiIds.map((id) => {
                const p = pegawaiDetails.find((peg) => peg.uid === id);
                return (
                  <tr key={id}>
                    <td className="border border-black py-1 px-4" style={{ borderColor: '#000000' }}>{p?.displayName || '-'}</td>
                    <td className="border border-black py-1 px-4" style={{ borderColor: '#000000' }}>{p?.nik || '-'}</td>
                    <td className="border border-black py-1 px-4" style={{ borderColor: '#000000' }}>{p?.position || '-'}</td>
                    <td className="border border-black py-1 px-4" style={{ borderColor: '#000000' }}>{p?.department || '-'}</td>
                  </tr>
                );
              })}
              {/* Fill empty rows if needed to match template */}
              {[...Array(Math.max(0, 4 - surat.pegawaiIds.length))].map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="border border-black py-1 px-4 h-6" style={{ borderColor: '#000000' }}></td>
                  <td className="border border-black py-1 px-4 h-6" style={{ borderColor: '#000000' }}></td>
                  <td className="border border-black py-1 px-4 h-6" style={{ borderColor: '#000000' }}></td>
                  <td className="border border-black py-1 px-4 h-6" style={{ borderColor: '#000000' }}></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-1 mx-20 mt-8">
            <div className="flex gap-4">
              <span className="w-36 flex justify-between">○ Tanggal Berangkat <span>:</span></span>
              <span>{formatDate(surat.tanggalMulai)}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-36 flex justify-between">○ Tanggal Kembali <span>:</span></span>
              <span>{formatDate(surat.tanggalSelesai)}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-36 flex justify-between">○ Tempat Tujuan <span>:</span></span>
              <span>{surat.tempat}</span>
            </div>
            <div className="flex gap-4">
              <span className="w-36 flex justify-between">○ Keperluan <span>:</span></span>
              <span className="max-w-[300px]">{surat.perihal}</span>
            </div>
          </div>

          <p className="mt-8">
            Demikian Surat Tugas ini dibuat untuk dapat dipergunakan sebagaimana mestinya, Atas kerjasamanya yang baik kami ucapkan terima kasih.
          </p>
        </div>

        {/* Signatures */}
        <div className="mt-24 flex justify-end">
          <div className="text-center w-64">
            <p className="mb-24">Pemberi Tugas,</p>
            <div>
              <p className="font-medium">{surat.approverName || 'Apriadi Firmansyah'}</p>
              <p>Branch Manager</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SuratTugasPrint.displayName = 'SuratTugasPrint';
