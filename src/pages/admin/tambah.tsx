import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';

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
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errData = await res.json();
        alert('Upload gagal: ' + (errData.message || 'Unknown error'));
        setUploading(false);
        return;
      }

      const data = await res.json();
      setForm(prev => ({ ...prev, image: data.fileUrl }));
    } catch (error) {
      alert('Upload gagal');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.original_price || !form.promo_price || !form.description) {
      alert('Harap lengkapi semua field');
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

    // Jika sukses, redirect ke list mobil
    router.push('/admin/cars');
  };

  if (!isClient) return null; // mencegah SSR hydration error

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
          <img src={form.image} alt="Preview" style={{ maxWidth: 300 }} />
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
