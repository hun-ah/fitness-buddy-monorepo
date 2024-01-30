import { Card } from 'flowbite-react';
import { Link } from 'react-router-dom';

const NotFoundDashboard = () => {
  return (
    <section className='flex-1 sm:ml-64'>
      <div className='p-4 h-full bg-gray-100'>
        <Card className='h-fit card max-w-[1300px]'>
          <div className='flex gap-12 flex-col lg:flex-row'>
            <div className='py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12'>
              <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-blue-700 dark:text-primary-500'>
                404
              </h1>
              <p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
                Something&apos;s missing.
              </p>
              <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
                Sorry, we can&apos;t find that page.
              </p>
              <Link
                to={{ pathname: '/dashboard/home' }}
                className='inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900'
              >
                Back to Home
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default NotFoundDashboard;
