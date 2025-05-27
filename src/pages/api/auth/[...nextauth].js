import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { data: user, error } = await supabase
          .from('admins')
          .select('*')
          .eq('username', credentials.username)
          .single();

        if (error || !user) return null;

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) return null;

        return { id: user.id, name: user.username };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  }
};

export default NextAuth(authOptions);
