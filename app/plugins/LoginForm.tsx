'use client'
import React, { useState } from 'react';
import { onLogin } from '../api/login';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

const LoginForm = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const toggleForm = () => {
        setIsRegister(!isRegister);
    };
    const nav = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await onLogin(username, password);
        if (result) {
            sessionStorage.setItem('token', result.access_token);
            nav.push("/");
        }
    }
    return (
        <div className="relative w-full h-screen m-auto pt-20 bg-gradient-to-br from-blue-400 to-green-400 overflow-hidden shadow-lg text-gray-600">
            <div className='grid md:flex items-center m-auto justify-center max-w-[350px] md:max-w-[700px] bg-gradient-to-br  rounded-lg shadow-xl'>
                {/* Slogan (màn che) */}
                <div
                    className={`inset - 0 z-10 flex flex-col items-center justify-center text-gray-500 transition-transform duration-700 ease-in-out md:w-[350px] md:h-[500px] p-3 md:rounded-lg`}
                >
                    <h1 className="text-4xl font-bold mb-4">
                        {isRegister ? 'Join Us Today!' : 'Welcome Back!'}
                    </h1>
                    <p className="text-lg">
                        {isRegister
                            ? 'Create an account to explore more!'
                            : 'Login to continue where you left off.'}
                    </p>
                    <button
                        onClick={toggleForm}
                        className="mt-5 px-6 py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-lg hover:bg-gray-100 transition"
                    >
                        {isRegister ? 'Login' : 'Register'}
                    </button>
                </div>

                {/* Form container */}
                <div className="relative w-[350px] h-[500px] rounded-lg  overflow-hidden">
                    {/* Login Form */}
                    <form onSubmit={handleLogin}
                        className={`absolute inset-0 p-8 transition-transform duration-700 ease-in-out ${isRegister ? '-translate-x-full' : ''
                            }`}
                    >
                        <h2 className="text-2xl font-bold text-center mb-5">Login</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Username</label>
                            <input
                                type="text"
                                placeholder="Username"
                                required
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label className="block text-sm font-semibold mb-2">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${showPassword ? 'text-black' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-2 pt-7 flex items-center text-gray-900 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.785a10.451 10.451 0 010 6.43M9.707 9.707a1 1 0 01-1.414-1.414M12 6.5c5.25 0 9.5 4 9.5 5.5s-4.25 5.5-9.5 5.5S2.5 12 2.5 10.5c0-1.5 4.25-5.5 9.5-5.5z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5C7.026 4.5 3.001 8.2 3.001 9.5c0 1.3 4.025 5 8.999 5s8.999-3.7 8.999-5c0-1.3-4.025-5-8.999-5zM3.98 8.785a10.451 10.451 0 010 6.43m16.04-6.43a10.451 10.451 0 010 6.43"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <button type='submit' className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600">
                            Login
                        </button>
                        <div className="mt-4 flex flex-col items-center">
                            <p className="text-sm text-gray-600 mb-3">Or login with</p>
                            <div className="flex gap-4">
                                <button
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => signIn('facebook')}
                                >
                                    {/* Facebook Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                                        <path d="M22.675 0h-21.35c-.734 0-1.325.591-1.325 1.325v21.351c0 .733.591 1.324 1.325 1.324h11.495v-9.294h-3.126v-3.622h3.126v-2.672c0-3.1 1.892-4.788 4.657-4.788 1.325 0 2.464.099 2.794.143v3.239h-1.918c-1.506 0-1.796.716-1.796 1.765v2.313h3.592l-.467 3.622h-3.125v9.294h6.126c.733 0 1.324-.591 1.324-1.324v-21.351c0-.734-.591-1.325-1.325-1.325z" />
                                    </svg>
                                </button>
                                <button
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white"
                                    onClick={() => signIn('google')}
                                >
                                    {/* Google Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                                        <path d="M23.705 12.249c0-.828-.075-1.622-.217-2.396h-11.488v4.537h6.573c-.283 1.503-1.106 2.777-2.354 3.634v3.005h3.802c2.219-2.042 3.484-5.046 3.484-8.78z" />
                                        <path d="M12 24c3.24 0 5.951-1.073 7.934-2.916l-3.802-3.005c-1.065.714-2.419 1.137-4.132 1.137-3.179 0-5.872-2.148-6.833-5.02h-3.946v3.125c1.978 3.91 6.061 6.679 10.779 6.679z" />
                                        <path d="M5.167 14.196c-.263-.782-.413-1.617-.413-2.49s.15-1.708.413-2.49v-3.124h-3.946c-.802 1.594-1.254 3.39-1.254 5.614s.452 4.02 1.254 5.614l3.946-3.124z" />
                                        <path d="M12 4.868c1.764 0 3.34.607 4.583 1.8l3.434-3.433c-2.051-1.917-4.773-3.099-8.017-3.099-4.718 0-8.801 2.769-10.779 6.678l3.946 3.125c.961-2.873 3.655-5.021 6.833-5.021z" />
                                    </svg>
                                </button>
                                <button
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-black hover:bg-gray-800 text-white"
                                    onClick={() => signIn('github')}
                                >
                                    {/* GitHub Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                                        <path d="M12 0c-6.63 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.612-4.042-1.612-.546-1.387-1.333-1.756-1.333-1.756-1.09-.744.084-.729.084-.729 1.205.084 1.838 1.238 1.838 1.238 1.07 1.834 2.807 1.305 3.492.998.108-.775.418-1.305.762-1.604-2.665-.303-5.467-1.332-5.467-5.93 0-1.31.469-2.382 1.236-3.22-.124-.303-.536-1.523.117-3.176 0 0 1.009-.323 3.3 1.23.957-.266 1.983-.399 3.003-.403 1.02.004 2.047.137 3.006.403 2.29-1.554 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.838 1.235 1.91 1.235 3.22 0 4.61-2.807 5.625-5.479 5.921.43.37.814 1.103.814 2.222 0 1.606-.015 2.897-.015 3.293 0 .319.192.694.8.576 4.765-1.588 8.2-6.086 8.2-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Register Form */}
                    <div
                        className={`absolute inset-0 p-8 transition-transform duration-700 ease-in-out ${isRegister ? '' : 'translate-x-full'
                            }`}
                    >
                        <h2 className="text-2xl font-bold text-center mb-5">Register</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Username</label>
                            <input
                                type="text"
                                placeholder="Username"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label className="block text-sm font-semibold mb-2">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Password"
                                required
                                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${showPassword ? 'text-black' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-2 pt-7 flex items-center text-gray-900 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.98 8.785a10.451 10.451 0 010 6.43M9.707 9.707a1 1 0 01-1.414-1.414M12 6.5c5.25 0 9.5 4 9.5 5.5s-4.25 5.5-9.5 5.5S2.5 12 2.5 10.5c0-1.5 4.25-5.5 9.5-5.5z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5C7.026 4.5 3.001 8.2 3.001 9.5c0 1.3 4.025 5 8.999 5s8.999-3.7 8.999-5c0-1.3-4.025-5-8.999-5zM3.98 8.785a10.451 10.451 0 010 6.43m16.04-6.43a10.451 10.451 0 010 6.43"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <button className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
                            Register
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default LoginForm;