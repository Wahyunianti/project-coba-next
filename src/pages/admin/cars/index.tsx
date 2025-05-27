import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';

export default function CarList() {
  const [cars, setCars] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    const { data, error } = await supabase.from('cars').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setCars(data);
    }
  };

  const handleDelete = async (id: number | string) => {
    if (!confirm('Yakin hapus mobil ini?')) return;
    await supabase.from('cars').delete().eq('id', id);
    fetchCars();
  };

  return (
    <div>
      <h1>Daftar Mobil</h1>
      <Link href="/admin/cars/add">+ Tambah Mobil</Link>
      <ul>
        {cars.map((car: any) => (
          <li key={car.id}>
            <img src={car.image} alt={car.name} width={100} />
            <div>
              <h3>{car.name}</h3>
              <p>Harga Asli: {car.original_price}</p>
              <p>Harga Promo: {car.promo_price}</p>
              <p>{car.description}</p>
              <Link href={`/admin/cars/edit/${car.id}`}>Edit</Link>
              <button onClick={() => handleDelete(car.id)}>Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const { req } = context;
//   const cookie = req.headers.cookie || '';

//   if (!cookie.includes('isLoggedIn=true')) {
//     return {
//       redirect: {
//         destination: '/admin/login',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// }
