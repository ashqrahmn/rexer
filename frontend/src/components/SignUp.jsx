import React, { useState, useEffect } from 'react';
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../utils/helper';
import axiosInstance from '../utils/axiosInstance';
import Toast from './Toast';

const SignUp = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isToastShown, setIsToastShown] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate('/home'); // Redirect to home if already logged in
    }
  }, [navigate]);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  const clearError = () => {
    setError(null);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please enter your name.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter the password");
      return;
    }
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });
      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }
      if (response.data && response.data.accessToken) {
        // localStorage.setItem("token", response.data.accessToken);
        setToastMessage(response.data.message);
        setToastType("success");
        setIsToastShown(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7'>SignUp</h4>
            <input
              type='text'
              placeholder='Name'
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError();
              }}
              className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
            />
            <input
              type='text'
              placeholder='Email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }}
              className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none'
            />
            <div className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 flex items-center'>
              <input
                type={isShowPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError();
                }}
                className='w-full text-sm bg-transparent outline-none'
              />
              {isShowPassword ? (
                <FaRegEye
                  size={22}
                  className='text-primary cursor-pointer'
                  onClick={toggleShowPassword}
                />
              ) : (
                <FaRegEyeSlash
                  size={22}
                  className='text-slate-400 cursor-pointer'
                  onClick={toggleShowPassword}
                />
              )}
            </div>
            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
            <button
              type='submit'
              className='w-full text-sm bg-primary text-white p-2 rounded my-1 hover:bg-blue-600'
            >
              Create Account
            </button>
            <p className='text-sm text-center mt-4'>
              Already have an account?{" "}
              <Link to="/login" className='font-medium text-primary underline'>
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
      <Toast
        isShown={isToastShown}
        message={toastMessage}
        type={toastType}
        onClose={() => setIsToastShown(false)}
      />
    </>
  );
};

export default SignUp;