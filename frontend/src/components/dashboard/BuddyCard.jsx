"use client";
import React from 'react';

// Using functional component directly
export const BuddyCard = ({
  name,
  field,
  school,
  year,
  matchPercentage,
  tags,
  subjects,
  avatar
}) => {
  return (
    <article className="grow shrink self-stretch my-auto min-w-60 w-[398px] max-md:max-w-full">
      <div className="px-8 py-8 w-full border border-solid border-neutral-900 rounded-[37px] max-md:px-5 max-md:max-w-full">
        <div className="max-md:mr-2.5 max-md:max-w-full">
          <div className="flex gap-5 max-md:flex-col">
            <div className="w-[83%] max-md:ml-0 max-md:w-full">
              <div className="flex flex-col items-start w-full max-md:mt-10">
                <h3 className="text-2xl font-playfair font-bold text-zinc-900">
                  {name}
                </h3>
                <p className="self-stretch mt-1 text-base font-worksans text-zinc-700">
                  {field}
                </p>
                <div className="flex gap-2.5 mt-2 text-sm leading-8 font-worksans text-zinc-600">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/d1243cfa276a5335a9d1c39d5ad0e116685d4e07?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
                    className="object-contain shrink-0 my-auto aspect-[0.72] w-[13px]"
                    alt="School icon"
                  />
                  <span>{school} · {year}</span>
                </div>
              </div>
            </div>
            <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
              <div className="mt-0 text-xl font-worksans font-medium text-zinc-900 max-md:mt-10 flex flex-col items-center">
                <div>{matchPercentage}</div>
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/5f3cf77c6d759f62993ad8e4a49a304ce57258ce?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
                  className="object-contain mt-2 aspect-[1.07] w-[31px]"
                  alt="Match indicator"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-5 text-sm font-worksans text-zinc-800 flex-wrap max-md:mr-0.5">
          {tags.map((tag, index) => (
            <div key={tag} className="flex-1 bg-white bg-opacity-0 whitespace-nowrap">
              <div className={`px-5 py-2 border border-solid border-stone-700 rounded-full max-md:px-5 ${
                index === 0 ? 'bg-[#efd476]' :
                index === 1 ? 'bg-[#efd476]/50' :
                'bg-[#efd476]/20'
              }`}>
                <span>{tag}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2.5 mt-3 text-sm flex-wrap font-worksans text-zinc-800 max-md:mr-1.5 max-md:max-w-full">
          {subjects.map((subject) => (
            <div key={subject} className="whitespace-nowrap bg-white bg-opacity-0">
              <div className="px-5 py-2 border border-solid bg-transparent border-stone-700 rounded-full max-md:px-5">
                <span>{subject}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 mt-6 w-full text-base font-worksans font-medium text-white max-md:max-w-full">
          <img
            src={avatar}
            className="object-contain shrink-0 rounded-full aspect-square w-[45px] border border-black"
            alt={`${name} avatar`}
          />
          <div className="flex flex-auto gap-2 self-center">
            <button className="bg-transparent outline-none flex-1">
              <div className="flex gap-2 justify-center items-center py-2.5 rounded-xl border border-solid bg-black border-stone-700 hover:bg-neutral-800 transition-colors">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/ba4e8063e77775d13bb3a06dafaa1cb70e46230b?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
                  className="object-contain w-4 aspect-square invert"
                  alt="Details icon"
                />
                <span>Show details</span>
              </div>
            </button>
            <button className="bg-transparent outline-none flex-1">
              <div className="flex gap-2 justify-center items-center py-2.5 rounded-xl border border-solid bg-black border-stone-700 hover:bg-neutral-800 transition-colors">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/30086d0c3716290a85ee494c7bd49c3e246ef74e?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
                  className="object-contain w-4 aspect-square invert"
                  alt="Connect icon"
                />
                <span>Connect</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};