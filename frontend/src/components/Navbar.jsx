import React, { useState, useEffect, useRef } from 'react';
import { getInitials } from '../utils/helper';
import { useNavigate } from "react-router-dom";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import LogoImg from "../assets/rexer.png";

const Navbar = ({ onSearchNote, handleClearSearch, isLandingPage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const mobileDropdownRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = JSON.parse(atob(token.split('.')[1]));
        setUserInfo(decodedUser.user);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const onLogout = () => {
    localStorage.clear();
    setUserInfo(null);
    setIsMobileDropdownOpen(false);
    setIsDesktopDropdownOpen(false);
    navigate("/");
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      value ? onSearchNote(value) : handleClearSearch();
    }, 150);
  };

  const onClearSearch = () => {
    setSearchQuery('');
    handleClearSearch();
  };

  const toggleMobileDropdown = () => {
    setIsMobileDropdownOpen(prev => !prev);
  };

  const toggleDesktopDropdown = () => {
    setIsDesktopDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target)) {
        setIsMobileDropdownOpen(false);
      }
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(e.target)) {
        setIsDesktopDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`${isLandingPage ? "fixed top-0 left-0 w-full z-50 bg-[#EEF2F6]" : userInfo ? "bg-white drop-shadow" : ""} px-4 py-3`}>
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center justify-between w-full md:w-auto min-h-[40px]">
          <a href="/">
            <img 
              src={LogoImg} 
              alt="Rexer Logo" 
              className="w-20 h-auto sm:w-20 ml-2" 
            />
          </a>
          {!userInfo ? (
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 border border-blue-600 px-4 py-1 ml-auto rounded-full text-sm hover:bg-blue-600 hover:text-white transition md:hidden"
            >
              Login
            </button>
          ) : (
            <div className="relative w-fit ml-auto md:hidden" ref={mobileDropdownRef}>
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#eef2f6] text-xs font-medium bg-slate-950 cursor-pointer"
                onClick={toggleMobileDropdown}
              >
                {getInitials(userInfo.fullName)}
              </div>
              {isMobileDropdownOpen && (
                <div className="absolute top-full right-0 z-10 bg-white shadow-md rounded mt-2 p-2 w-40">
                  <ul className="text-sm rounded">
                    <li className="py-1 px-2 hover:bg-gray-200 cursor-default">
                      {userInfo.fullName}
                    </li>
                    <li
                      className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onLogout();
                      }}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {!isLandingPage && userInfo && (
          <div className="w-full md:w-auto md:absolute md:left-1/2 md:-translate-x-1/2">
            <div className="flex items-center px-4 bg-[#EEF2F6] rounded-md w-full md:w-[300px] lg:w-[400px]">
              <input
                type="text"
                placeholder="Search Notes"
                className="w-full text-xs bg-transparent py-[11px] outline-none"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchChange(searchQuery)}
              />
              {searchQuery && (
                <IoMdClose
                  className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3"
                  onClick={onClearSearch}
                />
              )}
              <FaMagnifyingGlass className="text-slate-400" />
            </div>
          </div>
        )}

        <div className="hidden md:block">
          {!userInfo ? (
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 border border-blue-600 px-4 py-1 rounded-full text-sm hover:bg-blue-600 hover:text-white transition"
            >
              Login
            </button>
          ) : (
            <div className="relative w-fit" ref={desktopDropdownRef}>
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#eef2f6] text-xs font-medium bg-slate-950 cursor-pointer"
                onClick={toggleDesktopDropdown}
              >
                {getInitials(userInfo.fullName)}
              </div>
              {isDesktopDropdownOpen && (
                <div className="absolute top-full right-0 z-10 bg-white shadow-md rounded mt-2 p-2 w-40">
                  <ul className="text-sm rounded">
                    <li className="py-1 px-2 hover:bg-gray-200 cursor-default">
                      {userInfo.fullName}
                    </li>
                    <li
                      className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onLogout();
                      }}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;