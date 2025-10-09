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
    startDateTime: '',
    endDateTime: '',
    allowBrowsing: true,
    allowOrders: false
  });

  const [validationErrors, setValidationErrors] = useState({
    startDateTime: '',
    endDateTime: ''
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
        startDateTime: settings.startDate ? formatDateTimeForInput(settings.startDate) : '',
        endDateTime: settings.endDate ? formatDateTimeForInput(settings.endDate) : '',
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

  // Format ISO datetime to readable format: YYYY-MM-DD HH:MM
  const formatDateTimeForInput = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // Validate datetime format: YYYY-MM-DD HH:MM
  const validateDateTime = (dateTimeString) => {
    if (!dateTimeString.trim()) return { valid: true, message: '' };
    
    // Regex for YYYY-MM-DD HH:MM format
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;
    
    if (!dateTimeRegex.test(dateTimeString)) {
      return { 
        valid: false, 
        message: 'Invalid format. Use YYYY-MM-DD HH:MM (e.g., 2025-12-25 09:30)' 
      };
    }
    
    const [datePart, timePart] = dateTimeString.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);
    
    // Validate date
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || 
        date.getMonth() !== month - 1 || 
        date.getDate() !== day) {
      return { valid: false, message: 'Invalid date' };
    }
    
    // Validate time
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return { valid: false, message: 'Invalid time (hours: 00-23, minutes: 00-59)' };
    }
    
    return { valid: true, message: '' };
  };

  // Convert datetime string to ISO format
  const convertToISO = (dateTimeString) => {
    if (!dateTimeString.trim()) return null;
    
    const [datePart, timePart] = dateTimeString.split(' ');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`).toISOString();
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

      // Validate datetime fields in real-time
      if (name === 'startDateTime' || name === 'endDateTime') {
        const validation = validateDateTime(value);
        setValidationErrors(prev => ({
          ...prev,
          [name]: validation.message
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate start datetime
    const startValidation = validateDateTime(formData.startDateTime);
    if (!startValidation.valid) {
      alert(`Start date/time error: ${startValidation.message}`);
      return;
    }
    
    // Validate end datetime
    const endValidation = validateDateTime(formData.endDateTime);
    if (!endValidation.valid) {
      alert(`End date/time error: ${endValidation.message}`);
      return;
    }
    
    // Convert to ISO format
    const startISO = convertToISO(formData.startDateTime);
    const endISO = convertToISO(formData.endDateTime);
    
    // Validate date range
    if (startISO && endISO) {
      const start = new Date(startISO);
      const end = new Date(endISO);
      
      if (end <= start) {
        alert('End date/time must be after start date/time');
        return;
      }
    }

    dispatch(updateHolidayModeAction({
      settings: {
        message: formData.message,
        startDate: startISO,
        endDate: endISO,
        allowBrowsing: formData.allowBrowsing,
        allowOrders: formData.allowOrders,
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
        startDateTime: settings.startDate ? formatDateTimeForInput(settings.startDate) : '',
        endDateTime: settings.endDate ? formatDateTimeForInput(settings.endDate) : '',
        allowBrowsing: settings.allowBrowsing ?? true,
        allowOrders: settings.allowOrders ?? false
      });
    }
    setValidationErrors({ startDateTime: '', endDateTime: '' });
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

            {/* DateTime Range */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
              marginBottom: '24px'
            }}>
              {/* Start DateTime */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '4px'
                }} htmlFor="startDateTime">
                  Start Date & Time
                </label>
                <input
                  type="text"
                  id="startDateTime"
                  name="startDateTime"
                  value={formData.startDateTime}
                  onChange={handleInputChange}
                  placeholder="YYYY-MM-DD HH:MM"
                  style={{
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: `1px solid ${validationErrors.startDateTime ? '#dc3545' : '#ced4da'}`,
                    borderRadius: '6px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => !validationErrors.startDateTime && (e.target.style.borderColor = '#007bff')}
                  onBlur={(e) => !validationErrors.startDateTime && (e.target.style.borderColor = '#ced4da')}
                />
                {validationErrors.startDateTime && (
                  <span style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                    {validationErrors.startDateTime}
                  </span>
                )}
                <span style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                  Format: YYYY-MM-DD HH:MM (e.g., 2025-12-25 09:30)
                </span>
              </div>

              {/* End DateTime */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#495057',
                  marginBottom: '4px'
                }} htmlFor="endDateTime">
                  End Date & Time
                </label>
                <input
                  type="text"
                  id="endDateTime"
                  name="endDateTime"
                  value={formData.endDateTime}
                  onChange={handleInputChange}
                  placeholder="YYYY-MM-DD HH:MM"
                  style={{
                    padding: '12px 16px',
                    fontSize: '15px',
                    border: `1px solid ${validationErrors.endDateTime ? '#dc3545' : '#ced4da'}`,
                    borderRadius: '6px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.2s ease'
                  }}
                  onFocus={(e) => !validationErrors.endDateTime && (e.target.style.borderColor = '#007bff')}
                  onBlur={(e) => !validationErrors.endDateTime && (e.target.style.borderColor = '#ced4da')}
                />
                {validationErrors.endDateTime && (
                  <span style={{ fontSize: '12px', color: '#dc3545', marginTop: '4px' }}>
                    {validationErrors.endDateTime}
                  </span>
                )}
                <span style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
                  Format: YYYY-MM-DD HH:MM (e.g., 2025-12-31 23:59)
                </span>
              </div>
            </div>

            {/* Info Note */}
            <div style={{
              backgroundColor: '#e7f3ff',
              border: '1px solid #b3d9ff',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              fontSize: '14px',
              color: '#004085',
              lineHeight: '1.6'
            }}>
              <strong>⏰ Automatic Scheduling:</strong> Holiday mode will automatically activate at the start date/time and deactivate at the end date/time. The system checks every hour for scheduled changes.
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