import { useState } from 'react';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'John Doe',
      phone: '9876543210',
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
  ]);

  const [newAddress, setNewAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  const handleChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const addAddress = () => {
    setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
    setNewAddress({ name: '', phone: '', street: '', city: '', state: '', pincode: '' });
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">My Addresses</h2>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className="border border-gray-200 p-4 rounded-lg shadow-sm shadow-sm bg-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{address.name}</p>
                <p>{address.phone}</p>
                <p>{address.street}, {address.city}, {address.state} - {address.pincode}</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:underline">Edit</button>
                <button onClick={() => deleteAddress(address.id)} className="text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">Add New Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name" value={newAddress.name} onChange={handleChange} className="input" />
          <input type="text" name="phone" placeholder="Phone" value={newAddress.phone} onChange={handleChange} className="input" />
          <input type="text" name="street" placeholder="Street Address" value={newAddress.street} onChange={handleChange} className="input" />
          <input type="text" name="city" placeholder="City" value={newAddress.city} onChange={handleChange} className="input" />
          <input type="text" name="state" placeholder="State" value={newAddress.state} onChange={handleChange} className="input" />
          <input type="text" name="pincode" placeholder="Pincode" value={newAddress.pincode} onChange={handleChange} className="input" />
        </div>
        <button onClick={addAddress} className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
          Add Address
        </button>
      </div>
    </div>
  );
};

export default AddressPage;
