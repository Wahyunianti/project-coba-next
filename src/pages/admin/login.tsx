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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: users, error: dbError } = await supabase
      .from('admins')
      .select('*')
      .eq('username', username)
      .limit(1);

    if (dbError || !users || users.length === 0) {
      setError('Username tidak ditemukan.');
      return;
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      setError('Password salah.');
      return;
    }

    // Pastikan cookie diset dengan path '/'
    Cookies.set('isLoggedIn', 'true', { expires: 1, path: '/' });
    Cookies.set('username', user.username, { path: '/' });

    router.push('/admin/dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}

// Prevent access to login page if already logged in
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
