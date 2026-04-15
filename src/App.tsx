/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc,
  getDoc,
  setDoc,
  where
} from 'firebase/firestore';
import { auth, db } from './firebase';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SuratTugasList from './components/SuratTugasList';
import SuratTugasForm from './components/SuratTugasForm';
import SuratTugasDetail from './components/SuratTugasDetail';
import PegawaiList from './components/PegawaiList';
import { UserProfile, SuratTugas, AppState } from './types';

// Mock Data for Initial UI
const MOCK_USER: UserProfile = {
  uid: 'admin123',
  displayName: 'Budi Santoso',
  email: 'budi@perusahaan.com',
  role: 'ADMIN',
  position: 'Manager Operasional',
  department: 'Operasional',
  createdAt: Date.now(),
};

const MOCK_PEGAWAI: UserProfile[] = [
  MOCK_USER,
  { uid: 'u2', displayName: 'Siti Aminah', email: 'siti@perusahaan.com', role: 'PEGAWAI', position: 'Staff Admin', department: 'HRD', createdAt: Date.now() },
  { uid: 'u3', displayName: 'Andi Wijaya', email: 'andi@perusahaan.com', role: 'ATASAN', position: 'Head of IT', department: 'IT', createdAt: Date.now() },
  { uid: 'u4', displayName: 'Rina Kartika', email: 'rina@perusahaan.com', role: 'PEGAWAI', position: 'Software Engineer', department: 'IT', createdAt: Date.now() },
  { uid: 'admin-bos', displayName: 'Bos Besak', email: 'bosbesak@perusahaan.com', role: 'ADMIN', position: 'Direktur Utama', department: 'Direksi', createdAt: Date.now() },
];

const MOCK_SURAT: SuratTugas[] = [
  {
    id: 'st1',
    nomorSurat: '001/ST/IT/2024',
    perihal: 'Instalasi Server Cabang Bandung',
    deskripsi: 'Melakukan instalasi dan konfigurasi server baru di kantor cabang Bandung untuk mendukung sistem ERP baru.',
    tanggalMulai: '2024-05-20',
    tanggalSelesai: '2024-05-22',
    tempat: 'Bandung, Jawa Barat',
    pegawaiIds: ['u4'],
    pegawaiNames: ['Rina Kartika'],
    pembuatId: 'u3',
    pembuatName: 'Andi Wijaya',
    status: 'APPROVED',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
    history: [
      { id: 'h1', action: 'Dibuat', userId: 'u3', userName: 'Andi Wijaya', timestamp: Date.now() - 86400000 * 2 },
      { id: 'h2', action: 'Disetujui', userId: 'admin123', userName: 'Budi Santoso', timestamp: Date.now() - 86400000 * 1.5 },
    ]
  },
  {
    id: 'st2',
    nomorSurat: '002/ST/OPS/2024',
    perihal: 'Audit Tahunan Gudang Jakarta',
    deskripsi: 'Melakukan audit stok fisik dan verifikasi dokumen pengiriman di gudang utama Jakarta.',
    tanggalMulai: '2024-05-25',
    tanggalSelesai: '2024-05-27',
    tempat: 'Jakarta Utara',
    pegawaiIds: ['u2', 'u4'],
    pegawaiNames: ['Siti Aminah', 'Rina Kartika'],
    pembuatId: 'admin123',
    pembuatName: 'Budi Santoso',
    status: 'PENDING',
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 5,
    history: [
      { id: 'h3', action: 'Dibuat', userId: 'admin123', userName: 'Budi Santoso', timestamp: Date.now() - 3600000 * 5 },
    ]
  }
];

