import React from 'react'

function Settings() {
  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>

      {/* Password Change Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
        <input
          type="password"
          placeholder="Current Password"
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="New Password"
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="w-full mb-2 p-2 border rounded"
        />
        <button className="bg-black text-white px-4 py-2 rounded">Update Password</button>
      </div>

      {/* Notification Preferences */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Notification Preferences</h3>
        <div className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" />
          <label>Email Notifications</label>
        </div>
        <div className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" />
          <label>SMS Notifications</label>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Privacy</h3>
        <div className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" />
          <label>Make Profile Private</label>
        </div>
        <div className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" />
          <label>Hide Email from Other Users</label>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-sm text-gray-500 mt-8 border-t pt-4">
        <p>
          Disclaimer: Settings may affect your user experience and some changes
          may require re-login or admin approval. Please make sure to save your changes before exiting.
        </p>
      </div>
    </div>
  )
}

export default Settings
