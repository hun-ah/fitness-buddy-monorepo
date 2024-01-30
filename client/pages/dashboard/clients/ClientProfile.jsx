import { Card, Avatar, Toast, Button } from 'flowbite-react';
import { HiCheck } from 'react-icons/hi2';
import UpdateClientProfile from '@/components/dashboard/clients/UpdateClientProfile';
import { useAppContext as ClientContext } from '@/components/contexts/ClientContext';
import { HiChevronLeft, HiOutlineUpload } from 'react-icons/hi';
import { useParams, Link } from 'react-router-dom';
import {
  formatFirstName,
  formatLastName,
  formatImage,
  processAvatarImage,
} from '@/helpers/helpers';
import { useState } from 'react';
import apiUrl from '@/api';

const ClientProfile = () => {
  const { clientId } = useParams();
  const { clients, setClients } = ClientContext();

  const [saved, setSaved] = useState(false);

  // Render save button after avatar img selection
  const [saveButton, setSaveButton] = useState(false);

  // Show newly chosen avatar img to user
  const [avatarImg, setAvatarImg] = useState('');

  // Img to be sent to database
  const [imgFile, setImgFile] = useState(null);

  // Get client
  const client = clients.find((client) => client._id === clientId);
  const { firstName, lastName, _id } = client;

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();

    if (imgFile) {
      try {
        const circularImageFile = await processAvatarImage(imgFile);

        const formData = new FormData();
        formData.append('image', circularImageFile);
        formData.append('clientId', clientId);

        const res = await fetch(`${apiUrl}/dashboard/updateClientAvatar`, {
          method: 'PUT',
          body: formData,
          credentials: 'include',
        });

        const data = await res.json();

        if (res.status === 200) {
          // Show confirmation button
          setSaved(true);

          const updatedClientIndex = clients.findIndex(
            (client) => client._id === _id
          );

          const updatedClients = [...clients];
          updatedClients[updatedClientIndex] = {
            ...updatedClients[updatedClientIndex],
            avatar: data.imgLink,
          };

          setClients(updatedClients);

          // Show upload button
          setTimeout(() => {
            setSaved(false);
            setSaveButton(false);
          }, 1000);

          // Change avatar img
          setAvatarImg(data.imgLink);
        } else {
          alert('Error uploading image');
        }
      } catch (err) {
        console.log(err);
        alert('Error processing or uploading image');
      }
    }
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      formatImage(file, setAvatarImg);
    }
    setImgFile(file);
    setSaveButton(true);
  };

  return (
    <section className='flex-1 sm:ml-64'>
      {saved && (
        <Toast className='fixed top-2 right-2 z-10'>
          <div className='inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200'>
            <HiCheck className='h-5 w-5' />
          </div>
          <div className='ml-3 text-sm font-normal'>
            Client updated successfully.
          </div>
          <Toast.Toggle onClick={() => setSaved(false)} />
        </Toast>
      )}
      <div className='p-4 h-full bg-gray-100'>
        <Card className='h-fit card max-w-[1300px] sm:mt-0 mt-[70px]'>
          <div className='flex gap-5 items-center'>
            <Link to='/dashboard/clients'>
              <div className='flex justify-center items-center bg-gray-100 rounded h-[30px] w-[30px]'>
                <HiChevronLeft size={22} />
              </div>
            </Link>
            <h1 className='text-4xl font-bold text-gray-900'>
              {formatFirstName(firstName) + ' ' + formatLastName(lastName)}
            </h1>
          </div>
          <div className='flex gap-12 flex-col lg:flex-row'>
            <form className='flex flex-col gap-4 lg:w-[200px]'>
              <Avatar
                img={
                  (avatarImg || client.avatar) && (avatarImg || client.avatar)
                }
                alt='client avatar'
                size='lg'
                rounded
                placeholderInitials={
                  firstName[0].toUpperCase() + lastName[0].toUpperCase()
                }
                className='avatar'
              />
              {saveButton ? (
                <Button
                  color='blue'
                  className='w-full h-[42px]'
                  onClick={async (event) => {
                    const update = await handleAvatarUpdate(event);
                    if (update) setSaveButton(false);
                  }}
                >
                  Save
                </Button>
              ) : (
                <Button color='blue' className='w-full h-[42px] upload'>
                  <label
                    htmlFor='uploadInput'
                    className='cursor-pointer w-full p-2 flex justify-center items-center gap-[6px]'
                  >
                    <HiOutlineUpload size={16} />
                    Upload
                  </label>
                  <input
                    id='uploadInput'
                    type='file'
                    className='hidden'
                    onChange={handleInputChange}
                  />
                </Button>
              )}
            </form>
            <div className='w-full h-full'>
              <UpdateClientProfile client={client} setSaved={setSaved} />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ClientProfile;
