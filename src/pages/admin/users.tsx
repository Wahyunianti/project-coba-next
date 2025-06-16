import AdminLayout from '@/pages/admin/index';
import { useState, useEffect } from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import imageCompression from 'browser-image-compression';
import ModalSuccess from '@/components/ModalSuccess';
import ModalTambah from '@/components/ModalTambah';
import ModalConfirm from '@/components/ModalConfirm';
import { RiEdit2Fill } from "react-icons/ri";
import { RiDeleteBin5Fill } from "react-icons/ri";

export default function Users() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adminns, setAdmin] = useState<any[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [delId, setDelId] = useState<number | null>(null);

  useEffect(() => {
    fetchAdmin();
    if (!showModal) {
      setForm({
        username: '',
        password: '',
        profil: '',
        address: '',
        phone: '',
        imagePath: '',
      });
      setIsEdit(false);
      setEditId(null);
    }
  }, [showModal]);

  const fetchAdmin = async () => {
    const { data, error } = await supabase.from('admins').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setAdmin(data);
      setLoading(false);
    }
  };

  const [form, setForm] = useState({
    username: '',
    password: '',
    profil: '',
    address: '',
    phone: '',
    imagePath: '',
  });

  const showSuccessModal = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setForm({
        username: '',
        password: '',
        profil: '',
        address: '',
        phone: '',
        imagePath: '',
      });
      fetchAdmin();
    }, 2000);
  };

  const handleEdit = (user: any) => {
    setForm({
      username: user.username,
      password: '',
      profil: user.profil,
      address: user.address,
      phone: user.phone,
      imagePath: '',
    });
    setEditId(user.id);
    setIsEdit(true);
    setShowModal(true);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submitUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.username || !form.address || !form.phone || (!isEdit && !form.password) || !form.profil) {
      alert('Harap lengkapi semua field termasuk gambar');
      return;
    }

    let hashedPassword = '';
    if (!!form.password) {
      hashedPassword = await bcrypt.hash(form.password, 10);
    }

    const payload = {
      username: form.username,
      profil: form.profil,
      address: form.address,
      phone: form.phone,
      password: hashedPassword
    };

    let error;
    if (isEdit && editId) {
      ({ error } = await supabase.from('admins').update(payload).eq('id', editId));
    } else {
      ({ error } = await supabase.from('admins').insert([payload]));
    }

    if (error) {
      alert('Gagal menyimpan data: ' + error.message);
      return;
    }

    setShowModal(false);
    showSuccessModal();
    setIsEdit(false);
    setEditId(null);
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

  const handleDelete = async () => {
    const { error } = await supabase.from('admins').delete().eq('id', delId);
    if (error) {
      alert('Gagal menghapus user: ' + error.message);
      return;
    }
    setShowConfirm(false)
    fetchAdmin();
  };

  return (
    <AdminLayout>
      <div className='flex flex-row items-center justify-between mb-5'>
        <h1 className='text-xl font-semibold'>Kelola Data User</h1>
        <button className='button-primary flex flex-row items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
          onClick={() => setShowModal(true)}
        >Tambah User <span><IoMdAddCircleOutline className='w-5 h-5' /></span></button>
      </div>
      <div className='w-full h-auto flex flex-col relative bg-white rounded-lg border border-gray-300 p-5 py-10'>
        <div className={`block w-full overflow-x-auto scrollbar-hide ${loading ? 'border-none' : 'border-x'} border-black`}>
          {loading ?
            <div className='flex flex-row gap-3 items-center justify-center w-full h-100'>
              <p className='text-center text-gray-500'>Loading...
              </p>
              <svg className="mr-3 -ml-1 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" ></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            </div>
            : <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="px-4 py-2 border-y">#</th>
                  <th className="px-4 py-2 border">Profil</th>
                  <th className="px-4 py-2 border">Nama</th>
                  <th className="px-4 py-2 border">Alamat</th>
                  <th className="px-4 py-2 border">Nomor</th>
                  <th className="px-4 py-2 border-y">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {adminns.map((user: any, index) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-y">{index + 1}</td>
                    <td className="p-2 border">
                      {user.profil ?
                        <div className='grid place-items-center w-full h-full'>
                          <img
                            src={user.profil}
                            alt="Preview"
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 50, border: 'solid', padding: 2, borderWidth: 2, display: 'block' }}
                          />
                        </div>
                        : '-'
                      }

                    </td>
                    <td className="px-4 py-2 border">{user.username}</td>
                    <td className="px-4 py-2 border">{user.address}</td>
                    <td className="px-4 py-2 border">{user?.phone ?? '-'}</td>
                    <td className="px-4 py-2 border-y">
                      <div className=' h-full w-full flex flex-row items-center justify-center gap-3'>
                        <button className="text-blue-500 hover:underline mr-3 cursor-pointer"
                          onClick={() => handleEdit(user)}
                        ><RiEdit2Fill className='w-5 h-5 text-black' /></button>
                        <button
                          onClick={() => { setDelId(user.id); setShowConfirm(true) }}
                          className="text-red-500 hover:underline cursor-pointer"><RiDeleteBin5Fill className='w-5 h-5 text-black' /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          {!loading && adminns.length === 0 && <p className='text-center text-gray-500'>Tidak ada data user</p>}

        </div>
      </div>


      {/* Modal Tambah User  */}
      <ModalTambah show={showModal} onClose={() => setShowModal(false)} judul={isEdit ? "Edit User" : "Tambah User"}>
        <form onSubmit={submitUser} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              placeholder='Username'
              name="username"
              value={form.username}
              onChange={handleChange}
              className="input-text"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="text"
              placeholder='Password'
              name="password"
              value={form.password}
              onChange={handleChange}
              className="input-text"
              required={!isEdit}
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
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={form.profil}
                    alt="Preview"
                    style={{ maxWidth: 200, paddingInline: 20, borderRadius: 8, display: 'block' }}
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
          </div>
          <div>
            <label className="block mb-1 font-medium">Alamat</label>
            <input
              type="text"
              placeholder='Alamat'
              name="address"
              value={form.address}
              onChange={handleChange}
              className="input-text"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">No. Handphone</label>
            <input
              type="text"
              placeholder='Nomor'
              name="phone"
              value={form.phone}
              onChange={handleChange}
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
      </ModalTambah>

      {/* Modal Success  */}
      <ModalConfirm
        show={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={() => handleDelete()} />
      <ModalSuccess show={showSuccess} onClose={() => setShowSuccess(false)} message="Data Berhasil Disimpan!" />
    </AdminLayout>
  );
}

