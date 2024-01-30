import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className='bg-white dark:bg-gray-900 flex flex-1 items-center'>
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
          to={{ pathname: '/' }}
          className='inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900'
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
