import AdminLayout from '@/pages/admin/index';



export default function Dashboard() {

  return (
    <AdminLayout>

      <div className='w-full h-60 grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='p-0 md:py-7'>
          <div className='bg-yellow-300 w-full h-full rounded-lg'>

          </div>
        </div>
        <div className='p-0 md:py-7'>

          <div className='bg-red-500 w-full h-full rounded-lg'>

          </div>

        </div>
        <div className='p-0 md:py-7'>

          <div className='bg-blue-500 w-full h-full rounded-lg'>

          </div>

        </div>
        <div className='p-0 md:py-7'>

          <div className='bg-rose-500 w-full h-full rounded-lg'>

          </div>

        </div>

      </div>
      <div className='w-full h-200 flex flex-col relative bg-white rounded-lg border border-gray-300 p-5'>
        <p>Main Layout</p>
        <div className='absolute bottom-5 right-5 flex flex-row items-end gap-7'>

          <img
            src="../Z23b.gif"
            alt="profil"
            className=" w-40 h-40"
          />
        </div>

      </div>

    </AdminLayout>
  );
}

