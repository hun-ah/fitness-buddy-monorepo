import { useState } from 'react';
import { Card, Avatar, Button, Toast } from 'flowbite-react';
import { useAppContext as UserContext } from '@/components/contexts/UserContext';
import { HiOutlineUpload } from 'react-icons/hi';
import { HiCheck } from 'react-icons/hi2';
import UpdateProfile from '@/components/dashboard/profile/UpdateProfile';
import { formatImage, processAvatarImage } from '@/helpers/helpers';
import apiUrl from '@/api';

const Profile = () => {
  const { user, setUser } = UserContext();

  // Show newly chosen avatar img to user
  const [avatarImg, setAvatarImg] = useState('');

  // Render save button after avatar img selection
  const [saveButton, setSaveButton] = useState(false);

  // Img to be sent to database
  const [imgFile, setImgFile] = useState(null);

  // To show user if changes saved after profile update
  const [saved, setSaved] = useState(false);

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();

    if (imgFile) {
      try {
        const circularImageFile = await processAvatarImage(imgFile);

        const formData = new FormData();
        formData.append('image', circularImageFile);

        const res = await fetch(`${apiUrl}/dashboard/updateAvatar`, {
          method: 'PUT',
          body: formData,
          credentials: 'include',
        });

        const data = await res.json();

        if (res.status === 200) {
          // Show confirmation button
          setSaved(true);

          // Show upload button
          setTimeout(() => {
            setSaved(false);
            setSaveButton(false);
          }, 1000);

          // Change user img link
          setUser((prevState) => ({
            ...prevState,
            avatar: data.imgLink,
          }));

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
          <div className='ml-3 text-sm font-normal'>Update successful.</div>
          <Toast.Toggle onClick={() => setSaved(false)} />
        </Toast>
      )}
      <div className='p-4 h-full bg-gray-100 sm:mt-0 mt-[70px]'>
        <Card className='h-fit card max-w-[1300px]'>
          <div>
            <h1 className='text-4xl font-bold text-gray-900'>Profile</h1>
          </div>
          <div className='flex gap-12 flex-col lg:flex-row'>
            <form className='flex flex-col gap-4 lg:w-[200px]'>
              <Avatar
                img={(avatarImg || user.avatar) && (avatarImg || user.avatar)}
                alt='user avatar'
                size='lg'
                rounded
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
              <UpdateProfile setSaved={setSaved} />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Profile;
