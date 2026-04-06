import React from 'react';

export const SessionCard = ({
  title,
  date,
  time,
  location,
  isOnline = false
}) => {
  return (
    <article className="mt-4 w-full rounded-none max-md:max-w-full">
      <div className="px-12 pt-2.5 pb-7 w-full border border-black border-solid bg-zinc-300 bg-opacity-0 rounded-[46px] hover:bg-zinc-50 transition-colors cursor-pointer max-md:px-5 max-md:max-w-full">
        <div className="flex flex-wrap gap-5 justify-between max-md:max-w-full">
          <h3 className="text-3xl md:text-4xl text-zinc-800 font-playfair italic font-bold">
            {title}
          </h3>
          <div className="self-end px-5 py-2 text-sm font-worksans text-white bg-black rounded-xl">
            <span>. Upcoming</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 justify-between mt-7 max-w-full text-base font-worksans text-zinc-800 w-[640px]">
          <div className="flex gap-3.5 self-start">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/16baf00d7ee7b099497681104d674c2fa0afca1e?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
              className="object-contain shrink-0 self-start mt-1.5 aspect-square w-[18px]"
              alt="Calendar icon"
            />
            <time className="basis-auto">{date}</time>
          </div>
          <div className="flex gap-4 items-start">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/b76e7e03347303caf76f0fc19b7453fee9185f06?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
              className="object-contain shrink-0 mt-1 w-5 aspect-[0.95]"
              alt="Clock icon"
            />
            <time className="basis-auto">{time}</time>
            {isOnline && (
              <>
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/7406f6a46a5e4c24dc26a18efc5a2f1516b22a95?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
                  className="object-contain shrink-0 my-auto w-5 aspect-[1.25]"
                  alt="Online meeting icon"
                />
              </>
            )}
          </div>
          <div className="flex gap-3.5 leading-8">
            <img
              src={isOnline ? "https://api.builder.io/api/v1/image/assets/TEMP/d6dfa894108f660424819f075fb3096c0e2601e2?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865" : "https://api.builder.io/api/v1/image/assets/TEMP/cbc61c00956016b479ee19a8bae3940808531be3?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"}
              className="object-contain shrink-0 self-start mt-1 w-3.5 aspect-[0.67]"
              alt="Location icon"
            />
            <address className={`not-italic ${isOnline ? "text-blue-600" : "text-zinc-800"}`}>
              {location}
            </address>
          </div>
        </div>
      </div>
    </article>
  );
};