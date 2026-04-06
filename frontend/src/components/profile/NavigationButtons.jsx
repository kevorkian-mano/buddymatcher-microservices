import React from 'react';

export const NavigationButtons = ({
  onBack,
  onContinue,
  canContinue = true
}) => {
  return (
    <nav className="flex flex-wrap gap-10 justify-between items-end self-center mt-14 max-w-full text-xl whitespace-nowrap w-[1265px] max-md:mt-10">
      <button
        onClick={onBack}
        className="w-60 rounded-none text-zinc-800 hover:opacity-80 transition-opacity"
      >
        <div className="flex overflow-hidden gap-2.5 justify-center items-center px-6 py-2.5 bg-white rounded-xl border border-black border-solid shadow-sm min-h-[61px] max-md:px-5">
          <span className="self-stretch my-auto w-[100px]">Back</span>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/7301583b286bc836e8ab21de0e2414743c47521d?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
            alt="Back arrow"
            className="object-contain shrink-0 self-stretch my-auto aspect-[0.84] w-[37px]"
          />
        </div>
      </button>

      <button
        onClick={onContinue}
        disabled={!canContinue}
        className={`flex relative gap-2.5 justify-center items-start px-10 py-5 text-white min-h-[60px] min-w-60 w-[494px] max-md:px-5 max-md:max-w-full transition-opacity ${
          canContinue ? 'hover:opacity-90' : 'opacity-50 cursor-not-allowed'
        }`}
      >
        <div className="flex absolute inset-0 z-0 shrink-0 self-start rounded-xl bg-zinc-800 h-[60px] min-w-60 w-[494px] max-md:max-w-full" />
        <span className="z-0 my-auto">Continue</span>
      </button>
    </nav>
  );
};
