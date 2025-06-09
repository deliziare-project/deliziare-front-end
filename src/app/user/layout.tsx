'use client';

import ToastProvider from '@/components/shared/ToastProvider';
import Navbar from '@/components/user/Navbar';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { FaComment } from 'react-icons/fa';

export default function UserLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const wasDraggingRef = useRef(false);

  useEffect(() => {
    const updateInitialPosition = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      setPosition({
        x: screenWidth - 80,
        y: screenHeight - 100,
      });
    };
    updateInitialPosition();
    window.addEventListener('resize', updateInitialPosition);
    return () => window.removeEventListener('resize', updateInitialPosition);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    const icon = e.currentTarget.getBoundingClientRect();
    setRel({
      x: e.clientX - icon.left,
      y: e.clientY - icon.top,
    });
    setDragStartPos({ x: e.clientX, y: e.clientY });
    wasDraggingRef.current = false;
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;

    const newX = e.clientX - rel.x;
    const newY = e.clientY - rel.y;
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;

    const clampedX = Math.max(10, Math.min(containerWidth - 70, newX));
    const clampedY = Math.max(10, Math.min(containerHeight - 70, newY));

    if (
      Math.abs(e.clientX - dragStartPos.x) > 5 ||
      Math.abs(e.clientY - dragStartPos.y) > 5
    ) {
      wasDraggingRef.current = true;
    }

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleClick = () => {
    if (!wasDraggingRef.current) {
      router.push('/chat');
    }
  };

  return (
    <ToastProvider>
      <div
        ref={containerRef}
        className="relative w-full min-h-screen bg-white"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Navbar */}
        <Navbar />

        {/* Draggable Chat Icon */}
        <div
          className="fixed z-50 bg-orange-700 hover:bg-orange-600 text-white p-3 rounded-full shadow-xl cursor-pointer transition-all duration-200 ease-in-out"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
        >
          <FaComment className="h-6 w-6 " />
        </div>

        {/* Page Content */}
        <main className="">{children}</main>
      </div>
    </ToastProvider>
  );
}
