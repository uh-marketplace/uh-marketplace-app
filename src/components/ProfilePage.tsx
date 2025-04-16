'use client';

import React from 'react';

const ProfilePage: React.FC = () => {
  const editPost = () => {
    console.log('Edit post clicked');
    // Implement functionality or navigate
  };

  const deletePost = () => {
    console.log('Delete post clicked');
    // Implement functionality or navigate
  };

  return (
    <>
      <style jsx>{`
        body, html {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
        }
        .navbar {
          background-color: #00664B;
          color: white;
          padding: 10px 20px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar img {
          height: 100px;
        }
        .container {
          width: 80%;
          margin: 0 auto;
          padding: 20px;
        }
        .profile-info, .posted-items, .favorites, .manage-posts {
          margin-top: 20px;
          padding: 20px;
          background-color: #f4f4f4;
          border-radius: 8px;
        }
        .profile-info p, .posted-items h2, .favorites h2, .manage-posts h2 {
          color: #333;
        }
        .items-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-top: 20px;
        }
        .items-grid div {
          background: #ddd;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
        }
        button {
          background-color: #007BFF;
          color: white;
          border: none;
          padding: 10px 20px;
          margin: 5px;
          border-radius: 5px;
          cursor: pointer;
        }
        button:hover {
          background-color: #0056b3;
        }
      `}</style>
      <div className="navbar">
        <img src="images/raw.png" alt="Logo" />
        <h1>User Profile</h1>
      </div>
      <div className="container">
        <section className="profile-info">
          <h2>Details</h2>
          <p>Name: <span id="userName">John Doe</span></p>
          <p>Email: <span id="userEmail">john.doe@hawaii.edu</span></p>
        </section>
        <section className="posted-items">
          <h2>Posted Items</h2>
          <div className="items-grid">
            {/* Dynamically generated items will go here */}
          </div>
        </section>
        <section className="favorites">
          <h2>Favorites</h2>
          <div className="items-grid">
            {/* Dynamically generated favorite items will go here */}
          </div>
        </section>
        <section className="manage-posts">
          <h2>Manage Your Posts</h2>
          <button onClick={editPost}>Edit Post</button>
          <button onClick={deletePost}>Delete Post</button>
        </section>
      </div>
    </>
  );
};

export default ProfilePage;
