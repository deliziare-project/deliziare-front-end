"use client";
import axiosInstance from "@/api/axiosInstance";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import PostModal from "../ui/PostModal";
import toast from "react-hot-toast";
import { Chef } from "@/types/chef";

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

  // useEffect(() => {
  //   const fetchChefs = async () => {
  //     try {
  //       const response = await axiosInstance.get<Chef[]>(
  //         "/userclient/getChefs"
  //       );
  //       setChefs(response.data);
  //     } catch (error) {
  //       console.error("Failed to load chefs", error);
  //     }
  //   };
  //   fetchChefs();
  // });

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -272, behavior: "smooth" }); // 272px = card width (256px) + gap (16px)
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 272, behavior: "smooth" });
    }
  };

  //============================================foods===============================================

  const foods = [
    {
      id: 1,
      name: "Spicy Fried Rice",
      chef: "Chef Anjali",
      image: "/userSideImage/food/food1.jpg",
      price: "₹180",
    },
    {
      id: 2,
      name: "Grilled Chicken",
      chef: "Chef Raj",
      image: "/userSideImage/food/food2.jpg",
      price: "₹250",
    },
    {
      id: 3,
      name: "Strawberry Pudding",
      chef: "Chef Maria",
      image: "/userSideImage/food/food3.jpg",
      price: "₹120",
    },
    {
      id: 4,
      name: "Chocolate Mousse",
      chef: "Chef Maria",
      image: "/userSideImage/food/food4.jpg",
      price: "₹140",
    },
  ];

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

        <section className="py-20 ">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 text-center">
              Meet Our World-Class Chefs
            </h2>
            <div className="relative flex items-center justify-center mt-10">
              <button
                onClick={scrollLeft}
                className="absolute left-0 z-10 p-2 text-orange-600 rounded-full shadow-lg transition-colors duration-300"
                aria-label="Scroll Left"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div
                ref={scrollRef}
                className="flex flex-row gap-4 overflow-x-hidden scroll-smooth w-[816px]" // 816px = 3 cards (256px each) + 2 gaps (16px each)
              >
                {chefs.map((chef, index) => (
                  <div
                    key={chef._id?.toString() || index}
                    className="w-64 h-80 bg-white shadow-xl rounded-2xl flex flex-col items-center justify-center p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-orange-50 flex-shrink-0"
                  >
                    {/* <img
                    // src={chef.image}
                    alt={chef.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-orange-600 shadow-lg transition-transform duration-300 hover:scale-110"
                  /> */}
                  <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-2 border-orange-500 shadow-lg transition-transform duration-300 hover:scale-105">
                    <Image
                      src="/userSideImage/chef1.jpg"
                      alt="chef"
                      width={100} // specify width
                      height={100}
                      className="rounded-full  border-2 border-orange-500 shadow-lg transition-transform duration-300 hover:scale-105"

                      
                    />
                    </div>

                    <div className="mt-4 font-semi-bold text-center text-xl text-gray-800">
                      Name:{chef.userId.name}
                    </div>
                    <div className="mt-2 text-sm text-gray-600 text-center font-medium">
                      Experience:{chef.experience}
                    </div>
                    {/* <div className="mt-2 text-sm text-gray-600 text-center font-medium">
                      {chef.location.lat},{chef.location.lng}
                    </div> */}
                    <div className="mt-2 text-sm text-gray-600 text-center font-medium">
                      {chef.specialize.join(", ")}
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={scrollRight}
                className="absolute right-0 z-10 p-2  text-orange-600 rounded-full shadow-lg  transition-colors duration-300"
                aria-label="Scroll Right"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
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
            <div className="mt-6 space-x-4">
              <button className="px-6 py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700">
                Order Now
              </button>
              <button className="px-6 py-3 border border-white text-orange-600 rounded-full hover:bg-orange-600 hover:text-white">
                Learn More
              </button>
            </div>
          </div>
        </section>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
          {foods.map((food, index) => (
            <div
              key={food.id}
              className="pt-5 pb-5 max-w-6xl shadow-xl rounded-2xl bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out animate-slideUp flex flex-col items-center backdrop-blur-md"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-48 h-48 object-cover rounded-full border-4 border-amber-100 shadow-md"
              />
              <h2 className="text-2xl font-bold mt-4 text-gray-900 text-center tracking-tight">
                {food.name}
              </h2>
              <p className="text-sm text-gray-600 text-center mt-2 font-medium">
                by {food.chef}
              </p>
              <p className="text-lg font-semibold text-orange-600 mt-3">
                {food.price}
              </p>
             
            </div>
          ))}
        </div>
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

        {/* <section className="py-20 bg-white">
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
                    className="w-[200px] h-[200px] mx-auto rounded-full object-cover "
                  />
                  <h3 className="mt-4 text-xl font-semibold text-gray-800">
                    {chef}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    Expert in healthy cuisine.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section> */}
      </div>
      
    </>
  );
};

export default Home;
