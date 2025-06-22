import ImageSlideshow from "@/components/ImagesSlideshow";
import { FaCarRear, FaG } from "react-icons/fa6";
import { GrFormNextLink } from "react-icons/gr";
import { useState, useEffect } from 'react';
import { IoIosArrowDropup, IoIosArrowDropdown } from 'react-icons/io';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { supabase } from '@/lib/supabase';
import { CarTenorType, Testimonials } from "@/utilities/types";
import Utilities from "@/utilities/Utilities";
import { GiHamburgerMenu } from "react-icons/gi";
import { BiSolidDiscount } from "react-icons/bi";
import { FaCalculator } from "react-icons/fa6";
import { AiFillPicture } from "react-icons/ai";
import { FaGift } from "react-icons/fa6";
import { FaHandHoldingUsd } from "react-icons/fa";
import { RiHeadphoneFill } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { PiMapPinFill } from "react-icons/pi";

export default function Home() {
  const imageUrls = [
    'banner1-promosuzukiserang-1.jpg',
    'banner1-promosuzukiserang-2.jpg',
    'banner1-promosuzukiserang-3.jpg',
    'banner1-promosuzukiserang-4.jpg',
  ];

  const [cars, setCars] = useState<CarTenorType[]>([] as CarTenorType[]);
  const [testi, setTesti] = useState<Testimonials[]>([] as Testimonials[]);
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [openBar, setOpenBar] = useState<boolean>(false);

  const util = new Utilities();

  const fetchMobil = async () => {
    const { data, error } = await supabase.from('cars')
      .select(`
    id,
    name,
    image,
    cars_image (
    image
    ),
    cars_type (
      name,
      price,
      tenor_price (
      tenor,
      total_dp,
      angsuran      
    )
    )
  `).order('name', { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setCars(data as CarTenorType[]);
    }
  };

  const fetchTesti = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('name', { ascending: false });
    if (error) {
      console.error(error);
    } else {
      setTesti(data as Testimonials[]);
    }
  };

  useEffect(() => {
    fetchMobil();
    fetchTesti();
  }, []);

  return (
    <>
      <div className="box-border p-0 m-0 w-full min-h-min overflow-x-hidden relative scroll-smooth">
        <nav className="w-full h-20 flex flex-row fixed top-0 left-0 right-0 z-100 bg-white opacity-90 border-b border-slate-100">
          <div className="w-1/2 grid place-items-center">
            <div className="flex flex-col">
              <img
                src="./logo-suzuki2.png"
                alt="profil"
                className="w-37"
              />
              <label className="text-mini">Promo Suzuki Alsut</label>
            </div>
          </div>
          <div className="w-1/2 flex flex-row gap-3 justify-end md:justify-start items-center">
            <GiHamburgerMenu onClick={() => setOpenBar(!openBar)} className='size-8 mx-3 block md:hidden text-black' />

            <a className="bg-blue-800 hidden md:block text-sm text-white px-3 py-2 font-semibold cursor-pointer" href="#home">Home</a>
            <a className="hover:bg-blue-800 hidden md:block  text-sm hover:text-white font-semibold text-black cursor-pointer transition-all px-3 py-2" href="#produk">Produk</a>
            <a className="hover:bg-blue-800 hidden md:block  text-sm hover:text-white font-semibold text-black cursor-pointer transition-all px-3 py-2" href="#promo">Promo</a>
            <a className="hover:bg-blue-800 hidden md:block  text-sm hover:text-white font-semibold text-black cursor-pointer transition-all px-3 py-2" href="#testimoni">Testimoni</a>
            <a className="hover:bg-blue-800 hidden md:block text-sm hover:text-white font-semibold text-black cursor-pointer transition-all px-3 py-2" href="#kontak">Kontak</a>
          </div>
        </nav>
        <nav className={`fixed transition-all duration-500 ease-in-out  z-20 top-0 w-full right-0 left-0 ${openBar ? 'max-h-400' : 'max-h-0'} overflow-hidden mt-20 border-b shadow-sm border-slate-100 bg-white`}>
          <div className="w-full h-min flex flex-col" onClick={() => setOpenBar(!openBar)}>
            <a className="bg-blue-800 text-sm text-white px-3 py-2 font-semibold cursor-pointer" href="#home">Home</a>
            <a className="hover:bg-blue-800  text-sm hover:text-white font-semibold text-black cursor-pointer transition-all px-3 py-2" href="#produk">Produk</a>
            <a className="hover:bg-blue-800 text-sm hover:text-white font-semibold text-black cursor-pointer transition-all px-3 py-2" href="#promo">Promo</a>
            <a className="hover:bg-blue-800  text-sm hover:text-white font-semibold text-black cursor-pointer transition-all px-3 py-2" href="#testimoni">Testimoni</a>
            <a className="hover:bg-blue-800 text-sm hover:text-white font-semibold text-black cursor-pointer transition-all px-3 pb-5 py-2" href="#kontak">Kontak</a>
          </div>

        </nav>

        <section id="home" className="scroll-smooth pt-20">
          <div className="w-full">
            <ImageSlideshow images={imageUrls} />
          </div>
        </section>

        <section id="produk" className="scroll-smooth pt-5 md:pt-20">
          <div className="w-full flex flex-col items-center gap-3 my-5 md:my-10">
            <div className="flex flex-col gap-3 items-center pb-0 md:pb-10 justify-center min-h-min">
              <p>Website Resmi</p>
              <h1>Promo Suzuki Alsut</h1>
            </div>
            <div className="grid grid-cols-2 md:flex flex-col md:flex-row md:gap-3 items-center py-10 md:pl-20 justify-center min-h-min">

              <div className="w-50 h-50 flex flex-col items-center md:items-start gap-3 md:border-r border-slate-200">
                <div className="size-20 rounded-md bg-blue-800 grid place-items-center">
                  <FaCarRear className='size-10 md:size-13 text-white icon-sidebar' />
                </div>
                <p>Beli Mobil</p>
                <a href="#promo">
                  <GrFormNextLink className='size-10 md:size-13 hover:size-14 transition-all cursor-pointer text-black icon-sidebar' />
                </a>
              </div>

              <div className="w-50 h-50 flex flex-col items-center md:items-start gap-3 md:border-r border-slate-200">
                <div className="size-20 rounded-md bg-blue-800 grid place-items-center">
                  <FaCalculator className='size-10 md:size-13 text-white icon-sidebar' />
                </div>
                <p>Simulasi Kredit</p>
                <a href="#promo">
                  <GrFormNextLink className='size-10 md:size-13 hover:size-14 transition-all cursor-pointer text-black icon-sidebar' />
                </a>
              </div>

              <div className="w-50 h-50 flex flex-col items-center md:items-start gap-3 md:border-r border-slate-200">
                <div className="size-20 rounded-md bg-blue-800 grid place-items-center">
                  <BiSolidDiscount className='size-10 md:size-13 text-white icon-sidebar' />
                </div>
                <p>Gebyar Promo</p>
                <a href="#promo">
                  <GrFormNextLink className='size-10 md:size-13 hover:size-14 transition-all cursor-pointer text-black icon-sidebar' />
                </a>
              </div>

              <div className="w-50 h-50 flex flex-col items-center md:items-start gap-3 md:border-r border-slate-200">
                <div className="size-20 rounded-md bg-blue-800 grid place-items-center">
                  <AiFillPicture className='size-10 md:size-13 text-white icon-sidebar' />
                </div>
                <p>Testimoni</p>
                <a href="#testimoni">
                  <GrFormNextLink className='size-10 md:size-13 hover:size-14 transition-all cursor-pointer text-black icon-sidebar' />
                </a>
              </div>


            </div>
            <div className="flex flex-col md:flex-row gap-3 max-w-3xl items-center justify-center min-h-min">
              <div className="w-2/3 md:w-1/2">
                <img
                  src="./suzuki-showroom.png"
                  alt="profil"
                  className="w-100"
                />
              </div>
              <div className="w-2/3 md:w-1/2 flex flex-col gap-3">
                <p className="text-red-600">ABOUT</p>
                <h6 className="text-3xl font-bold">Promo Suzuki Alsut</h6>
                <label className="text-label">
                  Kami menyediakan unit mobil suzuki terlengkap dengan harga terbaru dan pastinya promo yang menarik. Hanya di showroom kami Anda bisa dengan mudah mendapatkan mobil impian dengan DP yang ringan. Hubungi saya untuk informasi lebih detailnya mengenai harga dari suzuki Alsut atau kunjungi alamat showroom kami.
                </label>
                <button
                  onClick={() => console.log(cars)}
                  className="text-sm px-4 py-2 bg-blue-800 rounded-xl w-min text-white font-semibold cursor-pointer hover:bg-blue-900 transition-all">
                  Hubungi
                </button>
              </div>
            </div>
          </div>
        </section>

        <section id="promo" className="scroll-smooth pt-20">
          <div className="w-full flex flex-col h-min bg-gradient-to-b  from-blue-50 to-white">
            <div className="w-full flex flex-col p-5 pt-10 gap-5 items-center justify-center">
              <h6 className="text-3xl font-bold">Temukan mobil impian Anda disini!
              </h6>
              <p>
                Kami menyediakan mobil suzuki terbaru, stylis dan juga nyaman untuk digunakan.
              </p>
            </div>
            <div className="w-full md:px-80">
              <div className={`flex px-5 ${isOpen !== null ? 'flex-col' : 'flex-row'}  flex-wrap h-auto gap-10 items-start justify-center py-10`}>
                {cars.map((car, index) => (
                  <div key={index} className={` ${isOpen !== null ? 'w-full' : 'w-full md:w-68'}  h-min items-stretch  flex flex-col p-5 rounded-lg shadow-md hover:shadow-xl transition-all bg-white`}>
                    <div
                      id={`promo${index}`}
                      className="rounded-md w-full grid place-items-center h-min relative overflow-hidden p-2 ">
                      <div className="absolute top-0 left-0 bg-red-500 py-1 px-3 text-white font-semibold rounded-full">
                        New
                      </div>
                      <PhotoProvider>
                        <PhotoView src={car.image}>
                          <img
                            src={car.image}
                            alt="profil"
                            className="w-100 cursor-pointer"
                          />
                        </PhotoView>
                      </PhotoProvider>
                    </div>
                    <div className="w-full h-min relative overflow-hidden p-2 block ">
                      <div className="flex flex-row overflow-x-scroll scrollbar-hidden p-2 overflow-y-hidden">
                        {car.cars_image.map((img, idx) => (
                          <PhotoProvider key={idx}>
                            <PhotoView src={img.image}>
                              <img
                                src={img.image}
                                alt="profil"
                                className="w-18"
                              />
                            </PhotoView>
                          </PhotoProvider>
                        ))}
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-2 py-2 mb-5">
                      <p className="font-semibold">{car.name}</p>
                      {car.cars_type?.length > 0 ? (
                        <label className="text-label">

                          Harga mulai {" "}
                          {util.formatRupiah(
                            Math.min(...car.cars_type.map((type: any) => type.price))
                          )}
                        </label>
                      ) : (
                        <label className="text-label">Harga mulai Rp. 298.200.000</label>
                      )}
                    </div>
                    <div className="w-full min-h-min flex flex-col gap-2 rounded-md">
                      <a href={`${isOpen === index ? '#promo' + index : '#promo'}`}
                        onClick={() => car.cars_type?.length > 0 ? setIsOpen(isOpen === index ? null : index) : undefined}
                        className="h-min border cursor-pointer rounded-md gap-3 p-2 border-slate-200 flex flex-row justify-start items-center">
                        {isOpen === index ? (
                          <IoIosArrowDropup className="size-5 text-slate-500" />
                        ) : (
                          <IoIosArrowDropdown className="size-5 text-slate-500" />
                        )} <p className="text-label text-slate-500">Pricelist</p>
                      </a>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen === index ? 'max-h-[800px]' : 'max-h-0'
                        }`}>
                        <div className="transition-all overflow-x-auto scrollbar-hidden m-2 max-w ">
                          <table className="min-w-full text-sm border border-gray-300">
                            <thead>
                              <tr className="bg-red-600 text-white text-left">
                                <th className="px-4 py-2">Tipe & OTR</th>
                                <th className="px-4 py-2">Tenor</th>
                                <th className="px-4 py-2">Total DP</th>
                                <th className="px-4 py-2">Angsuran</th>
                              </tr>

                            </thead>

                            <tbody>

                              {car.cars_type.map((car, carIndex) => (
                                car.tenor_price.map((tenor, index) => (
                                  <tr key={`${carIndex}-${index}`} className="border border-gray-300">
                                    {index === 0 && (
                                      <td rowSpan={car.tenor_price.length} className="px-4 py-2 align-top">
                                        <div>
                                          <p className="font-semibold">{car.name}</p>
                                          <p className="text-sm text-gray-500">{util.formatRupiah(car.price)}</p>
                                        </div>
                                      </td>
                                    )}
                                    <td className="px-4 py-2 border-x border-gray-300">{tenor.tenor}</td>
                                    <td className="px-4 py-2 border-x border-gray-300">{util.formatRupiah(tenor.total_dp)}</td>
                                    <td className="px-4 py-2 border-x border-gray-300">{util.formatRupiah(tenor.angsuran)}</td>

                                  </tr>
                                ))
                              ))}
                            </tbody>
                          </table>

                        </div>
                      </div>

                    </div>
                    <button className="text-sm mt-5 px-4 py-2 bg-blue-800 rounded-xl w-min text-white font-semibold cursor-pointer hover:bg-blue-900 transition-all">
                      Hubungi
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-full flex flex-col pt-10 px-5 md:px-0 gap-5 items-center justify-center">
                <div className="w-full rounded-xl flex h-min flex-col shadow-xl p-2 overflow-hidden bg-white">
                  <div className="w-full flex flex-col md:flex-row px-10 md:px-30 h-min py-15 md:py-20 gap-8 md:gap-15 rounded-xl bg-red-500">

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-row gap-5 items-center">
                        <div className="size-14 rounded-full grid place-items-center bg-red-400">
                          <FaCarRear className='size-4 text-white icon-sidebar' />
                        </div>
                        <p className="text-white font-semibold">Pilihan Lengkap</p>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-label text-white">
                          Disini, semua varian mobil Suzuki tersedia, dan keluaran terbaru
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-row gap-5 items-center">
                        <div className="size-14 rounded-full grid place-items-center bg-red-400">
                          <FaGift className='size-4 text-white icon-sidebar' />
                        </div>
                        <p className="text-white font-semibold">Banyak Promo</p>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-label text-white">
                          Tersedia banyak promo dan hadiah menarik untuk Anda
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-row gap-5 items-center">
                        <div className="size-14 rounded-full grid place-items-center bg-red-400">
                          <FaHandHoldingUsd className='size-4 text-white icon-sidebar' />
                        </div>
                        <p className="text-white font-semibold">Cicilan Ringan</p>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-label text-white">
                          Beli mobil lebih hemat dengan DP murah dan cicilan ringan
                        </label>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-row gap-5 items-center">
                        <div className="size-14 rounded-full grid place-items-center bg-red-400">
                          <RiHeadphoneFill className='size-4 text-white icon-sidebar' />
                        </div>
                        <p className="text-white font-semibold">Support 24/7</p>
                      </div>
                      <div className="flex flex-col">
                        <label className="text-label text-white">
                          Marketing kami siap melayani selama 24/7, fast respon
                        </label>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimoni" className="scroll-smooth pt-5 md:pt-20">
          <div className="w-full flex flex-col h-min bg-white">
            <div className="w-full flex flex-col p-5 pt-10 gap-5 items-center justify-center">
              <h6 className="text-3xl font-bold">Testimoni dari pelanggan kami
              </h6>
              <p>
                Menjadi kepercayaan penyedia mobil suzuki terpercaya dan terbaik di Serang.
              </p>
            </div>

            <div className="w-full md:px-60 flex flex-col md:flex-row flex-wrap p-5 pt-10 gap-5 items-center justify-center">

              {testi.map((test, index) => (
                <div
                key={index}
                className="w-60 h-100 cursor-pointer p-2 object-cover overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all grid place-items-center ">
                  <PhotoProvider>
                    <PhotoView src={test.image}>
                      <img
                        src={test.image}
                        alt="profil"
                        className="w-full h-full object-cover"
                      />
                    </PhotoView>
                  </PhotoProvider>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section id="kontak" className="scroll-smooth relative pt-5 md:pt-20">
          <footer className="w-full sticky flex flex-col-reverse md:flex-row px-10 gap-10 md:px-80 bottom-0 py-20 left-0 right-0 bg-blue-800 h-min">
            <div className="flex flex-col md:w-1/3">
              <img
                src="./logo-suzuki-putih.png"
                alt="profil"
                className="w-50"
              />
              <label className="text-start text-label text-white">Promo Suzuki Alsut</label>
              <p className="text-white text-label">©2025 Promo Suzuki Alsut. All Rights Reserved.</p>
            </div>

            <div className="flex flex-col gap-3 md:w-1/3">
              <p className="text-white twxt-label font-semibold">Kontak</p>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <FaWhatsapp className='size-4 text-white icon-sidebar' />
                  <p className="text-white text-label">+6281 234 567 367</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <FaPhone className='size-4 text-white icon-sidebar' />
                  <p className="text-white text-label">02337876</p>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <MdEmail className='size-4 text-white icon-sidebar' />
                  <p className="text-white text-label">admin@email.com</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:w-1/3">
              <p className="text-white twxt-label font-semibold">Alamat</p>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <PiMapPinFill className='size-4 text-white icon-sidebar' />
                  <p className="text-white text-label">Jl. Raya Serang - Jakarta</p>
                </div>

              </div>
            </div>
          </footer>
        </section>

        <div className="fixed bottom-10 right-0 flex flex-col gap-2 w-20 h-min">
          <a href="https://api.whatsapp.com/send?phone=6281234567367" target="_blank" rel="noopener noreferrer">
            <div className="w-full h-min flex flex-col items-center justify-center gap-1">
              <img
                src="./facebook.png"
                alt="profil"
                className="w-12"
              />
            </div>
          </a>
          <a href="https://api.whatsapp.com/send?phone=6281234567367" target="_blank" rel="noopener noreferrer">
            <div className="w-full h-min flex flex-col items-center justify-center gap-1">
              <img
                src="./whatsapp.png"
                alt="profil"
                className="w-12"
              />
            </div>
          </a>
          <a href="#home" rel="noopener noreferrer">
            <div className="w-full h-min grid place-items-center">
              <div className=" bg-red-600 size-11 rounded-full grid place-items-center">
              <IoIosArrowDropup className="size-8 text-white" />
              </div>
            </div>
          </a>
        </div>

      </div>
    </>
  );
}

