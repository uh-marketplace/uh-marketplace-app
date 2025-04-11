'use client';

import Link from 'next/link';
import { Container, Navbar, Nav } from 'react-bootstrap';
import Image from 'next/image';
import { PersonCircle, HouseDoor, People, PlayBtn, Shop, Controller, Search } from 'react-bootstrap-icons';

const TopMenu = () => (
  <Navbar bg="success" variant="dark" expand="lg" className="py-3 position-relative">
    <Container>

      {/* Left Logo */}
      <Link href="/">
        <Image src="/raw.png" alt="UH Marketplace Logo" width={70} height={70} />
      </Link>
      <div className="bg-white rounded-circle p-2" style={{ cursor: 'pointer', border: '1px solid #ccc' }}>
        <Search size={18} color="#333" strokeWidth={2} />
      </div>

      {/* Middle Icon Group */}
      <div className="position-absolute top-50 start-50 translate-middle-x d-flex gap-4">
        <HouseDoor size={24} color="white" />
        <People size={24} color="white" />
        <PlayBtn size={24} color="white" />
        <Shop size={24} color="white" />
        <Controller size={24} color="white" />
      </div>

      {/* Right Nav */}
      <Nav className="ms-auto">
        <Link href="/favorites" className="nav-link text-white">Favorites</Link>
        <Link href="/login" className="nav-link text-white">Login</Link>
        <Link href="/messages" className="nav-link text-white">Messages</Link>
        <Link href="/profile" className="nav-link text-white">
          <PersonCircle size={24} />
        </Link>
      </Nav>

    </Container>
  </Navbar>
);

export default TopMenu;
