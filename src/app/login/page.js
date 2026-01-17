"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, loginWithGoogle, register } from '../../lib/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('patient');
  const [staffCode, setStaffCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRedirect = (role) => {
    if (role === 'staff') {
      router.push('/dashboard/staff');
    } else {
      router.push('/dashboard/patient');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegistering) {
        if (role === 'staff' && staffCode !== 'ACC20252026') {
          setError('Invalid Staff Code');
          return;
        }
        await register(email, password, role);
        handleRedirect(role);
      } else {
        const { role: userRole } = await login(email, password);
        handleRedirect(userRole);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const { role } = await loginWithGoogle();
      handleRedirect(role);
    } catch (err) {
      setError('Failed to login with Google.');
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight">
          {isRegistering ? 'Create an account' : 'Sign in to your account'}
        </h2>
        
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <input
              type="email"
              required
              className="relative block w-full rounded-t-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="relative block w-full rounded-b-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegistering && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">I am a:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 text-base ring-1 ring-inset ring-gray-300 focus:outline-none sm:text-sm"
                >
                  <option value="patient">Patient</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              {role === 'staff' && (
                <input
                  type="text"
                  placeholder="Staff Secret Code"
                  value={staffCode}
                  onChange={(e) => setStaffCode(e.target.value)}
                  className="relative block w-full rounded-md border-0 p-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              )}
            </div>
          )}

          <button type="submit" className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {isRegistering ? 'Register' : 'Sign in'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Google
        </button>

        <div className="text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
}