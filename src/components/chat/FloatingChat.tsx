// components/chat/FloatingChat.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { 
  closeChat, 
  toggleMinimize, 
  updatePosition, 
  updateSize 
} from '@/features/chatSlice'
import ChatLayout from '@/components/chat/ChatLayout'

export default function FloatingChat() {
  const dispatch = useDispatch()
  const {
    isChatOpen,
    currentChatId,
    isMinimized,
    position,
    size
  } = useSelector((state: RootState) => state.chat)

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 })
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 })
  
  const chatRef = useRef<HTMLDivElement>(null)
  const minWidth = 300
  const minHeight = 200
  const maxWidth = 800
  const maxHeight = 800

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    setResizeStartSize({ width: size.width, height: size.height })
    setResizeStartPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      
      // Keep within viewport bounds
      const boundedX = Math.max(0, Math.min(window.innerWidth - size.width, newX))
      const boundedY = Math.max(0, Math.min(window.innerHeight - (isMinimized ? 64 : size.height), newY))
      
      dispatch(updatePosition({
        x: boundedX,
        y: boundedY
      }))
    } else if (isResizing) {
      const widthDiff = e.clientX - resizeStartPos.x
      const heightDiff = e.clientY - resizeStartPos.y
      
      const newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartSize.width + widthDiff))
      const newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartSize.height + heightDiff))
      
      dispatch(updateSize({
        width: newWidth,
        height: newHeight
      }))
      
      // Adjust position if resizing would push window out of viewport
      const newX = Math.min(position.x, window.innerWidth - newWidth)
      const newY = Math.min(position.y, window.innerHeight - newHeight)
      
      if (newX !== position.x || newY !== position.y) {
        dispatch(updatePosition({
          x: newX,
          y: newY
        }))
      }
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragOffset, resizeStartSize, resizeStartPos])

  if (!isChatOpen || !currentChatId) return null

  return (
    <div
      ref={chatRef}
      className={`fixed z-51 ${isMinimized ? 'h-16' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isMinimized ? '16rem' : `${size.width}px`,
        height: isMinimized ? '4rem' : `${size.height}px`,
        cursor: isDragging ? 'grabbing' : 'default',
        minWidth: isMinimized ? '16rem' : `${minWidth}px`,
        minHeight: isMinimized ? '4rem' : `${minHeight}px`,
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
      }}
    >
      <div
        className={`bg-white rounded-lg shadow-xl overflow-hidden flex flex-col h-full ${
          isMinimized ? 'border border-gray-300' : ''
        }`}
      >
        {/* Header with drag handle */}
        <div
          className="bg-gray-800 text-white p-2 flex justify-between items-center cursor-move"
          onMouseDown={handleMouseDown}
        >
          <span className="font-semibold truncate">
         Chat
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => dispatch(toggleMinimize())}
              className="hover:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center"
            >
              {isMinimized ? '+' : '-'}
            </button>
            <button
              onClick={() => dispatch(closeChat())}
              className="hover:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {!isMinimized && currentChatId&&(
          <>
            <div className="flex-1 overflow-hidden">
              <ChatLayout recipientId={currentChatId} />
            </div>
            {/* Resize handle */}
            <div
              className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize bg-gray-300 hover:bg-gray-400"
              onMouseDown={handleResizeMouseDown}
            />
          </>
        )}
      </div>
    </div>
  )
}