import { Col, Container } from 'react-bootstrap';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
const Footer = () => (
  <footer className="mt-auto py-3" style={{ backgroundColor: '#00664B' }}>
    <Container>
      <Col className="text-center text-white">
        © 2025 UH Marketplace | Made with aloha by Rainbow Warriors
        <br />
        <a href="https://github.com/uh-marketplace/uh-marketplace-app" className="text-white">View on Github</a>
      </Col>
    </Container>
  </footer>
);

export default Footer;
