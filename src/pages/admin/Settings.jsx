import React from 'react';

import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Notification from '../../components/UI/Notification';

const Settings = () => {
  const [settings, setSettings] = React.useState({
    siteName: 'My Store',
    siteDescription: 'Best products online',
    email: 'contact@example.com',
    phone: '+1234567890',
    address: '123 Main St, City, Country',
    currency: 'USD',
    maintenanceMode: false
  });
  const [notification, setNotification] = React.useState({ show: false, message: '', type: '' });

  const handleSave = () => {
    // Save settings logic here
    setNotification({
      show: true,
      message: 'Settings saved successfully!',
      type: 'success'
    });
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {notification.show && (
            <div className="mb-4">
              <Notification
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification({ ...notification, show: false })}
              />
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                />
                <Input
                  label="Site Description"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                />
                <Input
                  label="Contact Email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
                <Input
                  label="Phone Number"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Store Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Maintenance</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Enable Maintenance Mode
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave}>
                Save Settings
              </Button>
            </div>
          </div>
        </main>
      </div>
  );
};

export default Settings;
