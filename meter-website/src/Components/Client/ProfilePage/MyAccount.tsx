import React, { useState } from 'react';

function AccountInfo({ user }) {
  // State for each editable field
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || 'John Doe');

  const [editingEmail, setEditingEmail] = useState(false);
  const [email, setEmail] = useState(user?.email || 'john@example.com');

  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '+91 9876543210');

  const [editingAddress, setEditingAddress] = useState(false);
  const [address, setAddress] = useState(user?.address || 'No address added yet');

  // Function to handle saving changes (placeholder for actual API call)
  const handleSave = (field) => {
    // In a real application, you would send this data to your backend
    console.log(`Saving ${field}:`, { name, email, phone, address });
    
    // Exit edit mode for the specific field
    if (field === 'name') setEditingName(false);
    if (field === 'email') setEditingEmail(false);
    if (field === 'phone') setEditingPhone(false);
    if (field === 'address') setEditingAddress(false);
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Personal Information</h2>
      
      <div className="space-y-5">
        {/* Full Name Field */}
        <p className="text-gray-600 text-sm font-medium mb-1">Full Name</p>

        <div className='flex'>

        <div className=" border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center justify-between h-1/4 w-full">
          <div>
            {editingName ? (
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="text-lg text-gray-900 border border-gray-300 rounded-md p-1 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">{name}</p>
            )}
          </div>
       
        </div>
        {editingName ? (
            <button 
              onClick={() => handleSave('name')} 
              className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
          ) : (
            <button 
              onClick={() => setEditingName(true)} 
              className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        {/* Email Address Field */}
        <p className="text-gray-600 text-sm font-medium mb-1">Email Address</p>
        <div className='flex'>
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center justify-between h-1/4 w-full">
          <div>
            {editingEmail ? (
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="text-lg text-gray-900 border border-gray-300 rounded-md p-1 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">{email}</p>
            )}
          </div>
         
        </div>
        {editingEmail ? (
            <button 
              onClick={() => handleSave('email')} 
              className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
          ) : (
            <button 
              onClick={() => setEditingEmail(true)} 
              className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Edit
            </button>
          )}
          </div>
        {/* Phone Number Field */}
        <p className="text-gray-600 text-sm font-medium mb-1">Phone Number</p>
        <div className='flex'>
        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex items-center justify-between h-1/4 w-full">
          <div>
            {editingPhone ? (
              <input 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
                className=" text-lg text-gray-900 border border-gray-300 rounded-md p-1 w-full"
              />
            ) : (
              <p className="text-lg text-gray-900">{phone}</p>
            )}
          </div>
         
        </div>
        {editingPhone ? (
            <button 
              onClick={() => handleSave('phone')} 
              className="ml-4 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition-colors"
            >
              Save
            </button>
          ) : (
            <button 
              onClick={() => setEditingPhone(true)} 
              className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Edit
            </button>
          )}           
        </div>
     
      </div>

      {/* Disclaimer Section */}
      <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
        <p className="font-semibold mb-2">Important Information:</p>
        <p>
          To change your **Email Address** or **Password**, please navigate to the "Account Settings" section in the sidebar. These changes require additional security verification.
        </p>
      </div>
    </div>
  );
}

export default AccountInfo;
 