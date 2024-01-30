/* eslint-disable react/prop-types */
import { Avatar, Table } from 'flowbite-react';
import { formatPhoneNumber } from '@/helpers/helpers';
import { useNavigate } from 'react-router-dom';

const ClientRow = ({
  fName,
  lName,
  membershipType,
  status,
  phone,
  email,
  sessions,
  clientId,
  avatar,
}) => {
  const navigate = useNavigate();

  return (
    <Table.Row
      className='hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
      onClick={() => navigate(`/dashboard/clients/${clientId}`)}
    >
      <Table.Cell className='mr-12 flex items-center space-x-4 whitespace-nowrap p-4 lg:mr-0'>
        <Avatar
          className='min-w-[40px]'
          placeholderInitials={fName[0].toUpperCase() + lName[0].toUpperCase()}
          img={avatar}
          rounded
        ></Avatar>
        <div className='font-normal text-gray-900'>
          {fName.split('')[0].toUpperCase() +
            fName.slice(1) +
            ' ' +
            lName
              .toLowerCase()
              .split(/[-\s]/)
              .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
              .join('-')}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div
          data-tooltip-target='tooltip-role-1'
          className={`inline-flex items-center bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded ${
            membershipType === 'premium'
              ? 'dark:bg-primary-900 dark:text-primary-300'
              : 'bg-purple-100 text-purple-900'
          }`}
        >
          {membershipType.charAt(0).toUpperCase() + membershipType.slice(1)}
        </div>
      </Table.Cell>
      <Table.Cell className='whitespace-nowrap p-4 text-gray-900 dark:text-white'>
        <div className='flex items-center'>
          <div
            className={`mr-2 h-2.5 w-2.5 rounded-full ${
              status ? 'bg-green-400' : 'bg-red-600'
            }`}
          ></div>{' '}
          {status ? 'Active' : 'Inactive'}
        </div>
      </Table.Cell>
      <Table.Cell>{formatPhoneNumber(phone)}</Table.Cell>
      <Table.Cell>{email}</Table.Cell>
      <Table.Cell>{sessions}</Table.Cell>
    </Table.Row>
  );
};

export default ClientRow;
