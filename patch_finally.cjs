const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

code = code.replace(
`        // Also sign out the secondary auth so it doesn't leave a lingering session in that instance
        await secondaryAuth.signOut();
        
        toast.success('Pengguna berhasil ditambahkan');
        setIsAdding(false);
    } catch (e: any) {
        toast.error('Gagal menambah pengguna: ' + e.message);
    }`,
`        toast.success('Pengguna berhasil ditambahkan');
        setIsAdding(false);
    } catch (e: any) {
        toast.error('Gagal menambah pengguna: ' + e.message);
    } finally {
        if (secondaryAuth) {
           await secondaryAuth.signOut();
        }
    }`
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
