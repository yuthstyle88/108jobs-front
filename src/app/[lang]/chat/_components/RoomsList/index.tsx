"use client";

import React, {useMemo} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useChatRooms} from '@/contexts/ChatRoomsContext';

const RoomsList: React.FC = () => {
  const { rooms, isLoading, error, loadMore, hasMore } = useChatRooms();

  const content = useMemo(() => {
    if (isLoading && rooms.length === 0) return <div className="p-4">Loading chats…</div>;
    if (error) return <div className="p-4 text-red-500">Failed to load chats.</div>;
    if (!rooms.length) return <div className="p-4">No conversations yet.</div>;
    return (
      <ul className="divide-y">
        {rooms.map((r) => (
          <li key={r.id} className="p-3 hover:bg-gray-50 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <Link className="font-medium truncate" href={`/chat/message/${r.id}`}>{r.name}</Link>
                {r.unreadCount > 0 && (
                  <span className="ml-2 text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">{r.unreadCount}</span>
                )}
              </div>
              {r.lastMessage && (
                <div className="text-sm text-gray-500 truncate">
                  {r.lastMessage.content}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }, [rooms, isLoading, error]);

  return (
    <div className="w-full">
      {content}
      {hasMore && (
        <div className="p-3">
          <button onClick={loadMore} className="w-full border rounded px-3 py-2 hover:bg-gray-50 disabled:opacity-50" disabled={isLoading}>
            {isLoading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoomsList;
