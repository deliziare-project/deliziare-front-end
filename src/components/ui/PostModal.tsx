"use client";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import InputBox from "./InputBox";
import dynamic from "next/dynamic";

const ChefLocationPicker = dynamic(() => import('@/components/LocationPicker'), {
  ssr: false,
});
interface FormInputData {
  eventName: string;
  locationLat: number;
  locationLng: number;
  date: string;
  time: string;
  district: string;
  quantity: number;
  menu: string;
  description: string;
}

interface PostFormData {
  eventName: string;
  location: {
    lat: number;
    lng: number;
  };
  date: string;
  time: string;
  district: string;
  quantity: number;
  menu: string[];
  description: string;
}

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (data: PostFormData) => void;
}

const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  onSubmitPost,
}) => {
  const { register, handleSubmit, reset, setValue } = useForm<FormInputData>();

  const onSubmit: SubmitHandler<FormInputData> = (data) => {
    console.log("Submitted",data);
    const postData: PostFormData = {
      eventName: data.eventName,
      location: {
        lat: data.locationLat,
        lng: data.locationLng,
      },
      date: data.date,
      time: data.time,
      district: data.district,
      quantity: data.quantity,
      menu: data.menu.split(",").map((item) => item.trim()),
      description: data.description,
    };

    onSubmitPost(postData);
    reset();
    onClose();
    console.log("post",postData);
    
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white p-10  rounded-lg max-h-screen max-w-2xl relative overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Upload a Post
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-600">
          {/* Event Name */}
          <div className="text-gray-600">
            <InputBox
              label="Event Name"
              name="eventName"
              register={register}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600">
            <InputBox
              label="District"
              name="district"
              register={register}
              required

            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
            <InputBox
              label="Date"
              name="date"
              register={register}
              
              type="date"
              required
            />
            <InputBox
              label="Time"
              name="time"
              register={register}
              type="time"
              required
            />
          </div>

          {/* Quantity */}
          <InputBox
            label="Quantity"
            name="quantity"
            register={register}
            type="number"
            required
          />

          {/* Menu */}
          <InputBox
            label="Menu (comma separated)"
            name="menu"
            register={register}
            placeholder="Rice, Curry, Salad"
            required
          />

          <ChefLocationPicker
            onLocationChange={(lat, lng) => {
              setValue("locationLat", lat);
              setValue("locationLng", lng);
            }}
          />

          {/* Description */}
          <InputBox
            label="Description"
            name="description"
            register={register}
            required
          />

          <button
            type="submit"
            className="w-full py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Submit Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostModal;
