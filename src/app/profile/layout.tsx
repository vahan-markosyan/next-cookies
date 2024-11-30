import React from "react";
import { logOut } from "../_lib/actions";

interface IProps {
    children: React.ReactNode;
}

export default function Layout({ children }: IProps) {
    return (
        <div className="min-h-screen bg-purple-900 text-white flex flex-col">
            <nav className="bg-purple-800 px-6 py-4 shadow-lg">
                <div className="flex justify-between items-center">
                    <div className="text-gray-100 text-xl font-bold">
                        MyApp
                    </div>
                    <ul className="flex space-x-6">
                        <li className="hover:text-gray-300 transition">
                            <a href="#profile">Profile</a>
                        </li>
                        <li className="hover:text-gray-300 transition">
                            <a href="#settings">Settings</a>
                        </li>
                        <li className="hover:text-gray-300 transition">
                            <a href="#photos">Photos</a>
                        </li>
                        <li className="hover:text-gray-300 transition">
                            <a href="#posts">Posts</a>
                        </li>
                        <button  onClick={logOut} className="hover:text-gray-300 transition">
                            Log Out
                        </button>
                    </ul>
                    <div className="flex items-center space-x-3">
                        <img
                            src="https://via.placeholder.com/40"
                            alt="User"
                            className="w-10 h-10 rounded-full border-2 border-gray-100"
                        />
                        <span className="text-gray-100">John Doe</span>
                    </div>
                </div>
            </nav>
            <main className="flex-grow p-6">{children}</main>
        </div>
    )
}

