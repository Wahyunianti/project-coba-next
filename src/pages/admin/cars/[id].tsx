
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/pages/admin/index';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { CarTypeWithTenor } from '@/utilities/types';
import ModalTambah from '@/components/ModalTambah';
import { CarTenor } from '@/utilities/types';
import { CarType, CarDetail } from '@/utilities/types';
import Utilities from '@/utilities/Utilities';
import { Service } from '@/utilities/service';
import ModalConfirm from '@/components/ModalConfirm';
import ModalSuccess from '@/components/ModalSuccess';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';


export default function DetailCar() {
  const [showModal, setShowModal] = useState(false);
  const [showModalImg, setShowModalImg] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [delId, setDelId] = useState<number>(1);
  const [imgId, setImgId] = useState<string>('');
  const [status, setStatus] = useState<boolean>(true);
  const [tenorId, setTenorId] = useState<number>(1);
  const [prefix, setPrefix] = useState<string>('');
  const router = useRouter();
  const { id } = router.query;
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);


  const utils = new Utilities()
  const service = new Service()


  //Form Submit Data
  const getId = utils.UUIDInt();
  const [form, setForm] = useState<CarDetail>({
    name: '',
    image: '',
    cars_type: []
  });

  const [formImage, setImages] = useState({
    image: '',
    imagePath: '',
  });
  const [formTipe, setTipe] = useState<CarType>({
    name: '',
    price: 0,
  });
  const [formTenor, setTenor] = useState<Array<CarTenor>>([
    {
      cars_type_id: tenorId,
      tenor: 0, total_dp: 0, angsuran: 0
    }
  ]);

  const [img, setImage] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataTenor, setDataTenor] = useState<CarTypeWithTenor[]>([]);

  useEffect(() => {
    if (id) {
      fetchCar();
      fetchImage();
      fetchTenor();
    }
  }, [id]);

  const fetchCar = async () => {
    const { data, error } = await supabase.from('cars')
      .select(`
    id,
    name,
    image,
    cars_type (
      id,
      name,
      price
    )
  `).eq('id', id).single();
    if (!error) setForm(data);
    if (data) setLoading(false);
  };

  const fetchImage = async () => {
    const { data, error } = await supabase.from('cars_image').select('*').eq('cars_id', id).order('id', { ascending: false });
    if (!error) setImage(data);
  };

  const fetchTenor = async () => {
    const { data, error } = await supabase
      .from("cars_type")
      .select(
        `
            id,
            name,
            price,
            tenor_price (
              tenor,
              total_dp,
              angsuran
            )
          `
      )
      .eq("cars_id", id);

    if (error) {
    } else {
      setDataTenor(data || []);
    }
  };

  const submitType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTenor || formTenor.length === 0 || formTenor.every(t => t.tenor === 0 && t.total_dp === 0 && t.angsuran === 0)) {
      return;
    }

    const payload = {
      id: tenorId,
      cars_id: id,
      name: formTipe.name,
      price: formTipe.price,
    };

    let error;
    ({ error } = await supabase.from('cars_type').insert([payload]));

    if (!error) {
      submitTenor();
    }

    setShowModal(false);
    showSuccessModal();
    setIsEdit(false);
    setEditId(null);
  };

  const submitImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImage.imagePath) return

    const payload = {
      cars_id: id,
      image: formImage.image,
    };

    let error;
    ({ error } = await supabase.from('cars_image').insert([payload]));

    setShowModalImg(false);
    showSuccessModal();
    setIsEdit(false);
    setEditId(null);
  };

  const submitTenor = async () => {
    if (formTenor.length === 0) return
    const payload = formTenor.map(item => ({
      ...item,
      cars_type_id: tenorId
    }));
    const { error } = await supabase
      .from('tenor_price')
      .insert(payload);

    console.log(formTenor);
  };

  const showSuccessModal = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setImages({
        image: '',
        imagePath: '',
      });
      fetchImage();
      fetchTenor();
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTipe(prev => ({ ...prev, [name]: value }));
  };

  const addTenorForm = () => {
    setTenor([
      ...formTenor,
      { cars_type_id: 0, tenor: 0, total_dp: 0, angsuran: 0 }
    ]);
  };

  const handleTenorChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedTenors = [...formTenor];
    updatedTenors[index][name as keyof CarTenor] = value as never;
    setTenor(updatedTenors);
  };

  const removeTenorForm = (index: number) => {
    const updatedTenors = formTenor.filter((_, i) => i !== index);
    setTenor(updatedTenors);
  };

  const handleDelete = async () => {
    status ? await service.deleteData(delId, 'cars_image') : await service.deleteData(delId, 'cars_type');
    setShowConfirm(false);
    handleRemoveImage();
    fetchTenor();
    fetchImage();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setUploading(true);

    try {
      const { publicUrl, filePath } = await service.uploadImage(file);
      setImages((prev) => ({
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
    const publicURLPrefix = 'https://zuszaxdwlcupogxpfwhf.supabase.co/storage/v1/object/public/images/';
    const filePath = imgId.replace(publicURLPrefix, '');

    try {
      await service.removeImage(filePath);
      setImages((prev) => ({ ...prev, image: '', imagePath: '' }));
    } catch (error: any) {
      alert('Gagal menghapus gambar: ' + error.message);
    }
  };

  const handleUpdateImage = async () => {
    if (!formImage.imagePath) {
      setImages(prev => ({ ...prev, image: '', imagePath: '' }));
      return;
    }

    const { error } = await supabase.storage
      .from('images')
      .remove([formImage.imagePath]);

    if (error) {
      alert('Gagal menghapus gambar: ' + error.message);
      return;
    }
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

          <h1 className='hidden md:block text-xl font-semibold'>Data Tipe & OTR</h1>
        </div>
        <button
          onClick={() => { setShowModal(true); setTenorId(getId) }}
          className='button-primary flex flex-row items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
        >Tambah Tipe <span><IoMdAddCircleOutline className='w-5 h-5' /></span></button>
      </div>
      <div className='w-full h-auto relative bg-white rounded-lg border border-gray-300'>
        {loading ? <div className='flex flex-row gap-3 items-center justify-center w-full h-100'>
          <p className='text-center text-gray-500'>Loading...
          </p>
          <svg className="mr-3 -ml-1 size-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" ></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
          :
          <div className='mb-10'>
            <div className='w-full h-auto flex flex-col md:flex-row relative  p-5'>
              <div className='w-full md:w-1/2 flex flex-col md:flex-row gap-3'>
                <div className='w-full flex flex-col'>
                  <img
                    src={form?.image}
                    alt="profil"
                    className="object-contain size-full "
                    data-tooltip-id="my-tooltip" data-tooltip-content="Gambar Mobil"
                  />
                </div>
                <div className='w-full flex flex-col'>
                  <h1>{form?.name}</h1>
                  {form.cars_type?.length > 0 ? (
                    <h5 className='text-slate-500'>
                      Harga Mulai :{" "}
                      {utils.formatRupiah(
                        Math.min(...form.cars_type.map((type: any) => type.price))
                      )}
                    </h5>
                  ) : (
                    <p className="text-sm text-gray-400">Belum ada data tenor</p>
                  )}
                </div>
              </div>
              <div className='w-full md:w-1/2 mt-5 flex flex-row gap-3'>
                <div className='w-full flex flex-row flex-wrap items-center justify-center gap-2'>
                  {img.map((image: any, index) => (
                    <div key={index}
                      className='relative size-auto icon-cars'>
                      <div
                        onClick={() => { setShowConfirm(true); setDelId(image.id); setImgId(image.image); setStatus(true) }}
                        className='close-button absolute right-0 top-0 bg-white rounded-full'>
                        <IoCloseCircleOutline className='size-7 hover:size-8 transition-all cursor-pointer' />
                      </div>
                      <div className='frame-cars size-auto md:size-34 grid place-items-center rounded-md m-3'>
                        <PhotoProvider>
                          <PhotoView src={image.image ?? 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'}>
                            <img
                              src={image.image ?? 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif'}
                              alt="profil"
                              className="object-contain size-25  md:size-32 cursor-pointer"
                              data-tooltip-id="my-tooltip" data-tooltip-content="Lihat Preview"
                            />
                          </PhotoView>
                        </PhotoProvider>
                      </div>
                    </div>
                  ))}
                  <IoMdAddCircleOutline
                    data-tooltip-id="my-tooltip" data-tooltip-content="Tambah Image"
                    onClick={() => { setShowModalImg(true) }}
                    className='size-14 cursor-pointer hover:size-15 transition-all' />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto max-w mx-7 my-7">
              <table className="min-w-full text-sm border border-gray-300">
                <thead>
                  <tr className="bg-red-600 text-white text-left">
                    <th className="px-4 py-2">Tipe & OTR</th>
                    <th className="px-4 py-2">Tenor</th>
                    <th className="px-4 py-2">Total DP</th>
                    <th className="px-4 py-2">Angsuran</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>

                </thead>

                <tbody>

                  {dataTenor.map((car, carIndex) => (
                    car.tenor_price.map((tenor, index) => (
                      <tr key={`${carIndex}-${index}`} className="border border-gray-300">
                        {index === 0 && (
                          <td rowSpan={car.tenor_price.length} className="px-4 py-2 align-top">
                            <div>
                              <p className="font-semibold">{car.name}</p>
                              <p className="text-sm text-gray-500">{utils.formatRupiah(car.price)}</p>
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-2 border-x border-gray-300">{tenor.tenor}</td>
                        <td className="px-4 py-2 border-x border-gray-300">{utils.formatRupiah(tenor.total_dp)}</td>
                        <td className="px-4 py-2 border-x border-gray-300">{utils.formatRupiah(tenor.angsuran)}</td>
                        {index === 0 && (
                          <td rowSpan={car.tenor_price.length} className="px-4 py-2">
                            <div
                              onClick={() => { setShowConfirm(true); setDelId(car.id); setStatus(false) }}
                              className='rounded-full h-20 grid place-items-center '>
                              <IoCloseCircleOutline className='size-10 hover:size-11 transition-all cursor-pointer' />
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  ))}
                </tbody>
              </table>

            </div>
                          {dataTenor.length === 0 &&
                <div className='w-full pb-5  grid place-items-center'>
                  <p className='text-slate-400'>Data Tenor Kosong</p>
                </div>
              }
          </div>

        }

      </div>


      {/* Modal Tambah  */}
      <ModalTambah show={showModal} onClose={() => setShowModal(false)} judul={"Tambah Tipe & OTR"}>
        <form onSubmit={submitType} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Tipe OTR</label>
            <input
              type="text"
              placeholder='Tipe Otr'
              name="name"
              value={formTipe.name}
              onChange={handleChange}
              className="input-text"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Harga</label>
            <input
              type="number"
              placeholder='Harga'
              name="price"
              value={formTipe.price}
              onChange={handleChange}
              className="input-text"
              required
            />
          </div>
          <div className='w-full flex flex-col items-center'>
            <button
              onClick={addTenorForm}
              type='button'
              className='button-primary flex flex-row items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
            >Tambah Tenor<span><IoMdAddCircleOutline className='w-5 h-5' /></span></button>
          </div>

          <div className='h-72 flex flex-col gap-8 w-full p-4 overflow-y-auto overflow-x-hidden'>
            {/* Menampilkan form Tenor */}
            {formTenor.map((tenor, index) => (
              <div key={index} className='relative w-full h-full'>
                <div
                  onClick={() => removeTenorForm(index)}
                  className='absolute -right-3 -top-3 bg-white rounded-full'>
                  <IoCloseCircleOutline className='size-7 hover:size-8 transition-all cursor-pointer' />
                </div>
                <div key={index} className='border flex flex-col gap-3 p-5 rounded-md'>
                  <div>
                    <label className="block mb-1 font-medium">Tenor</label>
                    <input
                      type="number"
                      placeholder='Tenor'
                      name="tenor"
                      value={tenor.tenor}
                      onChange={(e) => handleTenorChange(index, e)}
                      className="input-text"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Total DP</label>
                    <input
                      type="number"
                      placeholder='Total DP'
                      name="total_dp"
                      value={tenor.total_dp}
                      onChange={(e) => handleTenorChange(index, e)}
                      className="input-text"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Angsuran</label>
                    <input
                      type="number"
                      placeholder='Angsuran'
                      name="angsuran"
                      value={tenor.angsuran}
                      onChange={(e) => handleTenorChange(index, e)}
                      className="input-text"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
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
      <ModalTambah show={showModalImg} onClose={() => setShowModalImg(false)} judul={"Tambah Gambar Mobil"}>
        <form onSubmit={submitImage} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-semibold text-gray-700">Gambar Mobil</label>
            <div className="relative flex items-center px-7 py-3 justify-center w-full min-h-32 h-min border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-black">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {formImage.image ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={formImage.image}
                    alt="Preview"
                    style={{ maxWidth: 200, paddingInline: 20, borderRadius: 8, display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={handleUpdateImage}
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
