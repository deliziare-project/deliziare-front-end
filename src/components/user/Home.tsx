"use client";
import axiosInstance from "@/api/axiosInstance";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import PostModal from "../ui/PostModal";
import toast from "react-hot-toast";
import { Chef } from "@/types/chef";
import Allchefpost from "../home/Allchefpost";

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
    <div className="bg-gradient-to-r from-orange-300/60 to-white/60">
<section className="relative flex items-center justify-between min-h-screen">
        <div className="pl-20 ml-20">
          <h1 className="text-5xl font-bold text-gray-800 leading-tight">
            Where Every Meal Feels Like <br /> Home
          </h1>
            <p className="mt-4 text-gray-600">
              At Deliziare, we believe food is more than fuel — it’s a feeling.
              Explore our handcrafted menu, enjoy warm flavors, <br /> and treat
              yourself to dishes made with tradition and care. Come hungry.
              Leave happy.
            </p>
           
          </div>
          <div>
            <Image
              src="/userSideImage/img1.png"
              alt="image1"
              width={350}
              height={50}
              // className={`mr-48 ${isRotated ? 'rotate' : ''}`}
              className={`mr-48 ${isRotated ? "rotate-animation" : ""}`}
              onClick={handleClick}
              style={{ cursor: "pointer" }}
            />
            <style jsx>{`
              .rotate {
                transform: rotate(90deg);
                transition: transform 0.3s ease;
              }
            `}</style>
          </div>
        </section>


        <section className="relative flex items-center justify-between min-h-screen">
          <div>
            <Image
              src="/userSideImage/food/foodMain.png"
              alt="image1"
              width={500}
              height={100}
              className="ml-10"
            />
          </div>
          <div className="pl-20 ml-20">
            <h1 className="text-5xl font-bold text-gray-800 leading-tight">
              The best <span className="text-orange-400">Delicious</span> Food
            </h1>
            <p className="mt-4 text-gray-600">
              At Deliziare, we believe food is more than fuel — it’s a feeling.
              Explore our handcrafted menu, enjoy warm flavors, <br /> and treat
              yourself to dishes made with tradition and care. Come hungry.
              Leave happy.
            </p>
            
          </div>
        </section>
       <Allchefpost/>
        

        <>
          <PostModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmitPost={handlePostSubmit}
          />
        <button
          className="fixed top-8 cursor-pointer right-8 bg-orange-600 text-white w-14 h-14 rounded-full text-3xl shadow-lg hover:bg-orange-700 transition duration-300 z-[60]"
          title="Upload Post"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>

        </>

      
      </div>
      
    </>
  );
};

export default Home;