export default function App() {
  const [state, setState] = React.useState<AppState>({
    user: null,
    loading: true,
    isAuthReady: false,
  });

  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [suratTugas, setSuratTugas] = React.useState<SuratTugas[]>([]);
  const [allPegawai, setAllPegawai] = React.useState<UserProfile[]>([]);
  const [viewingSuratId, setViewingSuratId] = React.useState<string | null>(null);
  const [editingSuratId, setEditingSuratId] = React.useState<string | null>(null);

  // Auth Listener
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setState({
              user: userDoc.data() as UserProfile,
              loading: false,
              isAuthReady: true,
            });
          } else {
            // If user exists in Auth but not in Firestore (e.g. first time)
            // This shouldn't happen with the current flow but good to handle
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'User',
              email: firebaseUser.email || '',
              role: 'PEGAWAI',
              position: 'Pegawai',
              department: 'Umum',
              createdAt: Date.now(),
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
            setState({
              user: newUser,
              loading: false,
              isAuthReady: true,
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setState({ user: null, loading: false, isAuthReady: true });
        }
      } else {
        setState({ user: null, loading: false, isAuthReady: true });
      }
    });

    return () => unsubscribe();
  }, []);

  // Firestore Listeners
  React.useEffect(() => {
    if (!state.user) return;

    // Listen to Surat Tugas
    let suratQuery = query(collection(db, 'surat_tugas'), orderBy('createdAt', 'desc'));
    
    // If not ADMIN/ATASAN, only see their own or where they are assigned
    if (state.user.role === 'PEGAWAI') {
      // Note: Firestore doesn't support array-contains for multiple values easily in a single query with other filters
      // For simplicity in this demo, we'll fetch all and filter client-side if needed, 
      // or just fetch all if security rules allow.
      // Real app would use better indexing.
    }

    const unsubscribeSurat = onSnapshot(suratQuery, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SuratTugas));
      setSuratTugas(docs);
    });

    // Listen to Pegawai (only for ADMIN)
    let unsubscribePegawai = () => {};
    if (state.user.role === 'ADMIN') {
      const pegawaiQuery = query(collection(db, 'users'), orderBy('displayName', 'asc'));
      unsubscribePegawai = onSnapshot(pegawaiQuery, (snapshot) => {
        const docs = snapshot.docs.map(doc => doc.data() as UserProfile);
        setAllPegawai(docs);
      });
    } else {
      // Still need all pegawai for the form if ATASAN
      const pegawaiQuery = query(collection(db, 'users'), orderBy('displayName', 'asc'));
      unsubscribePegawai = onSnapshot(pegawaiQuery, (snapshot) => {
        const docs = snapshot.docs.map(doc => doc.data() as UserProfile);
        setAllPegawai(docs);
      });
    }

    return () => {
      unsubscribeSurat();
      unsubscribePegawai();
    };
  }, [state.user]);

  const handleLogin = async (email: string, pass: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      toast.error('Login gagal: ' + error.message);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info('Anda telah keluar dari sistem');
    } catch (error: any) {
      toast.error('Logout gagal');
    }
  };

  const handleCreateSurat = async (data: any) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const newSuratData = {
        ...data,
        pembuatId: state.user?.uid || '',
        pembuatName: state.user?.displayName || '',
        status: 'PENDING',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        history: [
          { 
            id: Math.random().toString(36).substr(2, 9), 
            action: 'Dibuat', 
            userId: state.user?.uid || '', 
            userName: state.user?.displayName || '', 
            timestamp: Date.now() 
          }
        ]
      };
      await addDoc(collection(db, 'surat_tugas'), newSuratData);
      setState(prev => ({ ...prev, loading: false }));
      setActiveTab('histori');
      toast.success('Surat tugas berhasil dibuat dan menunggu persetujuan');
    } catch (error: any) {
      toast.error('Gagal membuat surat: ' + error.message);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleUpdateSurat = async (data: any) => {
    if (!editingSuratId) return;
    setState(prev => ({ ...prev, loading: true }));
    try {
      const suratRef = doc(db, 'surat_tugas', editingSuratId);
      const currentSurat = suratTugas.find(s => s.id === editingSuratId);
      
      await updateDoc(suratRef, {
        ...data,
        updatedAt: Date.now(),
        history: [
          ...(currentSurat?.history || []),
          {
            id: Math.random().toString(36).substr(2, 9),
            action: 'Diperbarui',
            userId: state.user?.uid || '',
            userName: state.user?.displayName || '',
            timestamp: Date.now()
          }
        ]
      });
      setState(prev => ({ ...prev, loading: false }));
      setEditingSuratId(null);
      toast.success('Surat tugas berhasil diperbarui');
    } catch (error: any) {
      toast.error('Gagal memperbarui surat: ' + error.message);
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const suratRef = doc(db, 'surat_tugas', id);
      const currentSurat = suratTugas.find(s => s.id === id);
      await updateDoc(suratRef, {
        status: 'APPROVED',
        history: [
          ...(currentSurat?.history || []),
          {
            id: Math.random().toString(36).substr(2, 9),
            action: 'Disetujui',
            userId: state.user?.uid || '',
            userName: state.user?.displayName || '',
            timestamp: Date.now()
          }
        ]
      });
      toast.success('Surat tugas telah disetujui');
    } catch (error: any) {
      toast.error('Gagal menyetujui surat');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const suratRef = doc(db, 'surat_tugas', id);
      const currentSurat = suratTugas.find(s => s.id === id);
      await updateDoc(suratRef, {
        status: 'REJECTED',
        history: [
          ...(currentSurat?.history || []),
          {
            id: Math.random().toString(36).substr(2, 9),
            action: 'Ditolak',
            userId: state.user?.uid || '',
            userName: state.user?.displayName || '',
            timestamp: Date.now()
          }
        ]
      });
      toast.error('Surat tugas telah ditolak');
    } catch (error: any) {
      toast.error('Gagal menolak surat');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus surat tugas ini?')) {
      try {
        await deleteDoc(doc(db, 'surat_tugas', id));
        toast.success('Surat tugas berhasil dihapus');
      } catch (error: any) {
        toast.error('Gagal menghapus surat');
      }
    }
  };

  if (!state.isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Menyiapkan aplikasi...</p>
        </div>
      </div>
    );
  }

  if (!state.user) {
    return (
      <>
        <Login onLogin={handleLogin} loading={state.loading} />
        <Toaster position="top-center" />
      </>
    );
  }

  const renderContent = () => {
    if (viewingSuratId) {
      const surat = suratTugas.find(s => s.id === viewingSuratId);
      if (!surat) return null;
      return (
        <SuratTugasDetail 
          surat={surat} 
          user={state.user} 
          onBack={() => setViewingSuratId(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      );
    }

    if (editingSuratId) {
      const surat = suratTugas.find(s => s.id === editingSuratId);
      return (
        <SuratTugasForm 
          initialData={surat}
          onSubmit={handleUpdateSurat}
          onCancel={() => setEditingSuratId(null)}
          allPegawai={allPegawai}
          loading={state.loading}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            user={state.user} 
            suratTugas={suratTugas} 
            onNewSurat={() => setActiveTab('buat')}
            onViewSurat={setViewingSuratId}
          />
        );
      case 'buat':
        return (
          <SuratTugasForm 
            onSubmit={handleCreateSurat}
            onCancel={() => setActiveTab('dashboard')}
            allPegawai={allPegawai}
            loading={state.loading}
          />
        );
      case 'histori':
        return (
          <SuratTugasList 
            suratTugas={suratTugas} 
            user={state.user}
            onView={setViewingSuratId}
            onEdit={setEditingSuratId}
            onDelete={handleDelete}
          />
        );
      case 'pegawai':
        return (
          <PegawaiList 
            pegawai={allPegawai}
            onEdit={(uid) => toast.info(`Fitur edit pegawai ${uid} segera hadir`)}
            onAdd={() => toast.info('Fitur tambah pegawai segera hadir')}
          />
        );
      default:
        return <div className="p-8 text-center text-slate-500">Halaman sedang dalam pengembangan.</div>;
    }
  };

  return (
    <Layout 
      user={state.user} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={(tab) => {
        setActiveTab(tab);
        setViewingSuratId(null);
        setEditingSuratId(null);
      }}
    >
      {renderContent()}
      <Toaster position="top-right" richColors />
    </Layout>
  );
}
