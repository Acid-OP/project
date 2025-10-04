'use client';
import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = () => {
    console.log('Sign up submitted');
  };

  return (
    <div className="min-h-screen bg-[#0f0f14] relative overflow-hidden flex items-center justify-center">
      {/* Trading Chart Background - Diagonal uptrend from left bottom to right top */}
      <div className="absolute inset-0 opacity-15">
        <svg className="w-full h-full" viewBox="0 0 2000 900" preserveAspectRatio="none">
          {/* Diagonal pattern - starting low left, ending high right with fluctuations */}
          <line x1="40" y1="850" x2="40" y2="750" stroke="#22c55e" strokeWidth="1.5" opacity="0.7"/>
          <rect x="32" y="780" width="16" height="70" fill="#22c55e" opacity="0.7"/>
          
          <line x1="80" y1="850" x2="80" y2="720" stroke="#ef4444" strokeWidth="1.5" opacity="0.6"/>
          <rect x="72" y="760" width="16" height="90" fill="#ef4444" opacity="0.6"/>
          
          <line x1="120" y1="850" x2="120" y2="700" stroke="#22c55e" strokeWidth="1.5" opacity="0.8"/>
          <rect x="112" y="730" width="16" height="120" fill="#22c55e" opacity="0.8"/>
          
          <line x1="160" y1="850" x2="160" y2="740" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"/>
          <rect x="152" y="770" width="16" height="80" fill="#ef4444" opacity="0.7"/>
          
          <line x1="200" y1="850" x2="200" y2="680" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <rect x="192" y="710" width="16" height="140" fill="#22c55e" opacity="0.6"/>
          
          <line x1="240" y1="850" x2="240" y2="710" stroke="#22c55e" strokeWidth="1.5" opacity="0.7"/>
          <rect x="232" y="740" width="16" height="110" fill="#22c55e" opacity="0.7"/>
          
          <line x1="280" y1="850" x2="280" y2="660" stroke="#ef4444" strokeWidth="1.5" opacity="0.8"/>
          <rect x="272" y="700" width="16" height="150" fill="#ef4444" opacity="0.8"/>
          
          <line x1="320" y1="850" x2="320" y2="640" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <rect x="312" y="680" width="16" height="170" fill="#22c55e" opacity="0.6"/>
          
          <line x1="360" y1="850" x2="360" y2="680" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"/>
          <rect x="352" y="710" width="16" height="140" fill="#ef4444" opacity="0.7"/>
          
          <line x1="400" y1="850" x2="400" y2="620" stroke="#22c55e" strokeWidth="1.5" opacity="0.8"/>
          <rect x="392" y="660" width="16" height="190" fill="#22c55e" opacity="0.8"/>
          
          <line x1="440" y1="850" x2="440" y2="650" stroke="#ef4444" strokeWidth="1.5" opacity="0.6"/>
          <rect x="432" y="690" width="16" height="160" fill="#ef4444" opacity="0.6"/>
          
          <line x1="480" y1="850" x2="480" y2="600" stroke="#22c55e" strokeWidth="1.5" opacity="0.7"/>
          <rect x="472" y="640" width="16" height="210" fill="#22c55e" opacity="0.7"/>
          
          <line x1="520" y1="850" x2="520" y2="630" stroke="#22c55e" strokeWidth="1.5" opacity="0.8"/>
          <rect x="512" y="670" width="16" height="180" fill="#22c55e" opacity="0.8"/>
          
          <line x1="560" y1="850" x2="560" y2="580" stroke="#ef4444" strokeWidth="1.5" opacity="0.6"/>
          <rect x="552" y="620" width="16" height="230" fill="#ef4444" opacity="0.6"/>
          
          <line x1="600" y1="850" x2="600" y2="610" stroke="#22c55e" strokeWidth="1.5" opacity="0.7"/>
          <rect x="592" y="650" width="16" height="200" fill="#22c55e" opacity="0.7"/>
          
          <line x1="640" y1="850" x2="640" y2="560" stroke="#ef4444" strokeWidth="1.5" opacity="0.8"/>
          <rect x="632" y="600" width="16" height="250" fill="#ef4444" opacity="0.8"/>
          
          <line x1="680" y1="850" x2="680" y2="590" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <rect x="672" y="630" width="16" height="220" fill="#22c55e" opacity="0.6"/>
          
          <line x1="720" y1="850" x2="720" y2="540" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"/>
          <rect x="712" y="580" width="16" height="270" fill="#ef4444" opacity="0.7"/>
          
          <line x1="760" y1="850" x2="760" y2="570" stroke="#22c55e" strokeWidth="1.5" opacity="0.8"/>
          <rect x="752" y="610" width="16" height="240" fill="#22c55e" opacity="0.8"/>
          
          <line x1="800" y1="850" x2="800" y2="520" stroke="#ef4444" strokeWidth="1.5" opacity="0.6"/>
          <rect x="792" y="560" width="16" height="290" fill="#ef4444" opacity="0.6"/>
          
          <line x1="840" y1="850" x2="840" y2="550" stroke="#22c55e" strokeWidth="1.5" opacity="0.7"/>
          <rect x="832" y="590" width="16" height="260" fill="#22c55e" opacity="0.7"/>
          
          <line x1="880" y1="850" x2="880" y2="500" stroke="#22c55e" strokeWidth="1.5" opacity="0.8"/>
          <rect x="872" y="540" width="16" height="310" fill="#22c55e" opacity="0.8"/>
          
          <line x1="920" y1="850" x2="920" y2="530" stroke="#ef4444" strokeWidth="1.5" opacity="0.6"/>
          <rect x="912" y="570" width="16" height="280" fill="#ef4444" opacity="0.6"/>
          
          <line x1="960" y1="850" x2="960" y2="480" stroke="#22c55e" strokeWidth="1.5" opacity="0.7"/>
          <rect x="952" y="520" width="16" height="330" fill="#22c55e" opacity="0.7"/>
          
          <line x1="1000" y1="850" x2="1000" y2="510" stroke="#ef4444" strokeWidth="1.5" opacity="0.8"/>
          <rect x="992" y="550" width="16" height="300" fill="#ef4444" opacity="0.8"/>
          
          <line x1="1040" y1="850" x2="1040" y2="460" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <rect x="1032" y="500" width="16" height="350" fill="#22c55e" opacity="0.6"/>
          
          <line x1="1080" y1="850" x2="1080" y2="490" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"/>
          <rect x="1072" y="530" width="16" height="320" fill="#ef4444" opacity="0.7"/>
          
          <line x1="1120" y1="850" x2="1120" y2="440" stroke="#22c55e" strokeWidth="1.5" opacity="0.8"/>
          <rect x="1112" y="480" width="16" height="370" fill="#22c55e" opacity="0.8"/>
          
          <line x1="1160" y1="850" x2="1160" y2="470" stroke="#ef4444" strokeWidth="1.5" opacity="0.6"/>
          <rect x="1152" y="510" width="16" height="340" fill="#ef4444" opacity="0.6"/>
          
          <line x1="1200" y1="850" x2="1200" y2="420" stroke="#22c55e" strokeWidth="1.5" opacity="0.7"/>
          <rect x="1192" y="460" width="16" height="390" fill="#22c55e" opacity="0.7"/>
          
          <line x1="1240" y1="850" x2="1240" y2="450" stroke="#22c55e" strokeWidth="1.5" opacity="0.8"/>
          <rect x="1232" y="490" width="16" height="360" fill="#22c55e" opacity="0.8"/>
          
          <line x1="1280" y1="850" x2="1280" y2="400" stroke="#ef4444" strokeWidth="1.5" opacity="0.6"/>
          <rect x="1272" y="440" width="16" height="410" fill="#ef4444" opacity="0.6"/>
          
          <line x1="1320" y1="850" x2="1320" y2="430" stroke="#22c55e" strokeWidth="1.5" opacity="0.7"/>
          <rect x="1312" y="470" width="16" height="380" fill="#22c55e" opacity="0.7"/>
          
          <line x1="1360" y1="850" x2="1360" y2="380" stroke="#ef4444" strokeWidth="1.5" opacity="0.8"/>
          <rect x="1352" y="420" width="16" height="430" fill="#ef4444" opacity="0.8"/>
          
          <line x1="1400" y1="850" x2="1400" y2="410" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <rect x="1392" y="450" width="16" height="400" fill="#22c55e" opacity="0.6"/>
          
          <line x1="1440" y1="850" x2="1440" y2="360" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"/>
          <rect x="1432" y="400" width="16" height="450" fill="#ef4444" opacity="0.7"/>
          
          <line x1="1480" y1="850" x2="1480" y2="390" stroke="#22c55e" strokeWidth="1.5" opacity="0.8"/>
          <rect x="1472" y="430" width="16" height="420" fill="#22c55e" opacity="0.8"/>
          
          <line x1="1520" y1="850" x2="1520" y2="340" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <rect x="1512" y="380" width="16" height="470" fill="#22c55e" opacity="0.6"/>
          
          <line x1="1560" y1="850" x2="1560" y2="370" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"/>
          <rect x="1552" y="410" width="16" height="440" fill="#ef4444" opacity="0.7"/>
          
          <line x1="1600" y1="850" x2="1600" y2="320" stroke="#22c55e" strokeWidth="1.5" opacity="0.8"/>
          <rect x="1592" y="360" width="16" height="490" fill="#22c55e" opacity="0.8"/>
          
          <line x1="1640" y1="850" x2="1640" y2="350" stroke="#ef4444" strokeWidth="1.5" opacity="0.6"/>
          <rect x="1632" y="390" width="16" height="460" fill="#ef4444" opacity="0.6"/>
          
          <line x1="1680" y1="850" x2="1680" y2="300" stroke="#22c55e" strokeWidth="1.5" opacity="0.7"/>
          <rect x="1672" y="340" width="16" height="510" fill="#22c55e" opacity="0.7"/>
          
          <line x1="1720" y1="850" x2="1720" y2="330" stroke="#ef4444" strokeWidth="1.5" opacity="0.8"/>
          <rect x="1712" y="370" width="16" height="480" fill="#ef4444" opacity="0.8"/>
          
          <line x1="1760" y1="850" x2="1760" y2="280" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <rect x="1752" y="320" width="16" height="530" fill="#22c55e" opacity="0.6"/>
          
          <line x1="1800" y1="850" x2="1800" y2="310" stroke="#22c55e" strokeWidth="1.5" opacity="0.7"/>
          <rect x="1792" y="350" width="16" height="500" fill="#22c55e" opacity="0.7"/>
          
          <line x1="1840" y1="850" x2="1840" y2="260" stroke="#ef4444" strokeWidth="1.5" opacity="0.8"/>
          <rect x="1832" y="300" width="16" height="550" fill="#ef4444" opacity="0.8"/>
          
          <line x1="1880" y1="850" x2="1880" y2="290" stroke="#22c55e" strokeWidth="1.5" opacity="0.6"/>
          <rect x="1872" y="330" width="16" height="520" fill="#22c55e" opacity="0.6"/>
          
          <line x1="1920" y1="850" x2="1920" y2="240" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"/>
          <rect x="1912" y="280" width="16" height="570" fill="#ef4444" opacity="0.7"/>
          
          <line x1="1960" y1="850" x2="1960" y2="220" stroke="#22c55e" strokeWidth="1.5" opacity="0.8"/>
          <rect x="1952" y="260" width="16" height="590" fill="#22c55e" opacity="0.8"/>
        </svg>
      </div>

      {/* Signup Form */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="bg-[#14151b] rounded-2xl p-8 shadow-2xl relative">
          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-red-500 to-pink-600 p-4 rounded-2xl">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-white text-center mb-8">Create Account</h1>

          {/* Form */}
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0f0f14] text-white border border-blue-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0f0f14] text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full ${
                    password.length > i * 2 ? 'bg-gray-600' : 'bg-gray-800'
                  }`}
                />
              ))}
            </div>

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#0f0f14] text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-700 bg-[#0f0f14] text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-400">
                By signing up, I agree to the{' '}
                <span className="text-blue-500 hover:text-blue-400 cursor-pointer">
                  User Agreement
                </span>{' '}
                and{' '}
                <span className="text-blue-500 hover:text-blue-400 cursor-pointer">
                  Privacy Policy
                </span>
                .
              </label>
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-gray-300 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-lg transition-colors"
            >
              Sign up
            </button>

            {/* Add Referral Link */}
            <div className="text-center">
              <span className="text-purple-500 hover:text-purple-400 text-sm font-medium cursor-pointer">
                Add referral
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}