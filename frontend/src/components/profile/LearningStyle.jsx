import React from 'react';

const getStyleConfig = (styleId) => {
  const styles = {
    visual: { title: 'Visual Learner', desc: 'Charts, diagrams & Videos' },
    auditory: { title: 'Auditory', desc: 'Discussion & verbal explanation' },
    reading: { title: 'Reading/Writing', desc: 'Notes, books & written material' },
    handson: { title: 'Hands-on', desc: 'Practice problems & experiments' }
  };
  return styles[styleId] || styles.visual;
};

export const LearningStyle = ({ studyStyle }) => {
  const { title, desc } = getStyleConfig(studyStyle);
  
  return (
    <section className="w-full">
      <h3 className="text-3xl font-playfair font-bold text-zinc-900 mb-4">
        Learning style:
      </h3>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 w-full border-2 border-black rounded-[24px] overflow-hidden bg-[#efd476]">
        
        {/* Style Card details */}
        <div className="flex flex-col p-6 md:p-8 w-full lg:w-1/2 justify-center">
            <div className="bg-white px-6 py-6 border-2 border-black rounded-xl shadow-[4px_4px_0px_#000]">
                <h4 className="text-2xl md:text-3xl font-playfair italic font-bold text-zinc-900 mb-2">
                    {title}
                </h4>
                <p className="text-lg font-worksans font-medium text-zinc-700">
                    {desc}
                </p>
            </div>
        </div>

        {/* Visual asset matching your structure */}
        <div className="hidden lg:flex w-1/2 p-8 justify-center items-center">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/a6b6cc14addf1d02566dd1639abed4d358093210?placeholderIfAbsent=true&apiKey=4da7608a60534d26b82c37ab1c08f865"
              className="object-contain w-full max-w-[400px]"
              alt="Learning style visualization"
            />
        </div>
        
      </div>
    </section>
  );
};