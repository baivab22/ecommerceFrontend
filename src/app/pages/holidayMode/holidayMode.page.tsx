import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { 
  clearMessages, 
  fetchHolidayModeAction, 
  selectHolidayMode, 
  selectHolidayModeError, 
  selectHolidayModeLoading, 
  selectHolidayModeSuccess, 
  toggleHolidayModeAction, 
  updateHolidayModeAction 
} from './holidayMode.slice';

const HolidayModePage = () => {
  const dispatch = useDispatch();
  
  const settings = useSelector(selectHolidayMode);
  const loading = useSelector(selectHolidayModeLoading);
  const error = useSelector(selectHolidayModeError);
  const success = useSelector(selectHolidayModeSuccess);

  const [formData, setFormData] = useState({
    message: '',
    startDate: '',
    endDate: '',
    allowBrowsing: true,
    allowOrders: false
  });

  const [dateErrors, setDateErrors] = useState({
    startDate: '',
    endDate: ''
  });

  // Fetch initial settings
  useEffect(() => {
    dispatch(fetchHolidayModeAction({
      onSuccess: (data) => {
        console.log('Holiday mode settings fetched:', data);
      }
    }));
  }, [dispatch]);

  // Populate form when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        message: settings.message || '',
        startDate: settings.startDate ? formatDateForInput(settings.startDate) : '',
        endDate: settings.endDate ? formatDateForInput(settings.endDate) : '',
        allowBrowsing: settings.allowBrowsing ?? true,
        allowOrders: settings.allowOrders ?? false
      });
    }
  }, [settings]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  // Format date from ISO string to YYYY-MM-DD
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Validate date format (YYYY-MM-DD)
  const validateDate = (dateString) => {
    if (!dateString) return true; // Empty is valid
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }
    
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Check if date is valid
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && 
           date.getMonth() === month - 1 && 
           date.getDate() === day;
  };

  const handleToggle = () => {
    dispatch(toggleHolidayModeAction({
      onSuccess: (data) => {
        console.log('Holiday mode toggled:', data);
      }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));

      // Validate date fields in real-time
      if (name === 'startDate' || name === 'endDate') {
        if (value && !validateDate(value)) {
          setDateErrors(prev => ({
            ...prev,
            [name]: 'Invalid date format. Use YYYY-MM-DD'
          }));
        } else {
          setDateErrors(prev => ({
            ...prev,
            [name]: ''
          }));
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate date formats
    if (formData.startDate && !validateDate(formData.startDate)) {
      alert('Invalid start date format. Please use YYYY-MM-DD format.');
      return;
    }
    
    if (formData.endDate && !validateDate(formData.endDate)) {
      alert('Invalid end date format. Please use YYYY-MM-DD format.');
      return;
    }
    
    // Validate date range
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      if (end < start) {
        alert('End date must be after start date');
        return;
      }
    }

    dispatch(updateHolidayModeAction({
      settings: {
        ...formData,
        isActive: settings.isActive
      },
      onSuccess: (data) => {
        console.log('Holiday mode settings updated:', data);
      }
    }));
  };

  const handleReset = () => {
    if (settings) {
      setFormData({
        message: settings.message || '',
        startDate: settings.startDate ? formatDateForInput(settings.startDate) : '',
        endDate: settings.endDate ? formatDateForInput(settings.endDate) : '',
        allowBrowsing: settings.allowBrowsing ?? true,
        allowOrders: settings.allowOrders ?? false
      });
    }
    setDateErrors({ startDate: '', endDate: '' });
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      {/* Loading Overlay */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: '1000'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '8px',
          marginTop: '0'
        }}>
          Holiday Mode
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#6c757d',
          marginTop: '0',
          marginBottom: '0'
        }}>
          Configure your store's holiday settings and notifications
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          fontWeight: '500',
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb'
        }}>
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '8px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
          fontWeight: '500',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb'
        }}>
          <span>✕</span>
          <span>{error}</span>
        </div>
      )}

      {/* Main Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        marginBottom: '24px'
      }}>
        {/* Status Section */}
        <div style={{
          padding: '32px',
          borderBottom: '1px solid #e9ecef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <div style={{
              fontSize: '14px',
              color: '#6c757d',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: '600'
            }}>
              Current Status
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '16px',
              fontWeight: '600',
              backgroundColor: settings.isActive ? '#d4edda' : '#f8d7da',
              color: settings.isActive ? '#155724' : '#721c24'
            }}>
              <span style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                display: 'inline-block',
                backgroundColor: settings.isActive ? '#155724' : '#721c24'
              }}></span>
              {settings.isActive ? 'Holiday Mode Active' : 'Holiday Mode Inactive'}
            </div>
          </div>
          <button
            style={{
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              minWidth: '140px',
              backgroundColor: settings.isActive ? '#dc3545' : '#28a745',
              color: '#ffffff',
              opacity: loading ? '0.6' : '1'
            }}
            onClick={handleToggle}
            disabled={loading}
            onMouseEnter={(e) => !loading && ((e.target as any).style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => ((e.target as any).style.transform = 'translateY(0)')}
          >
            {settings.isActive ? 'Disable' : 'Enable'}
          </button>
        </div>

        {/* Settings Form */}
        <div style={{ padding: '32px' }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a1a1a',
            marginBottom: '24px',
            marginTop: '0',
            paddingBottom: '12px',
            borderBottom: '2px solid #e9ecef'
          }}>
            Holiday Settings
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Holiday Message */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '24px'
            }}>
              <label style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#495057',
                marginBottom: '4px'
              }} htmlFor="message">
                Holiday Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                style={{
                  padding: '12px 16px',
                  fontSize: '15px',
                  border: '1px solid #ced4da',
                  borderRadius: '6px',
                  outline: 'none',
                  fontFamily: 'inherit',
                  minHeight: '100px',
                  resize: 'vertical',
                  transition: 'border-color 0.2s ease'
                }}
                placeholder="Enter the message to display to customers during holiday mode"
                onFocus={(e) => e.target.style.borderColor = '#007bff'}
                onBlur={(e) => e.target.style.borderColor = '#ced4da'}
              />
            </div>

            {/* Date Range */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '4px'
                }} htmlFor="startDate">
                  Start Date
                </label>
                <input
                  type="text"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  placeholder="YYYY-MM-DD"
                  style={{
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: `1px solid ${dateErrors.startDate ? '#dc3545' : '#ced4da'}`,
                    borderRadius: '6px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => !dateErrors.startDate && (e.target.style.borderColor = '#007bff')}
                  onBlur={(e) => !dateErrors.startDate && (e.target.style.borderColor = '#ced4da')}
                />
                {dateErrors.startDate && (
                  <span style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                    {dateErrors.startDate}
                  </span>
                )}
                <span style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                  Format: YYYY-MM-DD (e.g., 2025-12-25)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '4px'
                }} htmlFor="endDate">
                  End Date
                </label>
                <input
                  type="text"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  placeholder="YYYY-MM-DD"
                  style={{
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: `1px solid ${dateErrors.endDate ? '#dc3545' : '#ced4da'}`,
                    borderRadius: '6px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => !dateErrors.endDate && (e.target.style.borderColor = '#007bff')}
                  onBlur={(e) => !dateErrors.endDate && (e.target.style.borderColor = '#ced4da')}
                />
                {dateErrors.endDate && (
                  <span style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                    {dateErrors.endDate}
                  </span>
                )}
                <span style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                  Format: YYYY-MM-DD (e.g., 2025-12-31)
                </span>
              </div>
            </div>

            {/* Permissions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="allowBrowsing"
                    name="allowBrowsing"
                    checked={formData.allowBrowsing}
                    onChange={handleInputChange}
                    style={{ 
                      width: '18px', 
                      height: '18px', 
                      cursor: 'pointer' 
                    }}
                  />
                  <label style={{
                    fontSize: '15px',
                    color: '#495057',
                    cursor: 'pointer',
                    userSelect: 'none',
                    margin: '0',
                    fontWeight: '500'
                  }} htmlFor="allowBrowsing">
                    Allow customers to browse products
                  </label>
                </div>
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    id="allowOrders"
                    name="allowOrders"
                    checked={formData.allowOrders}
                    onChange={handleInputChange}
                    style={{ 
                      width: '18px', 
                      height: '18px', 
                      cursor: 'pointer' 
                    }}
                  />
                  <label style={{
                    fontSize: '15px',
                    color: '#495057',
                    cursor: 'pointer',
                    userSelect: 'none',
                    margin: '0',
                    fontWeight: '500'
                  }} htmlFor="allowOrders">
                    Allow customers to place orders
                  </label>
                </div>
              </div>
            </div>

            {/* Info Note */}
            <div style={{
              backgroundColor: '#e7f3ff',
              border: '1px solid #b3d9ff',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '24px',
              fontSize: '14px',
              color: '#004085',
              lineHeight: '1.6'
            }}>
              <strong>Note:</strong> When holiday mode is active, the configured
              message will be displayed to customers. Use the checkboxes above to
              control whether customers can browse products or place orders during
              this period.
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '16px',
              marginTop: '32px',
              paddingTop: '24px',
              borderTop: '1px solid #e9ecef',
              flexWrap: 'wrap'
            }}>
              <button
                type="submit"
                style={{
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  backgroundColor: '#007bff',
                  color: '#ffffff',
                  transition: 'all 0.2s ease',
                  flex: '1',
                  minWidth: '150px',
                  opacity: loading ? '0.6' : '1'
                }}
                disabled={loading}
                onMouseEnter={(e) => !loading && ((e.target as any).style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => ((e.target as any).style.transform = 'translateY(0)')}
              >
                Save Settings
              </button>
              <button
                type="button"
                style={{
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: '600',
                  border: '2px solid #6c757d',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  transition: 'all 0.2s ease',
                  flex: '1',
                  minWidth: '150px',
                  opacity: loading ? '0.6' : '1'
                }}
                onClick={handleReset}
                disabled={loading}
                onMouseEnter={(e) => !loading && ((e.target as any).style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => ((e.target as any).style.transform = 'translateY(0)')}
              >
                Reset Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HolidayModePage;