'use client';

import { GeoAltFill } from 'react-bootstrap-icons';
import { Container, Row, Col } from 'react-bootstrap';
import TopMenu from '@/components/TopMenu';
import ItemCard from '@/components/ItemCard';

const items = [
  { id: 1, title: 'item 1', price: '$4,400', location: 'Honolulu, HI', imageUrl: '' },
  { id: 2, title: 'item 2', price: '$1,000', location: 'Honolulu, HI', imageUrl: '' },
  { id: 3, title: 'item 3', price: '$500', location: 'Honolulu, HI', imageUrl: '' },
  { id: 4, title: 'item 4', price: '$1,500', location: 'Honolulu, HI', imageUrl: '' },
  { id: 5, title: 'item 5', price: '$2,500', location: 'Kaneohe, HI', imageUrl: '' },
  { id: 6, title: 'item 6', price: '$20', location: 'Kaneohe, HI', imageUrl: '' },
  { id: 7, title: 'item 7', price: '$10', location: 'Honolulu, HI', imageUrl: '' },
  { id: 8, title: 'item 8', price: '$10', location: 'Honolulu, HI', imageUrl: '' },
];

const ExplorePage = () => (
  <>
    <TopMenu />
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fs-4 fw-bold m-0">Today&apos;s Picks</h1>
        <GeoAltFill size={28} color="#555" />
      </div>
      <Row className="g-4">
        {items.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
            <ItemCard item={item} />
          </Col>
        ))}
      </Row>
    </Container>
  </>
);

export default ExplorePage;
