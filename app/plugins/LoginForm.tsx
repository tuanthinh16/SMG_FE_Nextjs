'use client'
import React, { useState } from 'react';
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
        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });
        if (result?.error) {
            console.error('Login failed:', result.error);
        } else {
            console.log('Login successful. ', result);

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
                                    title='Login with Facebook'

                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => alert('Coming soon!')}
                                >
                                    {/* Facebook Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                                        <path d="M22.675 0h-21.35c-.734 0-1.325.591-1.325 1.325v21.351c0 .733.591 1.324 1.325 1.324h11.495v-9.294h-3.126v-3.622h3.126v-2.672c0-3.1 1.892-4.788 4.657-4.788 1.325 0 2.464.099 2.794.143v3.239h-1.918c-1.506 0-1.796.716-1.796 1.765v2.313h3.592l-.467 3.622h-3.125v9.294h6.126c.733 0 1.324-.591 1.324-1.324v-21.351c0-.734-.591-1.325-1.325-1.325z" />
                                    </svg>
                                </button>
                                <button
                                    title='Login with Google'
                                    className="flex items-center justify-center w-10 h-10 rounded-full  text-white"
                                    onClick={() => signIn('google')}
                                >
                                    {/* Google Icon */}
                                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 64 64" height="32px" width="24px">
                                        <g fill-rule="evenodd" fill="none" stroke-width="1" stroke="none">
                                            <g fill-rule="nonzero" transform="translate(3.000000, 2.000000)">
                                                <path fill="#4285F4" d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267"></path>
                                                <path fill="#34A853" d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667"></path>
                                                <path fill="#FBBC05" d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120237 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782"></path>
                                                <path fill="#EB4335" d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769"></path>
                                            </g>
                                        </g>
                                    </svg>
                                </button>
                                <button
                                    title='Login with Github'
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