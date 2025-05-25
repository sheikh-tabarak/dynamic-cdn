import React from 'react';
import { EmojiEmpty } from 'lucid-react';

const EmptyContainer = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-gray-500 font-sans">
      <EmojiEmpty size={48} className="mb-6 text-gray-400" />
      <h2 className="text-2xl font-semibold mb-2">Not available yet</h2>
      {title && <h3 className="text-xl font-medium text-gray-700 mb-1">{title}</h3>}
      {description && <p className="text-base text-gray-600 max-w-md text-center">{description}</p>}
    </div>
  );
};

export default EmptyContainer;

