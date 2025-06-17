"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { ChefHat, Star, MapPin } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";

type Chef = {
    _id: string;
    chefId: {
      name: string;
      profileImage: string;
    };
    
  };

export function FeaturedChefs() {
    const [chefs, setChefs] = useState<Chef[]>([]);


  useEffect(() => {
    const fetchChefs = async () => {
      try {
        const res = await axiosInstance.get("/chefs/all");
        const data = res.data;
        console.log('chef',data);
        
        
          setChefs(data);
          
          
        
      } catch (err) {
        console.error("Failed to fetch chefs:", err);
      }
    };

    fetchChefs();
  }, []);
  console.log(chefs);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Our Featured <span className="text-[#B87333]">Chefs</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover talented culinary artists ready to create exceptional dining experiences for your next event. Each chef brings unique expertise and passion.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 justify-center">

          {chefs.slice(0, 3).map((chef, index) => (
            <motion.div
              key={chef._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={chef.chefId.profileImage || "/default-chef.jpg"}
                  alt={chef.chefId.name}
                  fill
                  className="object-cover"
                />
                {/* <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">{chef.rating || "4.5"}</span>
                </div> */}
              </div>

              <div className="p-6">
                {/* <div className="flex items-center mb-2">
                  <ChefHat className="h-5 w-5 text-[#B87333] mr-2" />
                  <span className="text-sm text-gray-600 font-medium">{chef.specialty || "General"}</span>
                </div> */}

                <h3 className="text-xl font-bold mb-2">{chef.chefId.name}</h3>

                {/* <div className="flex items-center text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{chef.district || "Unknown"}</span>
                </div>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3">{chef.bio || "No bio available."}</p>

                <Link href={`/chefs/${chef._id}`}>
                  <Button className="w-full bg-[#B87333] hover:bg-[#a05f2a] text-white">
                    View Profile
                  </Button>
                </Link> */}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
            <Link href="/register">
                <button
                className="inline-block px-6 py-3 rounded-full border border-[#B87333] bg-[#B87333] text-white font-semibold text-lg shadow-md hover:bg-[#a05f2a] hover:shadow-lg transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#B87333] cursor-pointer"
                >
                View All Chefs
                </button>
            </Link>
            </div>

      </div>
    </section>
  );
}
