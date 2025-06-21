import AdminLayout from '@/pages/admin/index';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';


export default function Dashboard() {
  const [admins, setAdmin] = useState<any>(0);
  const [mobil, setMobil] = useState<any>(0);
  const [testi, setTesti] = useState<any>(0);
  const [type, setType] = useState<any>(0);


  useEffect(() => {
    fetchAdmin()
    fetchMobil()
    fetchTesti()
    fetchType()
  }, []);

  const fetchAdmin = async () => {
    const { count, error: countError } = await supabase
      .from('admins')
      .select('*', { count: 'exact', head: true });
    if (count) {
      setAdmin(count);
    }
  };

  const fetchMobil = async () => {
    const { count, error: countError } = await supabase.from('cars')
      .select('*', { count: 'exact', head: true });
    if (count) {
      setMobil(count);
    }
  };

  const fetchTesti = async () => {
    const { count, error: countError } = await supabase.from('testimonials')
      .select('*', { count: 'exact', head: true });
    if (count) {
      setTesti(count);
    }
  };

  const fetchType = async () => {
    const { count, error: countError } = await supabase.from('cars_type')
      .select('*', { count: 'exact', head: true });
    if (count) {
      setType(count);
    }
  };


  return (
    <AdminLayout>

      <div className='w-full min-h-min grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='p-0 md:py-7'>
          <div className='bg-yellow-300 w-full h-full rounded-lg'>
            <div className='w-full h-full flex flex-col p-3'>
              <h2>Data User</h2>
              <div className='w-full grid place-items-center h-25'>
                <h4 className='text-3xl font-bold'>{admins}</h4>
              </div>
              <div className='w-full flex flex-col items-end h-min pr-3'>
                <h4 className='text-xl font-bold'>User</h4>
              </div>
            </div>
          </div>
        </div>
        <div className='p-0 md:py-7'>

          <div className='bg-red-500 w-full h-full rounded-lg'>
            <div className='w-full h-full flex flex-col p-3'>
              <h2 className='text-white'>Data Mobil</h2>
              <div className='w-full grid place-items-center h-25'>
                <h4 className='text-3xl font-bold text-white'>{mobil}</h4>
              </div>
              <div className='w-full flex flex-col items-end h-min pr-3'>
                <h4 className='text-xl font-bold text-white'>Mobil</h4>
              </div>
            </div>
          </div>

        </div>
        <div className='p-0 md:py-7'>

          <div className='bg-blue-500 w-full h-full rounded-lg'>
            <div className='w-full h-full flex flex-col p-3'>
              <h2>Data Testimoni</h2>
              <div className='w-full grid place-items-center h-25'>
                <h4 className='text-3xl font-bold'>{testi}</h4>
              </div>
              <div className='w-full flex flex-col items-end h-min pr-3'>
                <h4 className='text-xl font-bold'>Testi</h4>
              </div>
            </div>
          </div>

        </div>
        <div className='p-0 md:py-7'>

          <div className='bg-rose-500 w-full h-full rounded-lg'>
            <div className='w-full h-full flex flex-col p-3'>
              <h2 className='text-white'>Data Tipe Mobil</h2>
              <div className='w-full grid place-items-center h-25'>
                <h4 className='text-3xl font-bold text-white'>{type}</h4>
              </div>
              <div className='w-full flex flex-col items-end h-min pr-3'>
                <h4 className='text-xl font-bold text-white'>Tipe</h4>
              </div>
            </div>
          </div>

        </div>

      </div>
      <div className='w-full h-150 flex flex-col relative bg-white rounded-lg border border-gray-300 p-5'>
        <p>Selamat Datang di Dashboard Admin !</p>
        <div className='absolute bottom-5 right-5 flex flex-row items-end gap-7'>

          <img
            src="../Z23b.gif"
            alt="profil"
            className=" w-40 h-40"
          />
        </div>

      </div>

    </AdminLayout>
  );
}

