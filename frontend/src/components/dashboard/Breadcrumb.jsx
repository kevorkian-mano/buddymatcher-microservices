import React from 'react';
import { Link } from 'react-router-dom';

export const Breadcrumb = () => {
  return (
    <nav className="flex gap-1.5 items-center self-start mt-6 text-lg font-worksans font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/9836bc02e9cb8cf46a3d7d79c3cf332540d78c29?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
        className="object-contain shrink-0 self-stretch my-auto aspect-[0.89] w-[24px] opacity-70"
        alt="Back arrow"
      />
      <Link to="/" className="self-stretch my-auto hover:underline">
        Back to Home
      </Link>
    </nav>
  );
};