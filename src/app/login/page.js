"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, loginWithGoogle, register, uploadProfilePicture } from '../../lib/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState('patient');
  const [staffCode, setStaffCode] = useState('');
  const [profilePic, setProfilePic] = useState(null);
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
        if (role === 'staff' && staffCode !== 'Medicaldoctor2026!') {
          setError('Invalid Staff Code');
          return;
        }
        const user = await register(email, password, role);
        if (user && profilePic) {
          await uploadProfilePicture(profilePic, user.uid);
        }
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
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#EFE7DD]">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Playfair+Display:wght@400;700&display=swap');
      `}} />
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-lg border border-[#D9A68A]/20">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#4A3A33] tracking-tight font-['Playfair_Display']">ALERA CARE COLLECTIVE</h1>
          <h2 className="mt-2 text-sm text-[#4A3A33]/80 font-['Lato']">
            {isRegistering ? 'Create your new account' : 'Sign in to access your records'}
          </h2>
        </div>
        
        {error && <p className="text-[#4A3A33] bg-[#D9A68A]/20 p-2 rounded text-center font-['Lato']">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="email"
              required
              className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm focus:border-[#8AAB88] focus:ring-[#8AAB88] sm:text-sm p-2.5 border text-[#4A3A33] font-['Lato']"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm focus:border-[#8AAB88] focus:ring-[#8AAB88] sm:text-sm p-2.5 border text-[#4A3A33] font-['Lato']"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {isRegistering && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">I am a:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm focus:border-[#8AAB88] focus:ring-[#8AAB88] sm:text-sm p-2.5 border text-[#4A3A33] font-['Lato']"
                >
                  <option value="patient">Patient</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A3A33] font-['Lato']">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files ? e.target.files[0] : null)}
                  className="mt-1 block w-full text-sm text-[#4A3A33] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#EFE7DD] file:text-[#4A3A33] hover:file:bg-[#D9A68A]/20"
                />
              </div>

              {role === 'staff' && (
                <input
                  type="text"
                  placeholder="Staff Secret Code"
                  value={staffCode}
                  onChange={(e) => setStaffCode(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-[#A8C0CE] shadow-sm focus:border-[#8AAB88] focus:ring-[#8AAB88] sm:text-sm p-2.5 border text-[#4A3A33] font-['Lato']"
                />
              )}
            </div>
          )}

          <button type="submit" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-[#EFE7DD] bg-[#4A3A33] hover:bg-[#3a2e28] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A3A33] transition-colors font-['Lato']">
            {isRegistering ? 'Register' : 'Sign in'}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#A8C0CE]/50" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-[#4A3A33]/60 font-['Lato']">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex justify-center items-center gap-3 py-2.5 px-4 border border-[#A8C0CE] rounded-lg shadow-sm bg-white text-sm font-medium text-[#4A3A33] hover:bg-[#EFE7DD]/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A3A33] transition-colors font-['Lato']"
        >
          Google
        </button>

        <div className="text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm font-medium text-[#8AAB88] hover:text-[#4A3A33] transition-colors font-['Lato']"
          >
            {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
}