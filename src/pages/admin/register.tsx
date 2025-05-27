import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { useRouter } from 'next/router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hashedPassword = await bcrypt.hash(password, 10);

    const { error } = await supabase
      .from('admins')
      .insert([{ username, password: hashedPassword }]);

    if (!error) {
      router.push('/admin/login');
    } else {
      console.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
}
