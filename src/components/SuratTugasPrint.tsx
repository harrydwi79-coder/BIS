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
      <div 
        ref={ref} 
        style={{ 
          padding: '48px', 
          fontFamily: 'sans-serif', 
          width: '210mm', 
          minHeight: '297mm', 
          margin: '0 auto', 
          backgroundColor: '#ffffff', 
          color: '#000000',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', paddingTop: '32px', paddingBottom: '16px', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.025em', display: 'inline-block', borderBottom: '2px solid #000', paddingBottom: '4px', marginBottom: '8px', margin: 0 }}>
            PT BERKARYA SINERGI MANDIRI
          </h1>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', marginTop: '8px' }}>SURAT TUGAS</h2>
          <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>No. : {surat.nomorSurat}</p>
        </div>

        {/* Title / removed old title section to combine with header */}

        {/* Body */}
        <div style={{ fontSize: '14px', lineHeight: '1.625' }}>
          <p style={{ marginBottom: '24px' }}>Dengan ini kami menugaskan untuk melakukan Perjalanan/Tugas Dinas kepada :</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000', textAlign: 'center', fontSize: '14px', borderColor: '#000000' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #000000', padding: '4px 16px', fontWeight: 'bold', width: '25%', borderColor: '#000000' }}>Nama</th>
                <th style={{ border: '1px solid #000000', padding: '4px 16px', fontWeight: 'bold', width: '25%', borderColor: '#000000' }}>NIK</th>
                <th style={{ border: '1px solid #000000', padding: '4px 16px', fontWeight: 'bold', width: '25%', borderColor: '#000000' }}>Jabatan</th>
                <th style={{ border: '1px solid #000000', padding: '4px 16px', fontWeight: 'bold', width: '25%', borderColor: '#000000' }}>Departement</th>
              </tr>
            </thead>
            <tbody>
              {surat.pegawaiIds.map((id) => {
                const p = pegawaiDetails.find((peg) => peg.uid === id);
                return (
                  <tr key={id}>
                    <td style={{ border: '1px solid #000000', padding: '4px 16px', borderColor: '#000000' }}>{p?.displayName || '-'}</td>
                    <td style={{ border: '1px solid #000000', padding: '4px 16px', borderColor: '#000000' }}>{p?.nik || '-'}</td>
                    <td style={{ border: '1px solid #000000', padding: '4px 16px', borderColor: '#000000' }}>{p?.position || '-'}</td>
                    <td style={{ border: '1px solid #000000', padding: '4px 16px', borderColor: '#000000' }}>{p?.department || '-'}</td>
                  </tr>
                );
              })}
              {/* Fill empty rows if needed to match template */}
              {[...Array(Math.max(0, 4 - surat.pegawaiIds.length))].map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td style={{ border: '1px solid #000000', padding: '4px 16px', height: '24px', borderColor: '#000000' }}></td>
                  <td style={{ border: '1px solid #000000', padding: '4px 16px', height: '24px', borderColor: '#000000' }}></td>
                  <td style={{ border: '1px solid #000000', padding: '4px 16px', height: '24px', borderColor: '#000000' }}></td>
                  <td style={{ border: '1px solid #000000', padding: '4px 16px', height: '24px', borderColor: '#000000' }}></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ margin: '32px 80px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ width: '144px', display: 'flex', justifyContent: 'space-between' }}>○ Tanggal Berangkat <span>:</span></span>
              <span>{formatDate(surat.tanggalMulai)}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ width: '144px', display: 'flex', justifyContent: 'space-between' }}>○ Tanggal Kembali <span>:</span></span>
              <span>{formatDate(surat.tanggalSelesai)}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ width: '144px', display: 'flex', justifyContent: 'space-between' }}>○ Tempat Tujuan <span>:</span></span>
              <span>{surat.tempat}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ width: '144px', display: 'flex', justifyContent: 'space-between' }}>○ Keperluan <span>:</span></span>
              <span style={{ maxWidth: '300px' }}>{surat.perihal}</span>
            </div>
          </div>

          <p style={{ marginTop: '32px' }}>
            Demikian Surat Tugas ini dibuat untuk dapat dipergunakan sebagaimana mestinya, Atas kerjasamanya yang baik kami ucapkan terima kasih.
          </p>
        </div>

        {/* Signatures */}
        <div style={{ marginTop: '96px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ textAlign: 'center', width: '256px' }}>
            <p style={{ marginBottom: '96px', margin: 0 }}>Pemberi Tugas,</p>
            <div style={{ marginTop: '96px' }}>
              <p style={{ fontWeight: '500', margin: 0 }}>{surat.approverName || 'Apriadi Firmansyah'}</p>
              <p style={{ margin: 0 }}>Branch Manager</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SuratTugasPrint.displayName = 'SuratTugasPrint';
