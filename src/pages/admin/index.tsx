import { GetServerSidePropsContext } from 'next';

export default function AdminIndexRedirect() {
  return null;
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
