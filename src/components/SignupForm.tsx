'use client'
import React, { useState } from "react";
import { userAuthService } from "@/services/userAuthService";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Errors {
    name?: string,
    email?: string,
    password?: string,
}
  
export default function SignupForm() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [message, setMessage] = useState("");
     const [error, setError] = useState<Errors>({});
    const { signup } = userAuthService;
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError({})
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if(!validation()) return;
            const response = await signup(formData.name, formData.email, formData.password);
            if (response) {
               alert('Signup completed. Please login and continue');
               router.push('/login');
            };
        } catch (error) {
            console.log(error);
            setMessage("Signup failed. Please try again.");
        }
    };

    
    const validation = () => {
        const newError:Errors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!formData.name.trim()){
            newError.name = 'Name is required'
        };

        if (!formData.email.trim()) {
          newError.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newError.email = 'Enter a valid email address';
        }
        
  
        if (!formData.password.trim()) {
          newError.password = 'Password is required';
        };

        setError(newError);
       return Object.keys(newError).length === 0;
      }
    

    return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-8">
    <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-sm"
    >
        <h2 className="text-3xl font-bold text-center mb-6 text-indigo-700">Signup</h2>

        <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Name</span>
        <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-gray-800"
        />
                <span className="text-red-600 mt-2">{ error?.name &&   error.name}</span>

        </label>

        <label className="block mb-4">
        <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
        <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-gray-800"
        />
                <span className="text-red-600 mt-2">{ error?.email &&   error.email}</span>

        </label>

        <label className="block mb-6">
        <span className="block text-sm font-medium text-gray-700 mb-1">Password</span>
        <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none text-gray-800"
        />
        <span className="text-red-600 mt-2">{ error?.password &&   error.password}</span>

        </label>
        <p className="text-gray-600 text-center">I have an account ! <Link href={'/login'} className="text-blue-700">Login</Link></p>
        <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 mt-1 rounded-lg transition"
        >
        Signup
        </button>

        {message && (
        <p className="text-center mt-4 text-sm text-red-600 font-medium">
            {message}
        </p>
        )}
    </form>
    </div>
    );
}
