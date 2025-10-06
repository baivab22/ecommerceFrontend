import { api } from 'src/api';

// MARK: - getHolidayModeSettings
const getSettings = async () => {
  const response = await api('get')('/holiday-mode');
  return response.data;
};

// MARK: - toggleHolidayMode
const toggle = async () => {
  const response = await api('post')('/holiday-mode/toggle');
  return response.data;
};

// MARK: - updateHolidayModeSettings
const updateSettings = async (settings) => {
  const response = await api('put')('/holiday-mode/update', undefined, settings);
  return response.data;
};

// MARK: - activateHolidayMode (optional - if you want separate activate/deactivate)
const activate = async () => {
  const response = await api('post')('/holiday-mode/activate');
  return response.data;
};

// MARK: - deactivateHolidayMode (optional - if you want separate activate/deactivate)
const deactivate = async () => {
  const response = await api('post')('/holiday-mode/deactivate');
  return response.data;
};

export const holidayModeService = {
  getSettings,
  toggle,
  updateSettings,
  activate,
  deactivate
};

export default holidayModeService;