/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SuratTugas, UserProfile } from '@/types';
import logo1 from '../assets/logo1.png';
import logo2 from '../assets/logo2.png';

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
          fontFamily: '"Times New Roman", Times, serif', 
          width: '210mm', 
          minHeight: '297mm', 
          margin: '0 auto', 
          backgroundColor: '#ffffff', 
          color: '#000000',
          boxSizing: 'border-box'
        }}
      >
        {/* Header Block */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', paddingBottom: '16px', marginBottom: '24px', borderBottom: '1.5px solid #000' }}>
          <img 
            src={logo1}
            alt="Logo BSM" 
            crossOrigin="anonymous"
            loading="eager"
            style={{ width: '120px', height: 'auto', objectFit: 'contain', display: 'block' }} 
          />
          <div style={{ flex: 1, textAlign: 'center', padding: '0 16px' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: 0, fontFamily: '"Times New Roman", Times, serif' }}>
              PT BERKARYA SINERGI MANDIRI
            </h1>
            <p style={{ fontSize: '13px', fontStyle: 'italic', margin: '4px 0 0 0', fontFamily: '"Times New Roman", Times, serif' }}>
              Vivo Business Park Blok I No. 17 Jl. Pembangunan 3, Neglasari, Kota Tangerang Prov. Banten
            </p>
          </div>
          <img 
            src={logo2}
            alt="Logo ADS" 
            crossOrigin="anonymous"
            loading="eager"
            style={{ width: '100px', height: 'auto', objectFit: 'contain', display: 'block' }} 
          />
        </div>

        {/* Title Block */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0', textDecoration: 'underline' }}>SURAT TUGAS</h2>
          <p style={{ fontSize: '14px', margin: 0, fontWeight: 'bold' }}>No. : {surat.nomorSurat}</p>
        </div>

        {/* Body */}
        <div style={{ fontSize: '15px', lineHeight: '1.625' }}>
          <p style={{ marginBottom: '24px' }}>Dengan ini kami menugaskan untuk melakukan Perjalanan/Tugas Dinas kepada :</p>

          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #7ea1d4', textAlign: 'center', fontSize: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff' }}>
                <th style={{ border: '1px solid #7ea1d4', padding: '4px 8px', fontWeight: 'bold', width: '25%' }}>Nama</th>
                <th style={{ border: '1px solid #7ea1d4', padding: '4px 8px', fontWeight: 'bold', width: '25%' }}>NIK</th>
                <th style={{ border: '1px solid #7ea1d4', padding: '4px 8px', fontWeight: 'bold', width: '25%' }}>Jabatan</th>
                <th style={{ border: '1px solid #7ea1d4', padding: '4px 8px', fontWeight: 'bold', width: '25%' }}>Departement</th>
              </tr>
            </thead>
            <tbody>
              {surat.pegawaiIds.map((id) => {
                const p = pegawaiDetails.find((peg) => peg.uid === id);
                return (
                  <tr key={id}>
                    <td style={{ border: '1px solid #7ea1d4', padding: '4px 8px' }}>{p?.displayName || '-'}</td>
                    <td style={{ border: '1px solid #7ea1d4', padding: '4px 8px' }}>{p?.nik || '-'}</td>
                    <td style={{ border: '1px solid #7ea1d4', padding: '4px 8px' }}>{p?.position || '-'}</td>
                    <td style={{ border: '1px solid #7ea1d4', padding: '4px 8px' }}>{p?.department || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ margin: '32px 40px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ width: '160px', display: 'flex', justifyContent: 'space-between' }}>o Tanggal Berangkat <span>:</span></span>
              <span>{formatDate(surat.tanggalMulai)}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ width: '160px', display: 'flex', justifyContent: 'space-between' }}>o Tanggal Kembali <span>:</span></span>
              <span>{formatDate(surat.tanggalSelesai)}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ width: '160px', display: 'flex', justifyContent: 'space-between' }}>o Tempat Tujuan <span>:</span></span>
              <span>{surat.tempat}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ width: '160px', display: 'flex', justifyContent: 'space-between' }}>o Keperluan <span>:</span></span>
              <span style={{ maxWidth: '400px' }}>{surat.perihal}</span>
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
