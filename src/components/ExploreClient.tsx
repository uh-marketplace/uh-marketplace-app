'use client';

import { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { GeoAltFill } from 'react-bootstrap-icons';
import ItemCard from '@/components/ItemCard';

export default function ExploreClient({ items }: { items: any[] }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);

  const categories = [
    'Electronics', 'Furniture', 'Books', 'Clothing', 'Toys',
    'Sports', 'Tools', 'Automotive', 'Real Estate', 'Miscellaneous',
  ];

  const filteredItems = items.filter((item) => (
    (selectedCategory ? item.category === selectedCategory : true)
      && item.price >= minPrice
      && item.price <= maxPrice
  ));

  return (
    <Container className="py-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="fs-4 fw-bold">Explore Listings</h1>
        <GeoAltFill size={24} color="#555" />
      </div>

      {/* Filter Bar */}
      <Form className="mb-4">
        <Row className="g-2">
          <Col md={4}>
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
          </Col>
          <Col md={2}>
            <Form.Control
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </Col>
        </Row>
      </Form>

      {/* Item Grid */}
      <Row className="g-4">
        {filteredItems.map((item) => (
          <Col key={item.id} xs={12} sm={6} md={4} lg={3}>
            <ItemCard item={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}
