const fs = require('fs');
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace('<AdminPanel users={allPegawai} />', '<AdminPanel users={allPegawai} currentUser={state.user} />');
fs.writeFileSync('src/App.tsx', appCode);

let adminCode = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');
if (!adminCode.includes('currentUser: UserProfile | null;')) {
  adminCode = adminCode.replace('interface AdminPanelProps {\n  users: UserProfile[];\n}', 'interface AdminPanelProps {\n  users: UserProfile[];\n  currentUser: UserProfile | null;\n}');
  adminCode = adminCode.replace('export default function AdminPanel({ users }: AdminPanelProps) {', 'export default function AdminPanel({ users, currentUser }: AdminPanelProps) {');
}

// Now replace the Add button to check currentUser
const oldAddButton = `<Button onClick={() => { setIsAdding(true); setNewUser({ role: 'PEGAWAI', canApprove: false, email: '', displayName: '', position: '', department: '' }); }} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengguna
        </Button>`;
const newAddButton = `{currentUser?.email === 'bosbesak@perusahaan.com' && (
        <Button onClick={() => { setIsAdding(true); setNewUser({ role: 'PEGAWAI', canApprove: false, email: '', displayName: '', position: '', department: '' }); }} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengguna
        </Button>
        )}`;
adminCode = adminCode.replace(oldAddButton, newAddButton);

// Also replace the Switch in edit dialog
const oldEditSwitch = `<div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Otoritas Approval</Label>
                  <p className="text-sm text-slate-500">Izinkan pengguna ini menyetujui surat tugas</p>
                </div>
                <Switch 
                  checked={editingUser.canApprove || false} 
                  onCheckedChange={(c) => setEditingUser({...editingUser, canApprove: c})} 
                />
              </div>`;
const newEditSwitch = `{currentUser?.email === 'bosbesak@perusahaan.com' && (
              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Otoritas Approval</Label>
                  <p className="text-sm text-slate-500">Izinkan pengguna ini menyetujui surat tugas</p>
                </div>
                <Switch 
                  checked={editingUser.canApprove || false} 
                  onCheckedChange={(c) => setEditingUser({...editingUser, canApprove: c})} 
                />
              </div>
              )}`;
adminCode = adminCode.replace(oldEditSwitch, newEditSwitch);

fs.writeFileSync('src/components/AdminPanel.tsx', adminCode);
