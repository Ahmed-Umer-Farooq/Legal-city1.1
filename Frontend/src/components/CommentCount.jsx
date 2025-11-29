import React from 'react';
import { MessageCircle } from 'lucide-react';

const CommentCount = ({ count = 0, className = "" }) => {
  return (
    <div className={`flex items-center gap-1 text-gray-500 ${className}`}>
      <MessageCircle size={16} />
      <span className="text-sm">
        {count} {count === 1 ? 'comment' : 'comments'}
      </span>
    </div>
  );
};

export default CommentCount;