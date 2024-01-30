/* eslint-disable react/no-unknown-property */
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className='bg-white dark:bg-gray-900 flex flex-1 items-center'>
      <div className='py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12'>
        <h1 className='mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white'>
          Your number one fitness tracking friend
        </h1>
        <p className='mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400'>
          We keep track of your client&apos;s, so you don&apos;t have to. Log
          workouts, client info and appointments all in one place.
        </p>
        <div className='flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4'>
          <Link
            to={{ pathname: '/register' }}
            className='inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900'
          >
            Register
          </Link>
          <Link
            to={{ pathname: '/login' }}
            className='inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800'
          >
            Log in
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
