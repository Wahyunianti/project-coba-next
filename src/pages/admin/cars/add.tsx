import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import imageCompression from 'browser-image-compression'; // <-- Import kompresor

export default function AddCar() {
  const [isClient, setIsClient] = useState(false);
  const [form, setForm] = useState({
    name: '',
    original_price: '',
    promo_price: '',
    image: '',
    description: '',
  });
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      // Kompresi gambar
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      });

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `cars/${fileName}`; // Folder di bucket Supabase

      const { error: uploadError } = await supabase.storage
        .from('images') // Ganti dengan nama bucket kamu
        .upload(filePath, compressedFile);

      if (uploadError) {
        alert('Upload gagal: ' + uploadError.message);
        return;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      setForm(prev => ({ ...prev, image: data.publicUrl }));
    } catch (error) {
      console.error(error);
      alert('Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.original_price || !form.promo_price || !form.description || !form.image) {
      alert('Harap lengkapi semua field termasuk gambar');
      return;
    }

    const { error } = await supabase.from('cars').insert([
      {
        name: form.name,
        original_price: Number(form.original_price),
        promo_price: Number(form.promo_price),
        image: form.image,
        description: form.description,
      },
    ]);

    if (error) {
      alert('Gagal menyimpan data: ' + error.message);
      return;
    }

    router.push('/admin/cars');
  };

  if (!isClient) return null;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Tambah Mobil</h1>
      <input
        name="name"
        placeholder="Nama"
        value={form.name}
        onChange={handleChange}
        required
        style={{ display: 'block', marginBottom: 12, width: '100%', padding: 8 }}
      />
      <input
        name="original_price"
        placeholder="Harga Asli"
        type="number"
        value={form.original_price}
        onChange={handleChange}
        required
        style={{ display: 'block', marginBottom: 12, width: '100%', padding: 8 }}
      />
      <input
        name="promo_price"
        placeholder="Harga Promo"
        type="number"
        value={form.promo_price}
        onChange={handleChange}
        required
        style={{ display: 'block', marginBottom: 12, width: '100%', padding: 8 }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ display: 'block', marginBottom: 12 }}
      />
      {form.image && (
        <div style={{ marginBottom: 12 }}>
          <p>Preview:</p>
          <img src={form.image} alt="Preview" style={{ maxWidth: 300, borderRadius: 8 }} />
        </div>
      )}
      <textarea
        name="description"
        placeholder="Deskripsi"
        value={form.description}
        onChange={handleChange}
        required
        style={{ display: 'block', marginBottom: 12, width: '100%', padding: 8, height: 120 }}
      />
      <button type="submit" disabled={uploading} style={{ padding: '10px 20px' }}>
        {uploading ? 'Uploading...' : 'Simpan'}
      </button>
    </form>
  );
}
