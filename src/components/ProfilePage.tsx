import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Add interfaces for our data types
interface UserProfile {
  name: string;
  email: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  image: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [postedItems, setPostedItems] = useState<Item[]>([]);
  const [favorites, setFavorites] = useState<Item[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPostedItems = async () => {
    try {
      const response = await fetch('/api/posts/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPostedItems(data);
    } catch (error) {
      console.error('Error fetching posted items:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/user/favorites');
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchPostedItems();
    fetchFavorites();
  }, []);

  const editPost = () => {
    console.log('Edit post clicked');
  };

  const deletePost = () => {
    console.log('Delete post clicked');
  };

  const ItemCard: React.FC<Item> = ({ title, description, image }) => (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px',
      backgroundColor: 'white',
    }}
    >
      <img src={image} alt={title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );

  return (
    <>
      <style jsx>
        {`
        * { box-sizing: border-box; }
        .container { max-width: 1000px; margin: 0 auto; padding: 2rem 1rem; font-family: Arial, sans-serif; }
        .profile-banner { background-color: #00664b; color: white; padding: 2rem; display: flex; align-items: center; gap: 1.5rem; border-radius: 10px; }
        .profile-details h2 { margin: 0; }
        section { margin-top: 2rem; padding: 1.5rem; background-color: #f9f9f9; border-radius: 10px; }
        h3 { margin-bottom: 1rem; color: #333; }
        .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
        .item-card { background: white; border: 1px solid #ccc; border-radius: 8px; padding: 1rem; text-align: center; }
        .manage-buttons { display: flex; gap: 1rem; flex-wrap: wrap; }
        button { background-color: #007bff; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 6px; cursor: pointer; }
        button:hover { background-color: #0056b3; }
      `}
      </style>
      <div className="container">
        <div className="profile-banner">
          <Image src="/images/default-avatar.png" alt="User Avatar" width={100} height={100} style={{ borderRadius: '50%', objectFit: 'cover' }} />
          <div className="profile-details">
            <h2>{profile?.name || 'John Doe'}</h2>
            <p>
              Email:
              {profile?.email || 'john.doe@hawaii.edu'}
            </p>
          </div>
        </div>
        <section>
          <h3>About</h3>
          <p>
            Hi! I'm
            {profile?.name.split(' ')[0]}
            {' '}
            and I love trading cool stuff on UH Marketplace. Looking for school supplies, dorm furniture, and tech gadgets.
          </p>
        </section>
        <section className="posted-items">
          <h2>Your Posts</h2>
          <div className="items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' }}>
            {postedItems.length > 0 ? (
              postedItems.map(item => (
                <div
                  key={item.id}
                  className="post-card"
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <img
                    src={item.image || '/placeholder-image.jpg'}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                    }}
                  />
                  <h3 style={{ margin: '10px 0' }}>{item.title}</h3>
                  <p style={{ color: '#666' }}>{item.description}</p>
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => editPost()}
                      style={{
                        backgroundColor: '#00664B',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        marginRight: '10px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost()}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                <p>No posts yet. Create your first post!</p>
              </div>
            )}
          </div>
        </section>
        <section>
          <h3>Favorites</h3>
          <div className="items-grid">
            {favorites.map(item => (
              <ItemCard key={item.id} {...item} />
            ))}
          </div>
        </section>
        <section>
          <h3>Manage Your Posts</h3>
          <div className="manage-buttons">
            <button type="button" onClick={editPost}>Edit Post</button>
            <button type="button" onClick={deletePost}>Delete Post</button>
          </div>
        </section>
      </div>
    </>
  );
};

export default ProfilePage;
