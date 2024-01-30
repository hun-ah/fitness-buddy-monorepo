/* eslint-disable react/prop-types */
import { Card } from 'flowbite-react';

const StatCard = ({ stat }) => {
  const { title, icon, value } = stat;
  return (
    <li className='flex-1'>
      <Card>
        <div className='flex flex-col gap-2'>
          {icon}
          <div className='flex flex-col'>
            <span className='text-gray-500 text-sm block'>{title}</span>
            <span className='font-semibold text-lg block'>{value}</span>
          </div>
        </div>
      </Card>
    </li>
  );
};

export default StatCard;
