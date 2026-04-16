/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'ADMIN' | 'ATASAN' | 'PEGAWAI';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  nik?: string;
  role: UserRole;
  position: string;
  department: string;
  createdAt: number;
}

export type SuratTugasStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface SuratTugas {
  id: string;
  nomorSurat: string;
  perihal: string;
  deskripsi: string;
  tanggalMulai: string; // ISO Date
  tanggalSelesai: string; // ISO Date
  tempat: string;
  cabang?: string;
  departemen?: string;
  pegawaiIds: string[]; // List of UIDs
  pegawaiNames: string[]; // Denormalized for easy search
  pembuatId: string;
  pembuatName: string;
  approverId?: string;
  approverName?: string;
  status: SuratTugasStatus;
  createdAt: number;
  updatedAt: number;
  history: SuratTugasHistory[];
}

export interface SuratTugasHistory {
  id: string;
  action: string;
  userId: string;
  userName: string;
  timestamp: number;
  details?: string;
}

export interface AppState {
  user: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
}
