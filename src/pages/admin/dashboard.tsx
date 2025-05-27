import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { GetServerSidePropsContext } from 'next';

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('isLoggedIn');
    router.push('/admin/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Selamat datang, admin!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export async function getServerSideProps(context : GetServerSidePropsContext) {
  const { cookie } = context.req.headers;

  if (!cookie?.includes('isLoggedIn=true')) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
