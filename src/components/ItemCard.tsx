'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { Button, Modal } from 'react-bootstrap';

const ItemCard = ({ item }: { item: any }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = () => setIsFavorited(!isFavorited);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div
      className="position-relative border rounded-lg overflow-hidden shadow-sm
                 hover:shadow-md transition p-2 bg-white"
    >
      {/* Favorite Icon */}
      <button
        type="button"
        onClick={toggleFavorite}
        className="position-absolute top-0 end-0 m-2 bg-white rounded-circle border-0 p-1"
        aria-label="Toggle favorite"
      >
        {isFavorited ? (
          <HeartFill color="red" size={20} />
        ) : (
          <Heart color="gray" size={20} />
        )}
      </button>

      {/* Item Image */}
      <Image
        src={item.imageUrl}
        alt={item.name}
        width={300}
        height={200}
        className="w-100 h-auto object-cover"
      />

      {/* Item Content */}
      <div className="p-2">
        <Button
          variant="primary"
          onClick={handleShow}
          className="fs-6 fw-bold mb-1"
          style={{
            backgroundColor: 'transparent', border: 'none', color: 'inherit', textDecoration: 'none', padding: 0 }}
        >
          {item.name}
        </Button>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{item.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={300}
              height={200}
              className="w-100 h-auto object-cover mb-3"
            />
            <p>{item.description}</p>
            <p className="fw-bold">{item.price}</p>
            <p className="text-secondary">
              {'Condition: '}
              {item.condition}
            </p>
            <p className="text-secondary">
              {'Location: '}
              {item.location}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <p className="fw-normal mb-1">{item.price}</p>
        <h2 className="fs-6 fw-normal mb-1">
          Contact:
          {' '}
          {item.owner}
        </h2>
        <p className="text-secondary mb-1">
          {'Condition: '}
          {item.condition}
        </p>
        <p className="text-secondary small">
          {'Location: '}
          {item.location}
        </p>
      </div>
    </div>
  );
};

export default ItemCard;
