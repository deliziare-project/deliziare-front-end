import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-gray-400  border-b-4 border-[#708A58] py-10">
      <div className="text-center space-y-4">
        <h2 className="text-[#708A58] text-2xl tracking-widest font-bold">Deliziare</h2>
        {/* <p className="text-red-500 uppercase tracking-wide">Just another tagline</p> */}

        <ul className="flex justify-center gap-6 text-sm font-semibold">
          <li><a href="/user/home" className="hover:text-[#708A58] transition">Home</a></li>
          <li><a href="/user/chefs" className="hover:text-[#708A58] transition">Chef</a></li>
          <li><a href="/user/posts" className="hover:text-[#708A58] transition">Posts</a></li>
        </ul>

        <div className="flex justify-center gap-5 text-xl">
          <a href="#" className="hover:text-[#708A58]"><FaTwitter /></a>
          <a href="#" className="hover:text-[#708A58]"><FaInstagram /></a>
        </div>

        <p className="text-xs mt-4">&copy; 2025 YOURSTORE. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
