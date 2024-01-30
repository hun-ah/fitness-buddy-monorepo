import { useState } from 'react';
import { Card, Button, TextInput, Toast } from 'flowbite-react';
import { HiOutlinePlus, HiCheck, HiMagnifyingGlass } from 'react-icons/hi2';
import { useAppContext as ClientContext } from '@/components/contexts/ClientContext';
import ClientTable from '@/components/dashboard/clients/ClientTable';
import AddClient from '@/components/dashboard/clients/AddClient';

const Clients = () => {
  const [isOpen, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { clients } = ClientContext();

  // Filter clients
  const filteredClients =
    clients &&
    clients.filter((client) =>
      (
        client.firstName.toLowerCase() +
        ' ' +
        client.lastName.toLowerCase()
      ).includes(searchTerm.toLowerCase())
    );

  const showFilteredClients = searchTerm !== '' && filteredClients.length === 0;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <section className='flex-1 sm:ml-64'>
      {saved && (
        <Toast className='fixed top-2 right-2 z-10'>
          <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'>
            <HiCheck className='h-5 w-5' />
          </div>
          <div className='ml-3 text-sm font-normal'>
            Client added successfully.
          </div>
          <Toast.Toggle onClick={() => setSaved(false)} />
        </Toast>
      )}
      <div className='p-4 h-full bg-gray-100 sm:mt-0 mt-[70px]'>
        <Card className='h-fit card max-w-[1300px]'>
          <div>
            <h1 className='text-4xl font-bold text-gray-900'>Clients</h1>
          </div>
          <div className='flex flex-col gap-4 lg:flex-row lg:justify-between'>
            <div className='flex relative'>
              <TextInput
                type='search'
                className='remove-round w-full md:w-fit textInput'
                placeholder='Search clients'
                value={searchTerm}
                onChange={() => {
                  handleSearch(event);
                }}
              />
              <HiMagnifyingGlass
                className='absolute top-[12px] left-[10px]'
                fill='#6b7280'
                size={18}
              />
            </div>
            <Button
              color='blue'
              className='max-w-[137px]'
              onClick={() => setOpen(true)}
            >
              <HiOutlinePlus size={20} className='mr-[6px]' />
              New client
            </Button>
          </div>
          {clients.length === 0 ? (
            <div className='w-full flex justify-center'>
              <p>No clients available</p>
            </div>
          ) : showFilteredClients ? (
            <div className='w-full flex justify-center'>
              <p>No clients match your search</p>
            </div>
          ) : (
            <ClientTable
              clients={searchTerm !== '' ? filteredClients : clients}
            />
          )}
          <AddClient setOpen={setOpen} isOpen={isOpen} setSaved={setSaved} />
        </Card>
      </div>
    </section>
  );
};

export default Clients;
