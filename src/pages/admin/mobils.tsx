import AdminLayout from '@/pages/admin/index';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Utilities from '@/utilities/Utilities';
import { IoMdAddCircleOutline } from 'react-icons/io';
import imageCompression from 'browser-image-compression';
import ModalSuccess from '@/components/ModalSuccess';
import ModalTambah from '@/components/ModalTambah';
import ModalConfirm from '@/components/ModalConfirm';
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri';
import Link from 'next/link';
import { Service } from '@/utilities/service';
import { PhotoProvider, PhotoView } from 'react-photo-view';

export default function TMobils() {
    const [showModal, setShowModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cars, setCars] = useState<any[]>([]);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [delId, setDelId] = useState<number>(1);
    const [uploading, setUploading] = useState(false);
    const [imgId, setImgId] = useState<string>('');


    const util = new Utilities();
    const service = new Service();

    const [form, setForm] = useState({
        name: '',
        description: '',
        image: '',
        imagePath: '',
    });

    useEffect(() => {
        if (!showModal) {
            setForm({
                name: '',
                description: '',
                image: '',
                imagePath: '',
            });
        }
        fetchMobil();
    }, [showModal]);

    const fetchMobil = async () => {
        const { data, error } = await supabase.from('cars')
            .select(`
    id,
    name,
    description,
    image,
    cars_type (
      id,
      name,
      price
    )
  `).order('name', { ascending: false });
        if (error) {
            console.error(error);
        } else {
            setCars(data);
            setLoading(false);
        }
    };

    const submitMobil = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.image) {
            alert('Harap lengkapi semua field termasuk gambar');
            return;
        }

        const payload = {
            name: form.name,
            description: form.description,
            image: form.image,
        };

        let error;
        if (isEdit && editId) {
            ({ error } = await supabase.from('cars').update(payload).eq('id', editId));
        } else {
            ({ error } = await supabase.from('cars').insert([payload]));
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

    const showSuccessModal = () => {
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            setForm({
                name: '',
                description: '',
                image: '',
                imagePath: '',
            });
            fetchMobil();
        }, 2000);
    };

    const handleEdit = (car: any) => {
        setForm({
            name: car.name,
            description: car.description,
            image: car.image,
            imagePath: ''
        });
        setEditId(car.id);
        setIsEdit(true);
        setShowModal(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const { publicUrl, filePath } = await service.uploadImage(file);
            setForm((prev) => ({
                ...prev,
                image: publicUrl,
                imagePath: filePath,
            }));
        } catch (error: any) {
            alert('Upload gagal: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!form.imagePath) {
            setForm((prev) => ({ ...prev, image: '', imagePath: '' }));
            return;
        }

        try {
            await service.removeImage(form.imagePath);
            setForm((prev) => ({ ...prev, image: '', imagePath: '' }));
        } catch (error: any) {
            alert('Gagal menghapus gambar: ' + error.message);
        }
    };

    const handleDeleteImage = async () => {
        const publicURLPrefix = 'https://zuszaxdwlcupogxpfwhf.supabase.co/storage/v1/object/public/images/';
        const filePath = imgId.replace(publicURLPrefix, '');

        try {
            await service.removeImage(filePath);
            setForm((prev) => ({ ...prev, image: '', imagePath: '' }));
        } catch (error: any) {
            alert('Gagal menghapus gambar: ' + error.message);
        }
    };

    const handleDelete = async () => {
        const result = await service.deleteData(delId, 'cars');
        setShowConfirm(false);
        handleDeleteImage();
        fetchMobil();
    };

    return (
        <AdminLayout>
            <div className='flex flex-row items-center justify-between mb-5'>
                <h1 className='text-xl font-semibold'>Data Mobil</h1>
                <button className='button-primary flex flex-row items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
                    onClick={() => setShowModal(true)}
                >Tambah Mobil <span><IoMdAddCircleOutline className='w-5 h-5' /></span></button>
            </div>
            <div className='w-full h-auto flex flex-col relative bg-white rounded-lg border border-gray-300 p-5'>
                {loading ? <div className='flex flex-row gap-3 items-center justify-center w-full h-100'>
                    <p className='text-center text-gray-500'>Loading...
                    </p>
                    <svg className="mr-3 -ml-1 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" ></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                </div>
                    :
                    <>
                        {cars.length === 0 &&
                            <div className='w-full h-100 grid place-items-center'>
                                <p className='text-slate-400'>Data Mobil Kosong</p>
                            </div>
                        }
                        <div className='w-full h-min place-items-center grid grid-cols-1 md:grid-cols-4 gap-7 px-10 py-5'>
                            {cars.map((car: any, index) => (
                                <div key={index} className='w-58 h-75  flex flex-col gap-2 items-center justify-center'>
                                    <div className="w-38 h-45 min-h-min bg-white p-2 rounded-md overflow-hidden border border-gray-300 grid place-items-center cursor-pointer">
                                        <PhotoProvider>
                                            <PhotoView src={car.image ?? 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'}>
                                                <img
                                                    src={car.image}
                                                    alt="profil"
                                                    className="object-contain size-full "
                                                    data-tooltip-id="my-tooltip" data-tooltip-content={car.name}
                                                />
                                            </PhotoView>
                                        </PhotoProvider>
                                    </div>
                                    <p className='text-sm font-semibold'>{car.name}</p>
                                    {car.description &&
                                        <p className='text-label text-slate-500 text-center h-20 overflow-hidden line-clamp-2'>{car.description}</p>}
                                    {car.cars_type?.length > 0 ? (
                                        <p className='text-center'>

                                            Harga Mulai :{" "}
                                            {util.formatRupiah(
                                                Math.min(...car.cars_type.map((type: any) => type.price))
                                            )}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-400">Belum ada tipe</p>
                                    )}
                                    <div className='flex flex-row gap-2'>

                                        <Link
                                            data-tooltip-id="my-tooltip" data-tooltip-content="Detail Mobil"
                                            href={`/admin/cars/${car.id}`} className="button-primary flex flex-row items-center justify-center gap-3">
                                            Detail
                                        </Link>
                                        <button className="button-primary cursor-pointer"
                                            data-tooltip-id="my-tooltip" data-tooltip-content="Edit Mobil"
                                            onClick={() => handleEdit(car)}
                                        ><RiEdit2Fill className='w-4 h-4 text-white' /></button>
                                        <button
                                            onClick={() => { setDelId(car.id); setShowConfirm(true); setImgId(car.image) }}
                                            data-tooltip-id="my-tooltip" data-tooltip-content="Hapus Mobil"
                                            className="button-primary cursor-pointer"><RiDeleteBin5Fill className='w-4 h-4 text-white' /></button>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                }
            </div>

            {/* Modal Tambah  */}
            <ModalTambah show={showModal} onClose={() => setShowModal(false)} judul={isEdit ? "Edit Mobil" : "Tambah Mobil"}>
                <form onSubmit={submitMobil} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Nama Mobil</label>
                        <input
                            type="text"
                            placeholder='Nama Mobil'
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input-text"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Deskripsi</label>
                        <input
                            type="text"
                            placeholder='Deskripsi Mobil'
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="input-text"
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-semibold text-gray-700">Gambar Mobil</label>
                        <div className="relative flex items-center px-7 py-3 justify-center w-full min-h-32 h-min border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {form.image ? (
                                <div style={{ position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={form.image}
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

