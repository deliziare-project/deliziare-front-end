"use client";
import axiosInstance from "@/api/axiosInstance";
import Image from "next/image";
import React, { useState } from "react";
import PostModal from "../ui/PostModal";
import toast from "react-hot-toast";


const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRotated, setIsRotated] = useState(false);



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
      <section className="relative flex items-center justify-between min-h-screen bg-gray-100">
        <div className="pl-20 ml-20">
          <h1 className="text-5xl font-bold text-gray-800 leading-tight">
            Where Every Meal Feels Like <br /> Home
          </h1>
          <p className="mt-4 text-gray-600">
           At Deliziare, we believe food is more than fuel — it’s a feeling. Explore our handcrafted menu, enjoy warm flavors,  <br/> and treat yourself to dishes made with tradition and care. Come hungry. Leave happy.
          </p>
          <div className="mt-6 space-x-4">
            <button className="px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700">
              Order Now
            </button>
            <button className="px-6 py-3 border border-white text-orange-600 rounded-full hover:bg-orange-600 hover:text-white">
              Learn More
            </button>
          </div>
        </div>
        <div>
      <Image
        src="/userSideImage/img1.png"
        alt="image1"
        width={350}
        height={50}
        className={`mr-48 ${isRotated ? 'rotate' : ''}`}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
      <style jsx>{`
        .rotate {
          transform: rotate(90deg);
          transition: transform 0.3s ease;
        }
      `}</style>
    </div>



      </section>

      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="w-1/2">
            <h2 className="text-4xl font-bold text-gray-800">
              We Are Foodu <br /> The Delicious Story
            </h2>
            <p className="mt-4 text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <button className="mt-6 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700">
              Discover More
            </button>
          </div>
          <div className="w-1/2 flex space-x-4">
            <img
              src="https://via.placeholder.com/300"
              alt="Food 1"
              className="w-[300px] h-[300px] rounded-lg object-cover"
            />
            <img
              src="https://via.placeholder.com/300"
              alt="Food 2"
              className="w-[300px] h-[300px] rounded-lg object-cover"
            />
          </div>
        </div>
      </div>

      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 text-center">
            Our Mouth Watering Menus
          </h2>
          <div className="mt-10 grid grid-cols-4 gap-6">
            {["Muffins", "Pancakes", "Bagels", "Oatmeal"].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <img
                  src="https://via.placeholder.com/150"
                  alt={item}
                  className="w-[150px] h-[150px] mx-auto rounded-full object-cover"
                />
                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  {item}
                </h3>
                <p className="mt-2 text-gray-600">
                  Fresh and healthy {item.toLowerCase()} for you.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Upload Post Button and Modal */}
      <>
        <PostModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmitPost={handlePostSubmit}
        />
        <button
          className="fixed bottom-8 right-8 bg-orange-600 text-white w-14 h-14 rounded-full text-3xl shadow-lg hover:bg-orange-700 transition duration-300"
          title="Upload Post"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 text-center">
            Meet Our World-Class Chefs
          </h2>
          <div className="mt-10 grid grid-cols-3 gap-6">
            {["Chef 1", "Chef 2", "Chef 3"].map((chef, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-lg text-center"
              >
                <img
                  src="https://via.placeholder.com/200"
                  alt={chef}
                  className="w-[200px] h-[200px] mx-auto rounded-full object-cover"
                />
                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  {chef}
                </h3>
                <p className="mt-2 text-gray-600">Expert in healthy cuisine.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
