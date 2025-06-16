import Image from "next/image";
import { useRouter } from 'next/router';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { GetServerSidePropsContext } from 'next';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';


export default function Login() {
   const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: users, error: dbError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (dbError || !users || users.length === 0) {
      setError('Username atau password salah.');
      setLoading(false);
      return;
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      setError('Password salah.');
      setLoading(false);
      return;
    }

    Cookies.set('isLoggedIn', 'true', { expires: 1, path: '/' });
    Cookies.set('username', user.username, { path: '/' });
    Cookies.set('profil', user.profil, { path: '/' });

    router.push('/admin/dashboard');
  };

  return (
    <>
      <div className="box-border p-0 m-0 w-full overflow-hidden ">

        <div className="w-full h-dvh bg-gradient-to-tl from-5% from-[#FFCDC2] to-[#FFFFFF] flex items-center justify-center">
          <div className="z-10 absolute w-full h-full">
            <Image
              src="../waves.svg"
              alt="Background"
              fill
              className="object-cover object-center">
            </Image>
          </div>
          <div className="w-full h-dvh p-0 md:p-5 flex flex-row items-center justify-center z-100">
            <div className="w-1/2 h-auto md:flex flex-col hidden">
              <div className="w-full h-auto p-10">
                <h5 className="text-6xl font-bold text-red-950">Suzuki Alsut</h5>
                <h5 className="text-4xl font-bold mt-2">Admin Panel</h5>
              </div>
              <div className="grid place-items-center w-full h-full">
                <Image
                  src="../mobil.svg"
                  alt="Mobil"
                  width={400}
                  height={400}>
                </Image>
              </div>
            </div>
            <div className="w-full md:w-1/2 px-10 md:px-15 grid place-items-center">
              <div className=" bg-white w-full rounded-xl shadow-md ">
                <div className="p-7 md:p-10">
                  <h1 className="text-2xl font-bold mb-5">Selamat Datang di Admin Panel Suzuki Alsut</h1>
                  <p className="text-gray-600 mb-5">Silakan masuk untuk mengelola data showroom.</p>
                  {error &&
                    <div className="w-full h-auto py-4 border border-red-300 px-3 bg-red-50 grid place-items-center rounded-md">
                      <p className="text-red-600">{error}</p>
                    </div>}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-0 md:px-20 mt-10">
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Username"
                      required
                      className="input-text"
                    />
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="input-text"
                    />
                    <button type="submit" className="button-primary flex flex-row items-center justify-center gap-3">
                      {loading ? 'Loading..' : 'Masuk'}
                      {loading && <span>
                        <svg className="mr-3 -ml-1 size-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" ></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      </span>}
                    </button>
                  </form>
                  <div className="w-full grid place-items-center mt-10">
                    <Image
                      src="/suzuki.png"
                      alt="Suzuki"
                      width={130}
                      height={130}>
                    </Image>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookie = context.req.headers.cookie || '';

  if (cookie.includes('isLoggedIn=true')) {
    return {
      redirect: {
        destination: '/admin/dashboard',
        permanent: false,
      },
    };
  }

  return { props: {} };
}