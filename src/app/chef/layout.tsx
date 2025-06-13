'use client';

import ChefNavbar from '@/components/chef/chefNavbar';
import ChefSidebar from '@/components/chef/chefSidebar';
import ToastProvider from '@/components/shared/ToastProvider';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { FaComment } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function ChefLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const wasDraggingRef = useRef(false);
  const [messageCount, setMessageCount] = useState(0)
  const unreadCount = useSelector((state: RootState) => state.chat.unreadCount);


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

    // Clamp movement
    const clampedX = Math.max(0, Math.min(containerWidth - 60, newX));
    const clampedY = Math.max(0, Math.min(containerHeight - 60, newY));

    // Detect if user moved more than 5px = consider as drag
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
        className="flex"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Sidebar */}
        <div className="w-64 fixed top-0 left-0 h-screen z-50">
          <ChefSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 min-h-screen bg-gray-50">
          <div className="sticky top-0 z-40">
            <ChefNavbar />
          </div>

          {/* Draggable Chat Icon */}
          <div
            className="fixed z-50 bg-[#B8755D] text-white p-3 rounded-full shadow-lg cursor-pointer transition "
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
            }}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
          >
            <FaComment className="h-6 w-6" />

            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>


          <main className="p-6">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
