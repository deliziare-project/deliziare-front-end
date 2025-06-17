"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const eventTypes = [
  {
    id: "corporate-events",
    title: "Corporate Events",
    description: "Impress clients and colleagues with exceptional catering.",
    imageUrl: "/images/corporate.jpg", // Place image in public/images/
  },
  {
    id: "birthday-celebrations",
    title: "Birthday Celebrations",
    description: "Make your birthday special with personalized menus.",
    imageUrl: "/images/birthday.jpg",
  },
  {
    id: "private-dining",
    title: "Private Dining",
    description: "Intimate dining experiences in the comfort of your home.",
    imageUrl: "/images/private-dining.jpg",
  },
  {
    id: "wedding-feasts",
    title: "Wedding Feasts",
    description: "Celebrate your special day with unforgettable cuisine.",
    imageUrl: "/images/wedding.jpg",
  },
];

export function Event() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Plan Your Perfect <span className="text-[#B87333]">Event</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From intimate gatherings to grand celebrations, find the perfect
            chef and menu for any occasion. Customize your experience for an
            unforgettable event.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {eventTypes.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl shadow-md h-72"
            >
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-200 mb-4">{event.description}</p>
                {/* <Link
                  href={`/events/${event.id}`}
                  className="inline-flex items-center text-white bg-[#B87333] bg-opacity-80 hover:bg-opacity-100 transition-all px-4 py-2 rounded-full w-fit"
                >
                  <span>Explore</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link> */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
