import { useState } from 'react';
import { useNavigate } from 'react-router';
import { FiLogOut, FiHome } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className="sticky top-0 w-full z-50 bg-[#0DA9A6]  text-white px-8 py-3 flex items-center justify-between shadow-md"
      dir="rtl"
      style={{ fontFamily: "'Helvetica Neue', 'Sakkal Majalla'" }}
    >
      {/* Right: Logo and Home Button */}
      <div className="flex items-center space-x-reverse">
        <button
          className="mr-4 p-2 rounded-xl  bg-gradient-to-r from-[#3D7EB9] via-[#0DA9A6] to-[#07A869] hover:bg-[#15445A] transition-colors cursor-pointer"
          onClick={() => navigate('/')}
          aria-label="الصفحة الرئيسية"
        >
          <FiHome size={32} />
        </button>
      </div>

      {/* Left: User Info */}
      {user && (
        <div className="relative flex items-center space-x-reverse">
          <img
            src={
              user?.profileImage ||
              'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'
            }
            alt="User"
            className="w-12 h-12 rounded-full border-2 border-white cursor-pointer shadow-sm"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-3 w-52 bg-white text-[#15445A] shadow-lg rounded-lg z-50 border border-gray-200 text-right"
              style={{ fontFamily: "'Helvetica Neue', 'Sakkal Majalla'" }}
            >
              <div className="px-4 py-3 border-b border-gray-200 font-semibold text-base">
                {user?.fullName || user?.userName || 'المستخدم'}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setDropdownOpen(false);
                }}
                className="w-full px-4 py-3 text-base flex items-center justify-between text-[#15445A] hover:bg-[#f0f0f0] border-t border-gray-200"
              >
                <span>تسجيل خروج</span>
                <FiLogOut size={18} />
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
