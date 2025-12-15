import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Send, TestTube, BarChart3, History, Mail, CheckCircle, XCircle, AlertCircle, Loader2, Users, TrendingUp, Eye, Code } from 'lucide-react';
import { TextEditor } from 'src/app/common';
import { BASE_URL } from 'src/config';

// const API_BASE_URL = 'http://localhost:8000/api/email';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 16px;
  
  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (min-width: 1024px) {
    grid-column: span 2;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const TabContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

// Mock ReactQuill component for demonstration
const ReactQuill = ({ value, onChange, placeholder }) => {
  return (
    <div style={{
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: 'white'
    }}>
      <div style={{
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        padding: '8px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4px'
      }}>
        <button 
          style={{
            padding: '4px 8px',
            fontSize: '14px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
          onMouseOver={(e:any) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e:any) => e.target.style.backgroundColor = 'transparent'}
          title="Bold"
        >
          B
        </button>
        <button 
          style={{
            padding: '4px 8px',
            fontSize: '14px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
          onMouseOver={(e:any) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e:any) => e.target.style.backgroundColor = 'transparent'}
          title="Italic"
        >
          I
        </button>
        <button 
          style={{
            padding: '4px 8px',
            fontSize: '14px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
          onMouseOver={(e:any) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e:any) => e.target.style.backgroundColor = 'transparent'}
          title="Underline"
        >
          U
        </button>
        <div style={{ 
          borderLeft: '1px solid #d1d5db', 
          margin: '0 4px',
          height: '20px'
        }}></div>
        <button 
          style={{
            padding: '4px 8px',
            fontSize: '14px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
          onMouseOver={(e:any) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e:any) => e.target.style.backgroundColor = 'transparent'}
          title="Link"
        >
          🔗
        </button>
        <button 
          style={{
            padding: '4px 8px',
            fontSize: '14px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
          onMouseOver={(e:any) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e:any) => e.target.style.backgroundColor = 'transparent'}
          title="Image"
        >
          🖼️
        </button>
        <button 
          style={{
            padding: '4px 8px',
            fontSize: '14px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: 'transparent',
            cursor: 'pointer'
          }}
          onMouseOver={(e:any) => e.target.style.backgroundColor = '#e5e7eb'}
          onMouseOut={(e:any) => e.target.style.backgroundColor = 'transparent'}
          title="Code"
        >
          {'</>'}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={12}
        style={{
          width: '100%',
          padding: '16px',
          border: 'none',
          outline: 'none',
          fontFamily: 'monospace',
          fontSize: '14px',
          resize: 'none',
          lineHeight: '1.5'
        }}
      />
    </div>
  );
};

// Text Editor Component
// const TextEditor = ({ descriptionBody, onChange, placeholder }) => {
//   const onTextChange = (content) => {
//     onChange(content);
//   };

//   return (
//     <div>
//       <ReactQuill
//         onChange={onTextChange}
//         value={descriptionBody}
//         placeholder={placeholder}
//       />
//     </div>
//   );
// };

// Notification Component
const Notification = ({ notification, onClose }:any) => {
  if (!notification) return null;

  const getNotificationStyles = () => {
    const baseStyle = {
      marginBottom: '24px',
      padding: '16px',
      borderRadius: '8px',
      borderLeft: '4px solid',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    };

    switch (notification.type) {
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: '#f0fdf4',
          borderColor: '#22c55e'
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: '#fef2f2',
          borderColor: '#ef4444'
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: '#fffbeb',
          borderColor: '#eab308'
        };
      default:
        return baseStyle;
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success': return '#166534';
      case 'error': return '#991b1b';
      case 'warning': return '#854d0e';
      default: return '#374151';
    }
  };

  return (
    <div style={getNotificationStyles()}>
      {notification.type === 'success' && <CheckCircle style={{ width: '20px', height: '20px', color: '#16a34a', flexShrink: 0 }} />}
      {notification.type === 'error' && <XCircle style={{ width: '20px', height: '20px', color: '#dc2626', flexShrink: 0 }} />}
      {notification.type === 'warning' && <AlertCircle style={{ width: '20px', height: '20px', color: '#ca8a04', flexShrink: 0 }} />}
      
      <div style={{ flex: 1 }}>
        <p style={{ 
          fontWeight: '600',
          color: getTextColor(),
          margin: 0,
          marginBottom: notification.details ? '8px' : '0'
        }}>
          {notification.message}
        </p>
        {notification.details && (
          <div style={{ fontSize: '14px', color: '#374151' }}>
            <p style={{ margin: 0 }}>Sent: {notification.details.sent} | Failed: {notification.details.failed}</p>
            {notification.details.errors?.length > 0 && (
              <p style={{ margin: '4px 0 0 0', color: '#dc2626' }}>
                Errors: {notification.details.errors.join(', ')}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '24px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <p style={{ 
          fontSize: '14px',
          fontWeight: '500',
          color: '#6b7280',
          margin: 0
        }}>
          {title}
        </p>
        <p style={{ 
          fontSize: '30px',
          fontWeight: 'bold',
          color: color,
          margin: '4px 0 0 0'
        }}>
          {value || 0}
        </p>
      </div>
      <Icon style={{ 
        width: '48px', 
        height: '48px', 
        color: color,
        opacity: 0.2 
      }} />
    </div>
  </div>
);

// Main Component
export default function EmailMarketingDashboard() {
  const [activeTab, setActiveTab] = useState('compose');
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [campaignHistory, setCampaignHistory] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    subject: '',
    htmlContent: '',
    previewText: '',
    segment: 'all',
    testMode: false,
    testEmails: ''
  });

  // Validation state
  const [validationResults, setValidationResults] = useState(null);

  useEffect(() => {
    if (activeTab === 'statistics') {
      fetchStatistics();
    } else if (activeTab === 'history') {
      fetchCampaignHistory();
    }
  }, [activeTab]);

  const showNotification = (type, message, details = null) => {
    setNotification({ type, message, details });
    setTimeout(() => setNotification(null), 6000);
  };

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/email/statistics`);
      const data = await response.json();
      
      if (data.success) {
        setStatistics(data.data);
      } else {
        showNotification('error', data.message);
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaignHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/email/campaign-history`);
      const data = await response.json();
      
      if (data.success) {
        setCampaignHistory(data.data);
      } else {
        showNotification('error', data.message);
      }
    } catch (error) {
      showNotification('error', 'Failed to fetch campaign history');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      htmlContent: content
    }));
  };

  const validateEmails = async () => {
    const emails = formData.testEmails.split(',').map(e => e.trim()).filter(e => e);
    
    if (emails.length === 0) {
      showNotification('warning', 'Please enter at least one email address');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/email/validate-emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setValidationResults(data.data);
        showNotification('success', `Validated ${data.data.validCount} valid emails`);
      } else {
        showNotification('error', data.message);
      }
    } catch (error) {
      showNotification('error', 'Failed to validate emails');
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    const emails = formData.testEmails.split(',').map(e => e.trim()).filter(e => e);
    
    if (!formData.subject || !formData.htmlContent) {
      showNotification('warning', 'Subject and content are required');
      return;
    }

    if (emails.length === 0) {
      showNotification('warning', 'Please enter at least one test email');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/email/send-test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: formData.subject,
          htmlContent: formData.htmlContent,
          previewText: formData.previewText,
          testEmails: emails
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification('success', data.message, data.data);
      } else {
        showNotification('error', data.message);
      }
    } catch (error) {
      showNotification('error', 'Failed to send test emails');
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async () => {
    if (!formData.subject || !formData.htmlContent) {
      showNotification('warning', 'Subject and content are required');
      return;
    }

    const emails = formData.testEmails.split(',').map(e => e.trim()).filter(e => e);

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/email/send-campaign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: formData.subject,
          htmlContent: formData.htmlContent,
          previewText: formData.previewText,
          segment: formData.segment,
          testMode: formData.testMode,
          testEmails: formData.testMode ? emails : []
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification('success', data.message, data.data);
        setFormData({
          subject: '',
          htmlContent: '',
          previewText: '',
          segment: 'all',
          testMode: false,
          testEmails: ''
        });
        setValidationResults(null);
      } else {
        showNotification('error', data.message);
      }
    } catch (error) {
      showNotification('error', 'Failed to send campaign');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  };

  const buttonStyle = (variant = 'primary', disabled = false) => {
    const baseStyle = {
      width: '100%',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      opacity: disabled ? 0.5 : 1
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: '#3b82f6',
          color: 'white',
          ':hover': disabled ? {} : { backgroundColor: '#2563eb' }
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: '#f3f4f6',
          color: '#374151',
          ':hover': disabled ? {} : { backgroundColor: '#e5e7eb' }
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: '#9333ea',
          color: 'white',
          ':hover': disabled ? {} : { backgroundColor: '#7e22ce' }
        };
      default:
        return baseStyle;
    }
  };

  return (
    <PageContainer>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          {/* <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Mail style={{ width: '32px', height: '32px', color: '#2563eb' }} />
            <h1 style={{ 
              fontSize: '30px', 
              fontWeight: 'bold', 
              color: '#1f2937',
              margin: 0
            }}>
              Email Marketing Dashboard
            </h1>
          </div> */}
          {/* <p style={{ 
            color: '#6b7280',
            margin: 0,
            fontSize: '16px'
          }}>
            Create and send beautiful email campaigns to your users
          </p> */}
        </div>

        {/* Notification */}
        <Notification notification={notification} />

        {/* Tabs */}
        <TabContainer>
          <div style={{ 
            display: 'flex', 
            borderBottom: '1px solid #e5e7eb',
            minWidth: 'min-content'
          }}>
            {[
              { id: 'compose', label: 'Compose Campaign', icon: Send },
              { id: 'statistics', label: 'Statistics', icon: BarChart3 },
              { id: 'history', label: 'History', icon: History }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '16px 24px',
                  fontWeight: '500',
                  fontSize: '14px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  borderBottom: activeTab === tab.id ? '2px solid #2563eb' : '2px solid transparent',
                  color: activeTab === tab.id ? '#2563eb' : '#6b7280',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e:any) => {
                  if (activeTab !== tab.id) {
                    e.target.style.color = '#374151';
                  }
                }}
                onMouseOut={(e:any) => {
                  if (activeTab !== tab.id) {
                    e.target.style.color = '#6b7280';
                  }
                }}
              >
                <tab.icon style={{ width: '20px', height: '20px' }} />
                {tab.label}
              </button>
            ))}
          </div>
        </TabContainer>

        {/* Compose Tab */}
        {activeTab === 'compose' && (
          <MainGrid>
            {/* Left Column - Campaign Details */}
            <LeftColumn>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '24px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 16px 0'
                }}>
                  Campaign Details
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Subject Line */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Subject Line *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter email subject"
                      style={inputStyle as any}
                      onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                  </div>

                  {/* Preview Text */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Preview Text
                    </label>
                    <input
                      type="text"
                      name="previewText"
                      value={formData.previewText}
                      onChange={handleInputChange}
                      placeholder="Text shown in inbox preview"
                      style={inputStyle as any}
                      onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                  </div>

                  {/* Email Content */}
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px'
                    }}>
                      <label style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#374151'
                      }}>
                        Email Content * 
                      </label>
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '14px',
                          color: '#2563eb',
                          border: 'none',
                          backgroundColor: 'transparent',
                          cursor: 'pointer'
                        }}
                        onMouseOver={(e:any) => e.target.style.color = '#1d4ed8'}
                        onMouseOut={(e:any) => e.target.style.color = '#2563eb'}
                      >
                        {showPreview ? <Code style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                        {showPreview ? 'Show Editor' : 'Show Preview'}
                      </button>
                    </div>
                    
                    {!showPreview ? (
                      <TextEditor
                        descriptionBody={formData.htmlContent}
                        onChange={handleEditorChange}
                        placeholder="Enter your email content here... Use the toolbar to format your text, add images, links, and more."
                      />
                    ) : (
                      <div style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '16px',
                        backgroundColor: 'white',
                        minHeight: '400px',
                        overflow: 'auto'
                      }}>
                        <div dangerouslySetInnerHTML={{ __html: formData.htmlContent }} />
                      </div>
                    )}
                    <p style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: '8px 0 0 0'
                    }}>
                      Use the rich text editor to create professional email content with images, links, and formatting
                    </p>
                  </div>

                  {/* User Segment */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      User Segment
                    </label>
                    <select
                      name="segment"
                      value={formData.segment}
                      onChange={handleInputChange}
                      style={{
                        ...inputStyle,
                        cursor: 'pointer'
                      } as any}
                      onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                    >
                      <option value="all">All Users</option>
                      <option value="active">Active Users</option>
                      <option value="inactive">Inactive Users</option>
                      <option value="premium">Premium Users</option>
                    </select>
                  </div>
                </div>
              </div>
            </LeftColumn>

            {/* Right Column - Testing & Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Testing & Validation */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '24px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: '0 0 16px 0'
                }}>
                  Testing & Validation
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Test Mode Toggle */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#dbeafe',
                    borderRadius: '8px'
                  }}>
                    <input
                      type="checkbox"
                      name="testMode"
                      checked={formData.testMode}
                      onChange={handleInputChange}
                      style={{
                        width: '20px',
                        height: '20px',
                        color: '#2563eb',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    />
                    <label style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      cursor: 'pointer'
                    }}>
                      Enable Test Mode
                    </label>
                  </div>

                  {/* Test Emails */}
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      Test Email Addresses
                    </label>
                    <textarea
                      name="testEmails"
                      value={formData.testEmails}
                      onChange={handleInputChange}
                      placeholder="email1@example.com, email2@example.com"
                      rows={3}
                      style={{
                        ...inputStyle,
                        fontSize: '14px',
                        resize: 'vertical'
                      } as any}
                      onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                      onBlur={(e) => e.target.style.boxShadow = 'none'}
                    />
                    <p style={{
                      marginTop: '4px',
                      fontSize: '12px',
                      color: '#6b7280',
                      margin: '4px 0 0 0'
                    }}>
                      Separate multiple emails with commas
                    </p>
                  </div>

                  {/* Validate Emails Button */}
                  <button
                    onClick={validateEmails}
                    disabled={loading || !formData.testEmails}
                    style={buttonStyle('secondary', loading || !formData.testEmails)}
                  >
                    <CheckCircle style={{ width: '16px', height: '16px' }} />
                    Validate Emails
                  </button>

                  {/* Validation Results */}
                  {validationResults && (
                    <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px',
                        backgroundColor: '#f0fdf4',
                        borderRadius: '4px'
                      }}>
                        <span style={{ color: '#166534' }}>Valid</span>
                        <span style={{ fontWeight: '600', color: '#166534' }}>
                          {validationResults.validCount}
                        </span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px',
                        backgroundColor: '#fef2f2',
                        borderRadius: '4px'
                      }}>
                        <span style={{ color: '#dc2626' }}>Invalid</span>
                        <span style={{ fontWeight: '600', color: '#dc2626' }}>
                          {validationResults.invalidCount}
                        </span>
                      </div>
                      {validationResults.invalidEmails?.length > 0 && (
                        <div style={{
                          padding: '8px',
                          backgroundColor: '#fef2f2',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          <p style={{ fontWeight: '500', color: '#dc2626', margin: '0 0 4px 0' }}>
                            Invalid emails:
                          </p>
                          <p style={{ color: '#dc2626', margin: 0 }}>
                            {validationResults.invalidEmails.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Send Test Email Button */}
                  <button
                    onClick={sendTestEmail}
                    disabled={loading || !formData.testEmails || !formData.subject || !formData.htmlContent}
                    style={buttonStyle('success', loading || !formData.testEmails || !formData.subject || !formData.htmlContent)}
                  >
                    {loading ? (
                      <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <TestTube style={{ width: '20px', height: '20px' }} />
                    )}
                    Send Test Email
                  </button>
                </div>
              </div>

              {/* Send Campaign */}
              <div style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                borderRadius: '8px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                padding: '24px',
                color: 'white'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 16px 0'
                }}>
                  Ready to Send?
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#dbeafe',
                  margin: '0 0 16px 0'
                }}>
                  {formData.testMode 
                    ? 'Campaign will be sent to test emails only'
                    : `Campaign will be sent to ${formData.segment} users`}
                </p>
                <button
                  onClick={sendCampaign}
                  disabled={loading || !formData.subject || !formData.htmlContent}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'white',
                    color: '#2563eb',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: loading || !formData.subject || !formData.htmlContent ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    opacity: loading || !formData.subject || !formData.htmlContent ? 0.5 : 1
                  }}
                  onMouseOver={(e:any) => {
                    if (!loading && formData.subject && formData.htmlContent) {
                      e.target.style.backgroundColor = '#dbeafe';
                    }
                  }}
                  onMouseOut={(e:any) => {
                    if (!loading && formData.subject && formData.htmlContent) {
                      e.target.style.backgroundColor = 'white';
                    }
                  }}
                >
                  {loading ? (
                    <Loader2 style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite' }} />
                  ) : (
                    <Send style={{ width: '20px', height: '20px' }} />
                  )}
                  {formData.testMode ? 'Send Test Campaign' : 'Launch Campaign'}
                </button>
              </div>

              {/* Quick Tips */}
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fcd34d',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h4 style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#78350f',
                  margin: '0 0 8px 0'
                }}>
                  💡 Quick Tips
                </h4>
                <ul style={{
                  fontSize: '12px',
                  color: '#78350f',
                  margin: 0,
                  paddingLeft: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <li>Always send a test email before launching</li>
                  <li>Use preview text to increase open rates</li>
                  <li>Keep subject lines under 50 characters</li>
                  <li>Test on mobile devices</li>
                </ul>
              </div>
            </div>
          </MainGrid>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {loading ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px'
              }}>
                <Loader2 style={{
                  width: '32px',
                  height: '32px',
                  color: '#2563eb',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : statistics ? (
              <>
                {/* Stats Grid */}
                <StatsGrid>
                  <StatCard
                    title="Total Users"
                    value={statistics.totalUsers}
                    icon={Users}
                    color="#1f2937"
                  />
                  <StatCard
                    title="Active Users"
                    value={statistics.activeUsers}
                    icon={TrendingUp}
                    color="#16a34a"
                  />
                  <StatCard
                    title="Premium Users"
                    value={statistics.premiumUsers}
                    icon={CheckCircle}
                    color="#9333ea"
                  />
                </StatsGrid>

                {/* Segment Breakdown */}
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  padding: '24px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0 0 16px 0'
                  }}>
                    Segment Breakdown
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {statistics.segments && Object.entries(statistics.segments).map(([key, value]) => (
                      <div key={key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '8px'
                      }}>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          textTransform: 'capitalize'
                        }}>
                          {key}
                        </span>
                        <span style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#1f2937'
                        }}>
                          {value as any} users
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                padding: '48px',
                textAlign: 'center'
              }}>
                <BarChart3 style={{
                  width: '64px',
                  height: '64px',
                  color: '#d1d5db',
                  margin: '0 auto 16px'
                }} />
                <p style={{ color: '#6b7280', margin: 0 }}>
                  No statistics available
                </p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden'
          }}>
            {loading ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px'
              }}>
                <Loader2 style={{
                  width: '32px',
                  height: '32px',
                  color: '#2563eb',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : campaignHistory.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th style={{
                        padding: '12px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Subject
                      </th>
                      <th style={{
                        padding: '12px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Segment
                      </th>
                      <th style={{
                        padding: '12px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Sent
                      </th>
                      <th style={{
                        padding: '12px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Failed
                      </th>
                      <th style={{
                        padding: '12px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Date
                      </th>
                      <th style={{
                        padding: '12px 24px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderBottom: '1px solid #e5e7eb'
                      }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaignHistory.map((campaign) => (
                      <tr 
                        key={campaign.id}
                        style={{
                          transition: 'background-color 0.2s',
                          borderBottom: '1px solid #e5e7eb'
                        }}
                        onMouseOver={(e:any) => e.target.parentElement.style.backgroundColor = '#f8fafc'}
                        onMouseOut={(e:any) => e.target.parentElement.style.backgroundColor = 'transparent'}
                      >
                        <td style={{
                          padding: '16px 24px',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#1f2937'
                        }}>
                          {campaign.subject}
                        </td>
                        <td style={{
                          padding: '16px 24px',
                          fontSize: '14px',
                          color: '#6b7280',
                          textTransform: 'capitalize'
                        }}>
                          {campaign.segment}
                        </td>
                        <td style={{
                          padding: '16px 24px',
                          fontSize: '14px',
                          color: '#16a34a',
                          fontWeight: '600'
                        }}>
                          {campaign.sent}
                        </td>
                        <td style={{
                          padding: '16px 24px',
                          fontSize: '14px',
                          color: '#dc2626',
                          fontWeight: '600'
                        }}>
                          {campaign.failed}
                        </td>
                        <td style={{
                          padding: '16px 24px',
                          fontSize: '14px',
                          color: '#6b7280'
                        }}>
                          {new Date(campaign.sentAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: campaign.status === 'completed' ? '#dcfce7' : '#fef3c7',
                            color: campaign.status === 'completed' ? '#166534' : '#92400e'
                          }}>
                            {campaign.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '48px', textAlign: 'center' }}>
                <History style={{
                  width: '64px',
                  height: '64px',
                  color: '#d1d5db',
                  margin: '0 auto 16px'
                }} />
                <p style={{ color: '#6b7280', margin: 0 }}>
                  No campaign history available
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      </PageContainer>
  );
}