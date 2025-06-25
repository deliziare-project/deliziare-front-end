"use client";
import axiosInstance from "@/api/axiosInstance";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import PostModal from "../ui/PostModal";
import toast from "react-hot-toast";
import { Chef } from "@/types/chef";
import Allchefpost from "../home/Allchefpost";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";

const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePostSubmit = async (data: any) => {
    try {
      const res = await axiosInstance.post("/posts/create", data, {
        headers: { "Content-Type": "application/json" },
      });
      console.log(res.data);

      toast("Post submitted successfully");
    } catch (error) {
      alert("Error creating post");
    }
  };

  const handleClick = () => {
    setIsRotated(!isRotated);
  };

  return (
    <>
      <div className="relative -mt-17">
        {" "}
        {/* <div className="relative"> */}
        {/* Blurred Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-2xl z-0 opacity-70"
          style={{
            backgroundImage: "url('/userSideImage/img3.gif')",
          }}
        ></div>
        <div className="absolute inset-0 bg-white z-10 "></div>
        <div className="relative z-10">
          <section
            id="home"
            className="relative min-h-screen flex items-center overflow-hidden pt-16"
          >
            <div className="absolute top-0 right-0 w-1/3 h-[850px] z-0">
              <svg
                className="absolute top-0  w-full h-full"
                viewBox="0 0 800 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M200 0C150 100 100 200 150 300C200 400 250 500 300 600H800V0H200Z"
                  fill="url(#rightGradient)"
                />
                <path
                  d="M300 0C250 80 200 160 250 240C300 320 350 400 400 480C450 560 500 600 550 600H800V0H300Z"
                  fill="url(#rightGradient2)"
                  fillOpacity="0.7"
                />
                 <path
    d="M0 550 C 200 620, 600 520, 800 580 L800 600 L0 600 Z"
    fill="#ffffff" // Change to your background color
  />
                <defs>
                  <linearGradient
                    id="rightGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="50%"
                  >
                    <stop offset="0%" stopColor="#708A58" />
                    <stop offset="50%" stopColor="#708A58" />
                    <stop offset="100%" stopColor="#708A58" />
                  </linearGradient>
                  <linearGradient
                    id="rightGradient2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="50%"
                  >
                    <stop offset="0%" stopColor="#708A58" />
                    <stop offset="50%" stopColor="#708A58" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
                {/* Left Content - Text */}
                <div className="text-left space-y-8">
                  {/* <div className="inline-flex items-center px-4 py-2 bg-green-50 rounded-full text-green-700 text-sm font-medium">
                    <Star className="w-4 h-4 mr-2 fill-current" />
                    Welcome to Fast Order
                  </div> */}

                  <div className="space-y-4">
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight tracking-tight">
                      <span className="text-gray-900">Where Every Meal</span>
                      <br />
                      <span className="text-gray-900">Feels Like</span>
                      <br />
                      <span className="bg-gradient-to-r from-[#2D4F2B] via-[#16610E] to-[#708A58] bg-clip-text text-transparent">
                        Home
                      </span>
                    </h1>

                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-md sm:max-w-lg">
                      At Deliziare, we believe food is more than fuel — it's a feeling. Explore our handcrafted menu, enjoy warm flavors, and treat yourself to dishes made with tradition and care. Come hungry. Leave happy.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <h1 className="flex items-center justify-center px-3 text-[#A4B465]   font-sm text-sm  transition-colors duration-300 ">
                      <ShoppingCart className="w-5 h-5 mr-1" />
                      Order Now
                    </h1>
                    <button className="flex pl-3 pt-2 pb-2 pr-1 items-center justify-center bg-transparent hover:bg-gray-100 text-[#A4B465] font-medium text-lg rounded-full border-2 border-[#A4B465] transition-colors duration-300 shadow-md hover:shadow-lg">
                      View Menu
                      <ArrowRight className="w-5 h-5 ml-1" />
                    </button>
                  </div>
                </div>

                <div className="relative flex justify-center items-center">
                  <div className="relative z-30">
                    <div className="w-80 h-80 rounded-full overflow-hidden shadow-2xl border-4 border-white">
                      <Image
                        src="/userSideImage/img9.png"
                        alt="Featured Dish"
                        width={320}
                        height={320}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                        onClick={handleClick}
                        style={{ cursor: "pointer" }}
                      />
                    </div>

                    {/* Floating Food Icons */}
                    <div className="absolute -top-4 -left-4 bg-white rounded-full p-3 shadow-lg animate-bounce z-40">
                      <div className="text-xl">🍕</div>
                    </div>

                    <div className="absolute top-8 -right-6 bg-white rounded-full p-3 shadow-lg animate-bounce delay-300 z-40">
                      <div className="text-xl">🍔</div>
                    </div>

                    <div className="absolute -bottom-2 -left-6 bg-white rounded-full p-3 shadow-lg animate-bounce delay-700 z-40">
                      <div className="text-xl">🍜</div>
                    </div>

                    <div className="absolute bottom-6 -right-4 bg-white rounded-full p-3 shadow-lg animate-bounce delay-500 z-40">
                      <div className="text-xl">🥗</div>
                    </div>

                    <div className="absolute top-1/2 -left-8 bg-white rounded-full p-3 shadow-lg animate-bounce delay-1000 z-40">
                      <div className="text-xl">🍝</div>
                    </div>

                    <div className="absolute -top-2 right-8 bg-white rounded-full p-3 shadow-lg animate-bounce delay-200 z-40">
                      <div className="text-xl">🌮</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <Allchefpost />
          <div className=" px-8 py-10 bg-white relative overflow-hidden ml-15 mr-15 mt-7">
      {/* Background decorative elements */}
      {/* <div className="absolute top-0 left-0 w-52 h-64 opacity-90">
        <Image
          src="/userSideImage/leaf.png" 
          alt="decorative leaf" 
          width={100}
          height={100}
          className=" mr-80 mt-40 object-contain "
        />
      </div> */}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-2xl font-semibold text-gray-900 mb-4">
            WHY CHOOSE US?
          </h2>
          <p className="text-[#2D4F2B] text-md max-w-2xl mx-auto leading-relaxed">
            We are committed to bringing you the freshest quality food 
            with the most affordable price in town
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Serve Healthy Food */}
          <div className="text-center group">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-[#708A58] rounded-full flex items-center justify-center ">
                {/* Leaf/Health Icon */}
                <svg className="w-10 h-10 text-[#ffff]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Serve Healthy Food
            </h3>
            <p className="text-[#2D4F2B] leading-relaxed">
              Every dish is prepared with the freshest ingredients and 
              nutrition-focused recipes to keep you healthy and satisfied
            </p>
          </div>

          {/* Best Quality */}
          <div className="text-center group">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-[#708A58] rounded-full flex items-center justify-center ">
                {/* Quality/Award Icon */}
                <svg className="w-10 h-10 text-[#ffff]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5,16L3,5L8.5,12L12,4L15.5,12L21,5L19,16H5M19,19A1,1 0 0,1 18,20H6A1,1 0 0,1 5,19V18H19V19Z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Best Quality
            </h3>
            <p className="text-[#2D4F2B] leading-relaxed">
              Premium ingredients and expert preparation ensure every meal 
              meets our high standards of excellence and taste
            </p>
          </div>

          {/* Fast Delivery */}
          <div className="text-center group">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-[#708A58] rounded-full flex items-center justify-center">
                {/* Delivery/Speed Icon */}
                <svg className="w-10 h-10 text-[#ffff]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3,4A2,2 0 0,0 1,6V17H3A3,3 0 0,0 6,20A3,3 0 0,0 9,17H15A3,3 0 0,0 18,20A3,3 0 0,0 21,17H23V12L20,8H17V4M10,6L14,10L10,14V11H4V9H10M17,9.5H19.5L21.47,12H17M6,15.5A1.5,1.5 0 0,1 7.5,17A1.5,1.5 0 0,1 6,18.5A1.5,1.5 0 0,1 4.5,17A1.5,1.5 0 0,1 6,15.5M18,15.5A1.5,1.5 0 0,1 19.5,17A1.5,1.5 0 0,1 18,18.5A1.5,1.5 0 0,1 16.5,17A1.5,1.5 0 0,1 18,15.5Z"/>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Fast Delivery
            </h3>
            <p className="text-[#2D4F2B] leading-relaxed">
              Quick and reliable delivery service ensures your food arrives 
              hot and fresh right to your doorstep
            </p>
          </div>

        </div>
      </div>
    </div>

          <>
            <PostModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmitPost={handlePostSubmit}
            />
            <button
              className="fixed top-20 cursor-pointer right-8 bg-[#A4B465] text-white w-14 h-14 rounded-full text-3xl shadow-lg hover:bg-orange-700 transition duration-300 z-80"
              title="Upload Post"
              onClick={() => setIsModalOpen(true)}
            >
              +
            </button>
          </>
        </div>
        
      </div>
    </>
  );
};

export default Home;
