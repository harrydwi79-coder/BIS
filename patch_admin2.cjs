const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

const importSwitch = `import { Switch } from './ui/switch';\n`;
if (!code.includes('import { Switch }')) {
  code = code.replace("import { Label } from './ui/label';", "import { Label } from './ui/label';\n" + importSwitch);
}

const canApproveEditUI = `              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Otoritas Approval</Label>
                  <p className="text-sm text-slate-500">Izinkan pengguna ini menyetujui surat tugas</p>
                </div>
                <Switch 
                  checked={editingUser.canApprove || false} 
                  onCheckedChange={(c) => setEditingUser({...editingUser, canApprove: c})} 
                />
              </div>`;

code = code.replace("              <div className=\"space-y-2\">\n                <Label>Role</Label>", canApproveEditUI + "\n              <div className=\"space-y-2\">\n                <Label>Role</Label>");

const addDialog = `      {isAdding && (
        <Dialog open={isAdding} onOpenChange={(open) => !open && setIsAdding(false)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Pengguna Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={newUser.email || ''} onChange={(e) => setNewUser({...newUser, email: e.target.value})} placeholder="nama@perusahaan.com" />
              </div>
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={newUser.displayName || ''} onChange={(e) => setNewUser({...newUser, displayName: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Password Mock</Label>
                <Input type="password" value={newUser.plainPassword || ''} onChange={(e) => setNewUser({...newUser, plainPassword: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>NIK</Label>
                <Input value={newUser.nik || ''} onChange={(e) => setNewUser({...newUser, nik: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Jabatan</Label>
                <Input value={newUser.position || ''} onChange={(e) => setNewUser({...newUser, position: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Departemen</Label>
                <Input value={newUser.department || ''} onChange={(e) => setNewUser({...newUser, department: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newUser.role || 'PEGAWAI'} onValueChange={(v: any) => setNewUser({...newUser, role: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PEGAWAI">PEGAWAI</SelectItem>
                        <SelectItem value="ATASAN">ATASAN</SelectItem>
                        <SelectItem value="ADMIN">ADMIN</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              <div className="flex flex-row items-center justify-between rounded-lg border p-4 mt-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Otoritas Approval</Label>
                  <p className="text-sm text-slate-500">Izinkan pengguna ini menyetujui surat tugas</p>
                </div>
                <Switch 
                  checked={newUser.canApprove || false} 
                  onCheckedChange={(c) => setNewUser({...newUser, canApprove: c})} 
                />
              </div>
            </div>
            <DialogFooter>
               <Button variant="outline" onClick={() => setIsAdding(false)}>Batal</Button>
               <Button onClick={handleAdd}>Tambah Pengguna</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}`;

code = code.replace("{editingUser && (", addDialog + "\n\n      {editingUser && (");

fs.writeFileSync('src/components/AdminPanel.tsx', code);
