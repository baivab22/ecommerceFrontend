import React from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../routing';
export const MyProfile = () => {




  // const {loginData}=useAuth()

  // console.log(loginData,"final login data hai")
  const loginData = useSelector((state: any) => state.login);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Profile</h2>
      <div style={styles.profileItem}>
        <strong>Name:</strong> {loginData?.name && loginData?.name !== "undefined undefined" ? loginData.name : "Not set"}
      </div>
      <div style={styles.profileItem}>
        <strong>Email:</strong> {loginData?.user?.email}
      </div>
      <div style={styles.profileItem}>
        <strong>Role:</strong> {loginData?.userRoles}
      </div>
    </div>
  );
};

// Simple inline styles (replace with CSS or Tailwind if preferred)
const styles = {
  container: {
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#f8f8f8',
    maxWidth: '400px',
    margin: '0 auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
    textAlign: 'center' as React.CSSProperties['textAlign'],
  },
  profileItem: {
    marginBottom: '12px',
    fontSize: '16px',
    color: '#555',
  },
};


