/* eslint-disable react/prop-types */
import ClientRow from './ClientRow';
import { Table } from 'flowbite-react';

const ClientTable = ({ clients }) => {
  const sortedClients = [...clients].sort((a, b) => {
    const lastNameA = a.lastName.toLowerCase();
    const lastNameB = b.lastName.toLowerCase();

    if (lastNameA < lastNameB) {
      return -1;
    }
    if (lastNameA > lastNameB) {
      return 1;
    }
    return 0;
  });

  return (
    <div className='flex flex-col overflow-x-scroll xl:overflow-x-hidden w-full'>
      <Table className='min-w-full divide-y divide-gray-200 dark:divide-gray-600 '>
        <Table.Head className='bg-gray-100 dark:bg-gray-700'>
          <Table.HeadCell>Client Name</Table.HeadCell>
          <Table.HeadCell>Membership Type</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Phone Number</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Sessions</Table.HeadCell>
        </Table.Head>
        <Table.Body className='divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800'>
          {sortedClients.map((client) => (
            <ClientRow
              key={client._id}
              fName={client.firstName}
              lName={client.lastName}
              membershipType={client.membershipType}
              status={client.active}
              phone={client.phone}
              email={client.email}
              sessions={client.sessions}
              clientId={client._id}
              avatar={client.avatar}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ClientTable;
