import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function EditCar() {
  const [form, setForm] = useState({
    name: '',
    original_price: '',
    promo_price: '',
    image: '',
    description: ''
  });
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.from('cars').update({
      ...form,
      original_price: Number(form.original_price),
      promo_price: Number(form.promo_price),
      updated_at: new Date()
    }).eq('id', id);
    if (!error) router.push('/admin/cars');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Mobil</h1>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="original_price" value={form.original_price} onChange={handleChange} />
      <input name="promo_price" value={form.promo_price} onChange={handleChange} />
      <input name="image" value={form.image} onChange={handleChange} />
      <textarea name="description" value={form.description} onChange={handleChange} />
      <button type="submit">Update</button>
    </form>
  );
}
