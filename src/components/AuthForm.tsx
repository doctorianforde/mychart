import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  isRegistering: boolean;
  setIsRegistering: (val: boolean) => void;
  role: string;
  setRole: (val: string) => void;
  fullName: string;
  setFullName: (val: string) => void;
  age: string;
  setAge: (val: string) => void;
  comorbidities: string;
  setComorbidities: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  staffCode: string;
  setStaffCode: (val: string) => void;
  setProfilePic: (val: File | null) => void;
  error: string;
  setError: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isForgotPassword: boolean;
  setIsForgotPassword: (val: boolean) => void;
  resetMessage: string;
  setResetMessage: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleForgotPassword: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
}

export default function AuthForm({
  email, setEmail, password, setPassword, isRegistering, setIsRegistering,
  role, setRole, fullName, setFullName, age, setAge, comorbidities, setComorbidities,
  phoneNumber, setPhoneNumber, staffCode, setStaffCode, setProfilePic,
  error, setError, showPassword, setShowPassword, isForgotPassword, setIsForgotPassword,
  resetMessage, setResetMessage, handleSubmit, handleForgotPassword, handleGoogleLogin
}: AuthFormProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-[#EFE7DD] via-[#f7f2ea] to-[#EFE7DD]">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-white/50">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Image src="/blacklogo2.png" alt="MyChart by Alera" width={200} height={50} style={{ objectFit: 'contain' }} priority />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4A3A33] mb-3 font-['Montserrat']">
              MyChart by Alera
            </h1>
            <p className="text-sm text-[#4A3A33]/70 mb-4 leading-relaxed">
              Your secure patient portal for managing health records, tracking vital signs, and communicating with your healthcare providers.
            </p>
            <h2 className="text-sm font-medium text-[#4A3A33]/70 tracking-wide">
              {isForgotPassword ? 'Reset your password' : isRegistering ? 'Create your new account' : 'Sign in to access your records'}
            </h2>
          </div>

          {error && (
            <div className="mb-6 bg-gradient-to-r from-red-50 to-red-50/50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-red-700">{error}</p>
            </div>
          )}

          {resetMessage && (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-green-50/50 border-l-4 border-[#8AAB88] p-4 rounded-lg shadow-sm">
              <p className="text-sm font-medium text-[#4A3A33]">{resetMessage}</p>
            </div>
          )}

          {isForgotPassword ? (
            <form className="space-y-6" onSubmit={handleForgotPassword}>
              <div>
                <label htmlFor="reset-email" className="block text-base font-bold text-[#4A3A33] mb-3">Email address</label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="w-full flex justify-center py-4 px-8 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-[#4A3A33] to-[#5e4d44] hover:from-[#3a2e28] hover:to-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#4A3A33]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Send Reset Link
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(false); setError(''); setResetMessage(''); }}
                  className="text-base font-bold text-[#8AAB88] hover:text-[#4A3A33] underline decoration-2 underline-offset-4 transition-colors py-2 px-4"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-base font-bold text-[#4A3A33] mb-3">Email address</label>
                    <input
                      id="email"
                      type="email"
                      required
                      className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <div className="relative">
                      <label htmlFor="password" className="block text-base font-bold text-[#4A3A33] mb-3">Password</label>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 pr-16 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="absolute top-11 right-4 text-sm text-[#8AAB88] hover:text-[#4A3A33] font-semibold px-3 py-2 rounded-md hover:bg-[#8AAB88]/10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                </div>

                {isRegistering && (
                  <div className="space-y-6 pt-2">
                    <div>
                      <label className="block text-base font-bold text-[#4A3A33] mb-3">Full Name</label>
                      <input
                        type="text"
                        required
                        className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-[#4A3A33] mb-3">Age</label>
                      <input
                        type="number"
                        required
                        className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                        placeholder="30"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-[#4A3A33] mb-3">Comorbidities</label>
                      <textarea
                        rows={3}
                        className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all resize-none"
                        placeholder="e.g. Hypertension, Asthma"
                        value={comorbidities}
                        onChange={(e) => setComorbidities(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-[#4A3A33] mb-3">Phone Number</label>
                      <input
                        type="tel"
                        required
                        className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                        placeholder="(555) 555-5555"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-base font-bold text-[#4A3A33] mb-3">I am a:</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] transition-all cursor-pointer"
                      >
                        <option value="patient">Patient</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-base font-bold text-[#4A3A33] mb-3">Profile Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!file.type.startsWith('image/')) {
                              alert('Please upload a valid image file.');
                              e.target.value = '';
                              setProfilePic(null);
                              return;
                            }
                            if (file.size > 5 * 1024 * 1024) {
                              alert('File size exceeds 5MB limit.');
                              e.target.value = '';
                              setProfilePic(null);
                              return;
                            }
                            setProfilePic(file);
                          } else {
                            setProfilePic(null);
                          }
                        }}
                        className="block w-full text-base text-[#4A3A33] file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-base file:font-bold file:bg-[#EFE7DD] file:text-[#4A3A33] hover:file:bg-[#D9A68A]/30 file:transition-all file:cursor-pointer cursor-pointer"
                      />
                    </div>

                    {role === 'staff' && (
                      <div>
                        <label className="block text-base font-bold text-[#4A3A33] mb-3">Staff Access Code</label>
                        <input
                          type="password"
                          placeholder="Enter code"
                          value={staffCode}
                          onChange={(e) => setStaffCode(e.target.value)}
                          className="block w-full rounded-xl border-2 border-[#D9A68A]/40 bg-white shadow-sm focus:border-[#8AAB88] focus:ring-2 focus:ring-[#8AAB88]/20 text-base p-4 text-[#4A3A33] placeholder:text-[#4A3A33]/40 transition-all"
                        />
                      </div>
                    )}
                  </div>
                )}

                <button type="submit" className="w-full flex justify-center py-4 px-8 rounded-xl shadow-md text-lg font-bold text-white bg-gradient-to-r from-[#4A3A33] to-[#5e4d44] hover:from-[#3a2e28] hover:to-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#4A3A33]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  {isRegistering ? 'Create Account' : 'Sign In'}
                </button>

                {!isRegistering && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setIsForgotPassword(true); setError(''); setResetMessage(''); }}
                      className="text-sm font-bold text-[#D9A68A] hover:text-[#4A3A33] underline decoration-2 underline-offset-4 transition-colors py-2 px-4"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-[#D9A68A]/30" />
                </div>
                <div className="relative flex justify-center text-base">
                  <span className="bg-white/80 backdrop-blur-sm px-5 text-[#4A3A33]/60 font-semibold">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex justify-center items-center gap-3 py-4 px-8 border-2 border-[#D9A68A]/30 rounded-xl shadow-sm bg-white hover:bg-[#EFE7DD]/30 text-base font-bold text-[#4A3A33] focus:outline-none focus:ring-4 focus:ring-[#8AAB88]/20 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <svg className="h-6 w-6" aria-hidden="true" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign in with Google
              </button>

              <div className="text-center mt-6">
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="text-base font-bold text-[#8AAB88] hover:text-[#4A3A33] underline decoration-2 underline-offset-4 transition-colors py-2 px-4"
                >
                  {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
                </button>
              </div>

              {/* Legal Links Footer */}
              <div className="mt-8 pt-6 border-t border-[#D9A68A]/30">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                  <Link
                    href="/tos"
                    className="text-[#4A3A33]/70 hover:text-[#8AAB88] font-medium underline decoration-2 underline-offset-2"
                  >
                    Terms of Service
                  </Link>
                  <span className="hidden sm:inline text-[#4A3A33]/40">•</span>
                  <Link
                    href="/privacy"
                    className="text-[#4A3A33]/70 hover:text-[#8AAB88] font-medium underline decoration-2 underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                </div>
                <p className="text-center text-xs text-[#4A3A33]/60 mt-4">
                  © {new Date().getFullYear()} Alera Care Collective. All rights reserved.
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </main>
  );
}