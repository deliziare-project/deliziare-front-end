import { useState, useEffect } from "react";

const toRad = (value: number) => (value * Math.PI) / 180;
const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const PaymentSummary = ({ bidAmount, chefLocation, eventLocation }: {
  bidAmount: number;
  chefLocation: { lat: number; lng: number };
  eventLocation: { lat: number; lng: number };
}) => {
  const [distance, setDistance] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const gst = 10;
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (chefLocation && eventLocation) {
      const dist = calculateDistanceKm(
        chefLocation.lat,
        chefLocation.lng,
        eventLocation.lat,
        eventLocation.lng
      );
      const charge = Math.ceil(dist * 27);
      setDistance(dist);
      setDeliveryCharge(charge);
      setTotal(bidAmount + gst + charge);
    }
  }, [bidAmount, chefLocation, eventLocation]);

  return (
    <div className="mt-4 p-4 ">
      <h3 className="text-md font-semibold mb-2">Payment Summary</h3>
      <div className="flex justify-between">
        <span>Base Amount:</span>
        <span>₹{bidAmount}</span>
      </div>
      <div className="flex justify-between">
        <span>GST:</span>
        <span>₹{gst}</span>
      </div>
      <div className="flex justify-between">
        <span>Delivery Charge (₹27/km):</span>
        <span>₹{deliveryCharge}</span>
      </div>
      <div className="flex justify-between mt-2 font-bold">
        <span>Total Payable:</span>
        <span>₹{total}</span>
      </div>
    </div>
  );
};

export default PaymentSummary;
