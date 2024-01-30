import { Card } from 'flowbite-react';

const SkeletonCard = () => {
  return (
    <Card
      role='status'
      className={`appointmentCard border 'shadow-md' border-gray-200 divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 dark:border-gray-700`}
    >
      <div className='flex flex-wrap justify-between w-full p-1 gap-4'>
        <div className='w-fit flex items-center'>
          <div className='w-[150px] h-4 bg-gray-200 rounded-[4px]'></div>
        </div>
        <div className='w-fit '>
          <div className='flex gap-3 items-center flex-2'>
            <div className='h-7 bg-gray-300 rounded-full dark:bg-gray-600 w-7'></div>
            <div className='h-4 bg-gray-300 rounded-[4px] dark:bg-gray-700 w-[140px]'></div>
          </div>
        </div>
        <div className='lg:w-fit sm:w-full lg:justify-end flex justify-between'>
          <div className='flex gap-2'>
            <div className='h-8 bg-gray-300 rounded-[10px] dark:bg-gray-700 w-[88px]'></div>
            <div className='h-8 bg-gray-300 rounded-[10px] dark:bg-gray-700 w-[88px]'></div>
            <div className='h-8 bg-gray-300 rounded-[10px] dark:bg-gray-700 w-8'></div>
          </div>
        </div>
      </div>
      <span className='sr-only'>Loading...</span>
    </Card>
  );
};

export default SkeletonCard;
