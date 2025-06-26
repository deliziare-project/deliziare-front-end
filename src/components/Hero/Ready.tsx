"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "../ui/Button";
import { ChevronRight } from "lucide-react";

export function Ready() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-[#B87333] to-[#D4A76A] rounded-3xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('/patterns/pattern-2.svg')] bg-repeat opacity-10"></div>
          
          <div className="relative z-10 py-16 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-xl mb-8 md:mb-0"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Create Memorable Dining Experiences?
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Join Deliziare today to connect with top chefs, plan your perfect event, and delight your guests with exceptional cuisine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  
                  
                  className="bg-white text-[#B87333] hover:bg-gray-100 font-semibold px-8 py-3 rounded-full cursor-pointer"
                >
                  <Link href="/register">
                    Get Started Now
                  </Link>
                </button>
                
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative w-full md:w-1/3 flex justify-center"
            >
              <div className="w-56 h-56 relative">
                <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-4 rounded-full bg-white/30 animate-pulse" style={{ animationDuration: '4s' }}></div>
                <div className="absolute inset-8 rounded-full bg-white/40 animate-pulse" style={{ animationDuration: '5s' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg 
                    className="w-24 h-24 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M19.428 15.428a7 7 0 10-9.899 9.899 7 7 0 009.9-9.9" 
                    />
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M3 13.5l9 6 9-6-9-6-9 6z" 
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}