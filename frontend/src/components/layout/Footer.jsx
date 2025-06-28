import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaDiscord,
  FaTelegram,
  FaGithub,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="px-6 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-gray-700 pt-8">
        {/* Left: Logo + Socials */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="CourseHive"
              className="w-10 h-10 rounded-full"
            />
            <h1 className="text-2xl text-orange-500 font-bold">CourseHive</h1>
          </div>
          <div className="mt-4">
            <p className="mb-2 font-medium">Follow Us</p>
            <div className="flex space-x-4">
              <a href="#">
                <FaFacebook className="text-2xl text-gray-400 hover:text-blue-400 transition" />
              </a>
              <a href="#">
                <FaInstagram className="text-2xl text-gray-400 hover:text-pink-600 transition" />
              </a>
              <a href="#">
                <FaTwitter className="text-2xl text-gray-400 hover:text-blue-500 transition" />
              </a>
              <a href="#">
                <FaYoutube className="text-2xl text-gray-400 hover:text-red-600 transition" />
              </a>
            </div>
          </div>
        </div>

        {/* Middle: Community */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-4">Join the Community</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="group flex items-center space-x-2 cursor-pointer">
              <FaDiscord className="text-2xl text-gray-400 group-hover:text-[#5865F2] transition" />
              <a href="#" className="group-hover:text-white transition">
                Discord – Learn & collaborate
              </a>
            </li>
            <li className="group flex items-center space-x-2 cursor-pointer">
              <FaTelegram className="text-2xl text-gray-400 group-hover:text-[#0088cc] transition" />
              <a href="#" className="group-hover:text-white transition">
                Telegram – Updates & chat
              </a>
            </li>
            <li className="group flex items-center space-x-2 cursor-pointer">
              <FaGithub className="text-2xl text-gray-400 group-hover:text-white transition" />
              <a href="#" className="group-hover:text-white transition">
                GitHub – Explore our projects
              </a>
            </li>
          </ul>
        </div>

        {/* Right: Legal */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>
              <a href="#" className="hover:text-white transition">
                Terms & Conditions
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Refund & Cancellation
              </a>
            </li>
            <li className="pt-2 text-xs text-gray-500">
              © 2025 CourseHive. All rights reserved.
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
