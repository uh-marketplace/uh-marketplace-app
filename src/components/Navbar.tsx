'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Container, Nav, Navbar, Image, Form, Button, FormControl } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg" sticky="top">
      <Container fluid className="px-4 d-flex align-items-center justify-content-between">
        {/* Left: Logo and Brand */}
        <Navbar.Brand as={Link} href="/" className="d-flex align-items-center text-white fw-bold me-3">
          <Image
            src="/raw.png"
            alt="UH Marketplace Logo"
            width="35"
            height="35"
            className="me-2"
          />
          UH Marketplace
        </Navbar.Brand>

        {/* Center: Search Bar */}
        <div className="flex-grow-1 d-flex justify-content-center">
          <Form className="d-flex w-100" style={{ maxWidth: '400px' }} onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search for items..."
              className="me-2"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="light" type="submit">Search</Button>
          </Form>
        </div>

        {/* Right: Nav Links */}
        <Nav className="d-flex align-items-center ms-3">
          <Nav.Link as={Link} href="/profile" className="text-white fw-semibold">
            Profile Page
          </Nav.Link>
          <Nav.Link as={Link} href="/add" className="text-white fw-semibold">
            Add
          </Nav.Link>
          <Nav.Link as={Link} href="/explore" className="text-white fw-semibold">
            Explore
          </Nav.Link>
          <Nav.Link as={Link} href="/favorites" className="text-white fw-semibold">
            Favorites
          </Nav.Link>
          <Nav.Link as={Link} href="/messages" className="text-white fw-semibold">
            Messages
          </Nav.Link>

          {session?.user ? (
            <>
              <Nav.Link as={Link} href="/profile">
                <PersonCircle size={26} className="text-white" />
              </Nav.Link>
              <Button
                variant="outline-light"
                size="sm"
                className="ms-2 fw-semibold"
                onClick={() => signOut()}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Nav.Link as={Link} href="/auth/signin" className="text-white fw-semibold d-flex align-items-center">
              <PersonCircle size={26} className="text-white me-1" />
              Sign In
            </Nav.Link>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
