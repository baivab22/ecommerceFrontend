import React from 'react';
import { useSelector } from 'src/store';
import { useAuth } from '../routing';

export const MyProfile = () => {
  const data = useSelector((state: any) => state.Login);


  const {loginData}=useAuth()
  console.log(data, "payload in login slice login page");

  const profileData = {
    name: loginData?.user?.name && loginData?.user?.name !== "undefined undefined" 
      ? loginData?.user?.name 
      : "Not set",
    email: loginData?.user?.email || "user123@gmail.com",
    role: loginData?.userRoles || "User"
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.cardContainer}>
        {/* Profile Card */}
        <div style={styles.card}>
          {/* Header Section */}
          <div style={styles.header}>
            <div style={styles.avatarCircle}>
              <svg 
                style={styles.avatarIcon}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </div>
            <h1 style={styles.headerName}>
              {profileData.name}
            </h1>
            <p style={styles.headerRole}>
              {profileData.role}
            </p>
          </div>

          {/* Profile Details Section */}
          <div style={styles.detailsSection}>
            <h2 style={styles.sectionTitle}>
              Profile Information
            </h2>

            {/* Name Field */}
            <div style={styles.fieldContainer}>
              <label style={styles.fieldLabel}>
                Full Name
              </label>
              <p style={styles.fieldValue}>
                {profileData.name}
              </p>
            </div>

            {/* Email Field */}
            <div style={styles.fieldContainer}>
              <label style={styles.fieldLabel}>
                Email Address
              </label>
              <div style={styles.fieldWithIcon}>
                <svg 
                  style={styles.fieldIcon}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
                <p style={styles.fieldValue}>
                  {profileData.email}
                </p>
              </div>
            </div>

            {/* Role Field */}
            <div style={styles.fieldContainerLast}>
              <label style={styles.fieldLabel}>
                User Role
              </label>
              <div style={styles.fieldWithIcon}>
                <svg 
                  style={styles.fieldIcon}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                  />
                </svg>
                <span style={styles.roleBadge}>
                  {profileData.role}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          {/* <div style={styles.footer}>
            <button style={styles.editButton}>
              Edit Profile
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
    padding: '48px 16px',
  },
  cardContainer: {
    maxWidth: '672px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
  },
  header: {
    background:'rgba(252,231,238)',
    padding: '24px 16px',
    textAlign: 'center' as const,
  },
  avatarCircle: {
    width: '96px',
    height: '96px',
    margin: '0 auto 16px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  avatarIcon: {
    width: '48px',
    height: '48px',
    color: '#2563eb',
  },
  headerName: {
    fontSize: '30px',
    fontWeight: '700',
    color: 'black',
    marginBottom: '8px',
    margin: '0 0 8px 0',
  },
  headerRole: {
    color: 'black',
    fontSize: '14px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: 0,
  },
  detailsSection: {
    padding: '32px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '24px',
    marginTop: 0,
  },
  fieldContainer: {
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '16px',
    marginBottom: '24px',
  },
  fieldContainerLast: {
    paddingBottom: '16px',
  },
  fieldLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: '8px',
  },
  fieldValue: {
    fontSize: '18px',
    color: '#111827',
    fontWeight: '500',
    margin: 0,
  },
  fieldWithIcon: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  fieldIcon: {
    width: '20px',
    height: '20px',
    color: '#9ca3af',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#dbeafe',
    color: '#1e40af',
  },
  footer: {
    padding: '24px 32px',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
  },
  editButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    color: '#ffffff',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
  },
};