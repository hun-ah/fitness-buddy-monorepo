import Logo from '@/assets/logo.svg?react';
import { Link } from 'react-router-dom';
import { Navbar } from 'flowbite-react';

const Nav = () => {
  return (
    <Navbar fluid rounded className='fixed w-full p-4 z-10'>
      <Navbar.Brand as={Link} to={{ pathname: '/' }}>
        <Logo height={33} width={200} />
      </Navbar.Brand>
      <Navbar.Toggle className='p-0' />
      <Navbar.Collapse>
        <Navbar.Link
          as={Link}
          to={{ pathname: '/register' }}
          className='md:hover:text-blue-700'
        >
          Register
        </Navbar.Link>
        <Navbar.Link
          as={Link}
          to={{ pathname: '/login' }}
          className='md:hover:text-blue-700'
        >
          Log in
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;
