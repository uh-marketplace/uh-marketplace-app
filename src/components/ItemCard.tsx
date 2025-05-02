'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart, HeartFill } from 'react-bootstrap-icons';

type ItemCardProps = {
  item: any;
  initialFavorited: boolean;
  onUnfavorite?: () => void;
};

const ItemCard = ({ item, initialFavorited = false, onUnfavorite }: ItemCardProps) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  useEffect(() => {
    setIsFavorited(initialFavorited);
  }, [initialFavorited]);

  const toggleFavorite = async () => {
    const newState = !isFavorited;
    setIsFavorited(newState);

    try {
      await fetch('/api/favorite', {
        method: newState ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      });

      if (!newState && onUnfavorite) {
        onUnfavorite();
      }
    } catch (err) {
      console.error('Favorite update failed:', err);
      setIsFavorited(!newState);
    }
  };

  return (
    <div
      className="position-relative border rounded-lg overflow-hidden shadow-sm
      hover:shadow-md transition p-2 bg-white"
    >
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

      <Image
        src={item.imageUrl}
        alt={item.name}
        width={300}
        height={200}
        className="w-100 h-auto object-cover"
      />

      <div className="p-2">
        <h2 className="fs-6 fw-normal mb-1">{item.name}</h2>
        <p className="fw-bold mb-1">{item.price}</p>
        <h2 className="fs-6 fw-normal mb-1">
          Contact:
          {item.owner}
        </h2>
        <p className="text-secondary mb-1">{item.condition}</p>
        <p className="text-secondary small">{item.location}</p>
      </div>
    </div>
  );
};

ItemCard.defaultProps = {
  onUnfavorite: () => {},
};

export default ItemCard;
