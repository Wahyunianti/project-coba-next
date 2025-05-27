import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import imageCompression from 'browser-image-compression';

export default function EditCar() {
  const [form, setForm] = useState({
    name: '',
    original_price: '',
    promo_price: '',
    image: '',
    description: ''
  });
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) fetchCar();
  }, [id]);

  const fetchCar = async () => {
    const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
    if (!error) setForm(data);
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files.length === 0) return;

  const file = e.target.files[0];
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `cars/${fileName}`;

  setUploading(true);

  try {
    // Kompresi gambar
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5, // Maks ukuran hasil kompresi (0.5 MB)
      maxWidthOrHeight: 1024, // Maks resolusi
      useWebWorker: true,
    });

    // Hapus gambar lama (optional)
    if (form.image) {
      const parts = form.image.split('/');
      const oldPath = parts.slice(parts.indexOf('images') + 1).join('/');
      await supabase.storage.from('images').remove([oldPath]);
    }

    // Upload hasil kompresi
    const { error: uploadError } = await supabase
      .storage
      .from('images')
      .upload(filePath, compressedFile);

    if (uploadError) {
      alert('Gagal upload gambar');
      console.error(uploadError);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from('images')
      .getPublicUrl(filePath);

    setForm(prev => ({
      ...prev,
      image: publicUrlData.publicUrl,
    }));

  } catch (err) {
    console.error('Gagal kompres gambar:', err);
    alert('Gagal kompres gambar.');
  }

  setUploading(false);
};


  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase.from('cars').update({
      ...form,
      original_price: Number(form.original_price),
      promo_price: Number(form.promo_price),
      updated_at: new Date()
    }).eq('id', id);

    if (!error) router.push('/admin/cars');
    else alert('Gagal update data: ' + error.message);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Edit Mobil</h1>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nama Mobil"
        required
        style={{ display: 'block', marginBottom: 12, width: '100%' }}
      />
      <input
        name="original_price"
        value={form.original_price}
        onChange={handleChange}
        type="number"
        placeholder="Harga Asli"
        required
        style={{ display: 'block', marginBottom: 12, width: '100%' }}
      />
      <input
        name="promo_price"
        value={form.promo_price}
        onChange={handleChange}
        type="number"
        placeholder="Harga Promo"
        required
        style={{ display: 'block', marginBottom: 12, width: '100%' }}
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
          <p>Preview Gambar:</p>
          <img src={form.image} alt="Preview" style={{ maxWidth: 300 }} />
        </div>
      )}

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Deskripsi"
        required
        style={{ display: 'block', marginBottom: 12, width: '100%', height: 120 }}
      />

      <button type="submit" disabled={uploading}>
        {uploading ? 'Mengunggah...' : 'Simpan Perubahan'}
      </button>
    </form>
  );
}
