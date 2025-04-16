'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Container, Nav, Navbar, Image, Form, Button, FormControl } from 'react-bootstrap';
import { PersonCircle } from 'react-bootstrap-icons';

const NavBar: React.FC = () => {
  const { data: session } = useSession();

  return (
    <Navbar bg="success" variant="dark" expand="lg" sticky="top">
      <Container fluid className="px-4 d-flex align-items-center justify-content-between">
        {/* Left: Logo and Brand */}
        <div className="d-flex align-items-center">
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
        </div>

        {/* Center: Search Bar */}
        <div className="flex-grow-1 d-flex justify-content-center">
          <Form className="d-flex w-100" style={{ maxWidth: '400px' }}>
            <FormControl
              type="search"
              placeholder="Search for items..."
              className="me-2"
              aria-label="Search"
            />
            <Button variant="light" type="submit">Search</Button>
          </Form>
        </div>

        {/* Right: Nav Links */}
        <Nav className="d-flex align-items-center ms-3">
          {/* NEW: Profile Page text link, always visible */}
          <Nav.Link as={Link} href="/profile" className="text-white fw-semibold">
            Profile Page
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
            <Nav.Link as={Link} href="/profile">
              <PersonCircle size={26} className="text-white" />
            </Nav.Link>
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
