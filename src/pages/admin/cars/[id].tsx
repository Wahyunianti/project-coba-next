import { supabase } from '@/lib/supabase';
import AdminLayout from '@/pages/admin/index';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function DetailCar() {
    const router = useRouter();
    const { id } = router.query;
    const [form, setForm] = useState({
        name: '',
        image: '',
    });
    const [img, setImage] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchCar();
            fetchImage();
        }
    }, [id]);

    const fetchCar = async () => {
        const { data, error } = await supabase.from('cars').select('*').eq('id', id).single();
        if (!error) setForm(data);
        if (data) setLoading(false);
    };

    const fetchImage = async () => {
        const { data, error } = await supabase.from('cars_image').select('*').eq('cars_id', id).order('id', { ascending: false });
        if (!error) setImage(data);
    };

    return (
        <AdminLayout>
            <div className='flex flex-row items-center justify-between mb-5'>
                <div className='flex flex-row gap-2 items-center'>
                    <Link
                        href={`/admin/mobils`} className="button-primary flex flex-row items-center justify-center gap-3"
                        data-tooltip-id="my-tooltip" data-tooltip-content="Kembali"
                    >
                        <IoMdArrowRoundBack className='w-5 h-5 text-white'
                        />
                    </Link>

                    <h1 className='text-xl font-semibold'>Data Variant</h1>
                </div>
                <button className='button-primary flex flex-row items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
                >Tambah Variant Mobil <span><IoMdAddCircleOutline className='w-5 h-5' /></span></button>
            </div>
            <div className='w-full h-auto relative bg-white rounded-lg border border-gray-300'>
                {loading ? <div className='flex flex-row gap-3 items-center justify-center w-full h-100'>
                    <p className='text-center text-gray-500'>Loading...
                    </p>
                    <svg className="mr-3 -ml-1 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" ></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
                    :
                    <div className='w-full h-auto flex flex-row relative  p-5'>
                        <div className='w-1/2 flex flex-row gap-3'>

                            <div className='w-full flex flex-col'>
                                <img
                                    src={form.image}
                                    alt="profil"
                                    className="object-contain size-full "
                                    data-tooltip-id="my-tooltip" data-tooltip-content="Gambar Mobil"
                                />
                            </div>
                            <div className='w-full flex flex-col'>
                                <h1>Mercedes Bens</h1>
                                <h2>Rp. 20.000.000</h2>

                            </div>
                        </div>
                        <div className='w-1/2 flex flex-row gap-3'>
                            <div className='w-full flex flex-row flex-wrap items-center gap-2'>
                                {img.map((image: any, index) => (
                                    <div className='relative size-auto icon-cars'>
                                        <div className='close-button absolute right-0 top-0 bg-white rounded-full'>
                                            <IoCloseCircleOutline className='size-7 hover:size-8 transition-all cursor-pointer' />
                                        </div>
                                        <div className='frame-cars size-34 grid place-items-center rounded-md m-3'>
                                            <img
                                                src={image.image ?? 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'}
                                                alt="profil"
                                                className="object-contain size-full w-32 h-32 cursor-pointer"
                                                data-tooltip-id="my-tooltip" data-tooltip-content="Lihat Preview"
                                            />
                                        </div>
                                    </div>
                                ))}
                                {img.length > 0 &&
                                    <IoMdAddCircleOutline className='size-14 cursor-pointer hover:size-15 transition-all' />
                                }
                            </div>
                        </div>
                    </div>
                }

            </div>
        </AdminLayout>
    );
}
