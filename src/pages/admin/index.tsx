import { GetServerSidePropsContext } from 'next';
import { ReactNode, useEffect, useState } from 'react';
import Image from "next/image";
import { MdOutlineHomeWork } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { PiCarBold } from "react-icons/pi";
import { AiOutlineComment } from "react-icons/ai";
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { IoSettingsOutline } from "react-icons/io5";
import { Tooltip } from 'react-tooltip';
import { RiEdit2Fill } from "react-icons/ri";
import { TbLogout } from "react-icons/tb";


export default function AdminIndexRedirect({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = router.pathname;

  const [username, setUsername] = useState<string | undefined>();
  const [profil, setProfil] = useState<string | undefined>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUsername(Cookies.get('username'));
      setProfil(Cookies.get('profil'));
    }
  }, []);

  const handleLogout = () => {
    console.log(username, profil);
    Cookies.remove('isLoggedIn');
    router.push('/admin/login');
  };

  return (
    <div className='relative box-border p-0 m-0 w-full min-h-screen h-auto transition-all duration-300 ease-in-out overflow-hidden'>
      <div className='absolute md:hidden grid place-items-center bottom-5 right-5 shadow-md z-100 bg-black w-16 h-16 rounded-full'
        data-tooltip-id="my-tooltip" data-tooltip-content="Logout"
        onClick={handleLogout}
      >
        <TbLogout className='text-2xl text-white block md:hidden' />
      </div>
      <div className='flex flex-row w-full h-screen '>
        <div className='w-100 h-full bg-slate-50 p-7 z-20 hidden md:block'>
          <div className='w-full h-full flex flex-col py-10 bg-black rounded-2xl'>
            <div className='flex flex-row items-center justify-center w-full h-15 gap-3'>
              <Image
                src="../../wheel.svg"
                alt="Mobil"
                width={100}
                height={100}
                className='w-10 h-10 animate-spin-slow'>
              </Image>
              <h1 className='text-2xl font-bold text-white'>SUZUKI ALSUT</h1>
            </div>
            <div className='flex flex-col items-center justify-start w-full h-full gap-4 mt-10 px-10 '>
              <Link href="/admin/dashboard" prefetch={true} className='w-full flex flex-row items-center justify-start gap-3 h-10 menu-sidebar cursor-pointer'>
                <MdOutlineHomeWork className='text-2xl text-white icon-sidebar' />
                <h3 className='text-base font-semibold text-white icon-sidebar'>Dashboard Admin</h3>
              </Link>
              <div className='w-full flex flex-row items-center justify-start gap-3 h-10 '>
                <h3 className='text-base font-normal text-slate-400'>Kelola Data</h3>
              </div>
              <Link href="/admin/users" prefetch={true} className='w-full flex flex-row items-center justify-start gap-3 h-10 menu-sidebar cursor-pointer'>
                <LuUsers className='text-2xl text-white icon-sidebar' />
                <h3 className='text-base font-semibold text-white icon-sidebar'>Data User</h3>
              </Link>
              <Link
                href="/admin/mobils" prefetch={true}
                className='w-full flex flex-row items-center justify-start gap-3 h-10 menu-sidebar cursor-pointer'>
                <PiCarBold className='text-2xl text-white icon-sidebar' />
                <h3 className='text-base font-semibold text-white icon-sidebar'>Data Mobil</h3>
              </Link>
              <div className='w-full flex flex-row items-center justify-start gap-3 h-10 '>
                <h3 className='text-base font-normal text-slate-400'>Kelola Landing Page</h3>
              </div>
              <Link
                href="/admin/testimonies" prefetch={true}
                className='w-full flex flex-row items-center justify-start gap-3 h-10 menu-sidebar cursor-pointer'>
                <AiOutlineComment className='text-2xl text-white icon-sidebar' />
                <h3 className='text-base font-semibold text-white icon-sidebar'>Testimonials</h3>
              </Link>

            </div>
            <div className='flex flex-col items-center justify-start w-full h-12 gap-4 px-10 '>
              <button type='button' onClick={handleLogout} className='bg-white hover:bg-slate-100 py-2 px-8 rounded-full font-bold text-base cursor-pointer'>Logout</button>

            </div>

          </div>
        </div>

        <div className='w-full md:w-[calc(100%-400px)] h-full'>
          <div className='w-full h-full py-10 md:py-7 px-0 md:pr-7 block bg-slate-50 overflow-x-hidden overflow-y-scroll'>
            <div className='flex flex-col gap-3 relative'>
              <div className='w-full h-5 bg-slate-50'>

              </div>
              <div className='w-full h-20 mb-5 bg-slate-50 sticky top-0 z-15'>
                <div className='flex w-full justify-between flex-row h-full '>
                  <div className='w-full md:w-4/5 h-full px-3'>
                    <div className='w-full h-full bg-white rounded-full overflow-hidden border border-gray-300'>
                      <div className='w-full md:w-[70%] grid grid-cols-4 gap-3 h-full p-3 px-5'>
                        <Link
                          key={'/admin/dashboard'}
                          href="/admin/dashboard"
                          prefetch={true}
                          data-tooltip-id="my-tooltip" data-tooltip-content="Dashboard"
                          className={`h-full cursor-pointer rounded-full grid place-items-center hover-link transition-all hover:bg-black ${path === '/admin/dashboard' ? 'active-link' : ''
                            }`}>
                          <MdOutlineHomeWork className='text-2xl text-black block md:hidden icon-area' />
                          <h2 className='text-black font-bold text-lg hidden md:block'>Home</h2>
                        </Link>

                        <Link
                          key={'/admin/users'}
                          href="/admin/users"
                          prefetch={true}
                          data-tooltip-id="my-tooltip" data-tooltip-content="Data User"
                          className={`h-full cursor-pointer rounded-full grid place-items-center hover-link transition-all hover:bg-black ${path === '/admin/users' ? 'active-link' : ''
                            }`}>
                          <LuUsers className='text-2xl text-black block md:hidden icon-area' />
                          <h2 className='text-black font-bold text-lg hidden md:block'>Users</h2>
                        </Link>

                        <Link
                          key={'/admin/mobils'}
                          href="/admin/mobils"
                          prefetch={true}
                          data-tooltip-id="my-tooltip" data-tooltip-content="Data Mobil"
                          className={`h-full cursor-pointer rounded-full grid place-items-center hover-link transition-all hover:bg-black ${path === '/admin/mobils' ? 'active-link' : ''
                            }`}>
                          <PiCarBold className='text-2xl text-black block md:hidden icon-area' />
                          <h2 className='text-black font-bold text-lg hidden md:block'>Mobil</h2>
                        </Link>

                        <Link
                          key={'/admin/testimonies'}
                          href="/admin/testimonies"
                          prefetch={true}
                          data-tooltip-id="my-tooltip" data-tooltip-content="Data Testimoni"
                          className={`h-full cursor-pointer rounded-full grid place-items-center hover-link transition-all hover:bg-black ${path === '/admin/testimonies' ? 'active-link' : ''
                            }`}>
                          <AiOutlineComment className='text-2xl text-black block md:hidden icon-area' />
                          <h2 className='text-black font-bold text-lg hidden md:block'>Testimoni</h2>
                        </Link>

                      </div>

                    </div>

                  </div>
                  <div className='hidden md:flex w-min flex-row gap-3 justify-end items-center h-full overflow-hidden px-3'>
                    <div className='w-min'>
                      <div
                        data-tooltip-id="my-tooltip" data-tooltip-content="Setting"
                        className='w-14 h-14 bg-white hover:bg-slate-50 rounded-full  grid place-items-center border cursor-pointer border-gray-300'>
                        <IoSettingsOutline className='text-3xl text-black icon-sidebar hover:animate-spin' />
                      </div>
                    </div>

                    <h2 className='w-auto grid place-items-center h-full'>{username}</h2>
                    <div className='w-min'>
                      <div className="w-20 h-20 bg-white rounded-full overflow-hidden border border-gray-300 grid place-items-center cursor-pointer">
                        <img
                          src={profil}
                          alt="profil"
                          className="object-cover w-17 h-17 rounded-full"
                          data-tooltip-id="my-tooltip" data-tooltip-content="Photo Profile"
                        />
                        <Tooltip id="my-tooltip" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className='w-auto h-20  bg-slate-50 fixed top-0 left-0 right-0 md:right-7 z-10'>
                <div className='w-full flex flex-row justify-center items-center h-10 gap-3 px-3 md:px-0'>
                  <h1 className='text-center mt-3 block md:hidden'>{username}</h1>
                  <RiEdit2Fill className='text-2xl mt-2 text-black block md:hidden' />
                </div>
              </div>

              <div className='flex flex-col gap-3 px-3 md:px-0 relative min-h-[calc(100vh-300px)] h-auto'>
                {children}
              </div>
              <div className='w-auto h-18 grid mt-5 mx-3 md:mx-0 place-items-center bg-white rounded-lg '>
                <p className='text-slate-400'>@ Promo Suzuki Alsut</p>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const { cookie } = req.headers;

  const isLoggedIn = cookie?.includes('isLoggedIn=true');

  return {
    redirect: {
      destination: isLoggedIn ? '/admin/dashboard' : '/admin/login',
      permanent: false,
    },
  };
}
