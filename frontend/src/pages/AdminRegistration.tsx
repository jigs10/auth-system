// AdminRegistration.tsx
import React, { useState } from 'react';
import { Link } from 'react-router'

interface AdminRegistrationProps {
  // Add any props if needed
}

const AdminRegistration: React.FC<AdminRegistrationProps> = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/admin-registration', { // Adjust the URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();
      setData(data)

      //Clear the forms
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  console.log(data)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
      {data && <span className='p-4 font-400 text-green-400'>{data?.message}</span>}
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Register
            </button>
          </div>
        </form>
        <div className='py-5'>Already user? <Link to="/admin-login" className="hover:underline text-blue-400 p-2">Admin Login</Link></div>
        
      </div>
    </div>
  );
};

export default AdminRegistration;