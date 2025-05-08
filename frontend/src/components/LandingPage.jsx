import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import NotesImage from "../assets/taking-notes.svg";

const LandingPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedUser = JSON.parse(atob(token.split('.')[1]));
        setUserInfo(decodedUser.user);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleClick = () => {
    navigate('/SignUp');
  };

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        onSearchNote={() => {}} 
        handleClearSearch={() => {}} 
        isLandingPage={true}
      />

      <div className="bg-[#EEF2F6] h-screen flex flex-col items-center mt-28">
        <div className="text-center px-2 sm:px-4 w-full">
          <img
            src={NotesImage}
            alt="Taking Notes Illustration"
            className="mx-auto mb-4 w-60 h-60" 
          />
          <h1 className='text-2xl font-semibold text-gray-800 mb-2'>
            Hey {userInfo?.fullName || "there"}!
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2 whitespace-nowrap">
            Welcome to our notes
          </h2>
          <p className="text-gray-600 mb-4">
            Your personal space to write, plan, and organize everything that matters most.
          </p>
          <button
            className="bg-primary hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-full"
            onClick={handleClick}
          >
            Get Started
          </button>
        </div>
      </div>
    </>
  );
};

export default LandingPage;