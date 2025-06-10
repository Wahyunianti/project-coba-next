import AdminLayout from '@/pages/admin/index';
import { useState } from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { RiCloseCircleFill } from "react-icons/ri";
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import imageCompression from 'browser-image-compression';



export default function Users() {
  const [showModal, setShowModal] = useState(false);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    password: '',
    profil: '',
    address: '',
    phone: '',
    imagePath: '',
  });

  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profil, setProfil] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');


  const users = [
    { id: 1, nama: 'John Doe', email: 'john@example.com' },
    { id: 2, nama: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },
    { id: 3, nama: 'Alice Johnson', email: 'alice@example.com' },


  ];

  const handleTambahUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Tambah user:', { nama, email });
    setShowModal(false);
    setNama('');
    setEmail('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from('admins')
      .insert([{ username, password: hashedPassword }]);

    if (!error) {
      router.push('/admin/login');
    } else {
      console.error(error.message);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `cars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, compressedFile);

      if (uploadError) {
        alert('Upload gagal: ' + uploadError.message);
        return;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);

      setForm(prev => ({
        ...prev,
        profil: data.publicUrl,
        imagePath: filePath,
      }));
    } catch (error) {
      console.error(error);
      alert('Upload gagal');
    } finally {
      setUploading(false);
    }
  };

 const handleRemoveImage = async () => {
    if (!form.imagePath) {
      setForm(prev => ({ ...prev, profil: '', imagePath: '' }));
      return;
    }

    const { error } = await supabase.storage
      .from('images')
      .remove([form.imagePath]);

    if (error) {
      alert('Gagal menghapus gambar: ' + error.message);
      return;
    }

    setForm(prev => ({ ...prev, profil: '', imagePath: '' }));
  };

  return (
    <AdminLayout>
      <div className='flex flex-row items-center justify-between mb-5'>
        <h1 className='text-xl font-semibold'>Kelola Data User</h1>
        <button className='button-primary flex flex-row items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
          onClick={() => setShowModal(true)}
        >Tambah User <span><IoMdAddCircleOutline className='w-5 h-5' /></span></button>
      </div>
      <div className='w-full h-auto flex flex-col relative bg-white rounded-lg border border-gray-300 p-5'>
        <div className='block w-full overflow-x-scroll'>
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-yellow-100 text-left">
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Nama</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{user.nama}</td>
                  <td className="px-4 py-2 border">{user.email}</td>
                  <td className="px-4 py-2 border">
                    <button className="text-blue-500 hover:underline mr-3">Edit</button>
                    <button className="text-red-500 hover:underline">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${showModal ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className='fixed inset-0 bg-black opacity-30' onClick={() => setShowModal(false)}>
        </div>
        <div className=" p-6 w-full max-w-lg z-30 relative">
          <RiCloseCircleFill onClick={() => setShowModal(false)} className='w-8 h-8 absolute right-4 top-4 cursor-pointer' />
          <div className='w-full h-full shadow-lg bg-white p-5 rounded-lg transition'>
            <h2 className="text-lg font-bold mb-4">Tambah User</h2>
            <form onSubmit={handleTambahUser} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Username</label>
                <input
                  type="text"
                  placeholder='Username'
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="input-text"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="text"
                  placeholder='Password'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-text"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">Foto Profil</label>

                <div className="relative flex items-center px-7 py-3 justify-center w-full min-h-32 h-min border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                        {form.profil ? (
        <div style={{ position: 'relative', display: 'inline-block'}}>
          <img
            src={form.profil}
            alt="Preview"
            style={{ maxWidth: 300, paddingInline: 20, borderRadius: 8, display: 'block' }}
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            style={{
              position: 'absolute',
              top: -10,
              right: 5,
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: 24,
              height: 24,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </div>
      ) : uploading ? (<><p>Loading...</p></>) : (<><p>Klik untuk mengunggah gambar</p></>)}

                </div>

                {fileName && (
                  <p className="mt-2 text-sm text-green-600 font-medium">✅ {fileName}</p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">Alamat</label>
                <input
                  type="text"
                  placeholder='Alamat'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-text"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">No. Handphone</label>
                <input
                  type="text"
                  placeholder='Nomor'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-text"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="button-primary"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

