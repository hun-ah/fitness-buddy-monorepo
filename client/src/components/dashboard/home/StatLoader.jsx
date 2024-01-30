import { Card } from 'flowbite-react';

const StatLoader = () => {
  return (
    <li className='flex-1'>
      <Card
        role='status'
        className={`appointmentCard border 'shadow-md' border-gray-200 divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 dark:border-gray-700`}
      >
        <div className='flex flex-col gap-2'>
          <span className='h-4 bg-gray-300 rounded-[6px] dark:bg-gray-700 w-[18px]'></span>
          <span className='h-5 bg-gray-300 rounded-[6px] dark:bg-gray-700 w-[130px]'></span>
          <span className='h-5 bg-gray-300 rounded-[6px] dark:bg-gray-700 w-[30px]'></span>
        </div>
        <span className='sr-only'>Loading...</span>
      </Card>
    </li>
  );
};

export default StatLoader;
