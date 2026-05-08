import React from "react";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowRight, UserPlus, Cpu, CalendarCheck, Video } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HowItWorksLanding() {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const steps = [
    {
      num: "01",
      title: "Set up your Academic Profile",
      desc: "Tell us your university, major, and the specific courses you're taking. The more detail you provide about your learning style, the better we match.",
      img: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <UserPlus className="w-6 h-6 text-zinc-900" />
    },
    {
      num: "02",
      title: "Let our algorithm do the heavy lifting",
      desc: "Our AI-driven matching engine analyzes thousands of datapoints instantly to suggest the most compatible buddies based on availability and academic goals.",
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <Cpu className="w-6 h-6 text-zinc-900" />
    },
    {
      num: "03",
      title: "Connect & Schedule",
      desc: "Send a quick buddy request. Once accepted, securely chat and pick a time using our integrated availability syncing tool to establish your first session.",
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <CalendarCheck className="w-6 h-6 text-zinc-900" />
    },
    {
      num: "04",
      title: "Jump into focused study sessions",
      desc: "Join a virtual session directly inside your dashboard. Use Pomodoro timers, screen sharing, and shared notes to dominate your syllabus.",
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      icon: <Video className="w-6 h-6 text-zinc-900" />
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 mx-auto max-w-[1220px] w-full px-6 md:px-10">
          
          <section className="pt-16 pb-20 md:pt-24 md:pb-28 text-center max-w-3xl mx-auto relative">
            <motion.div style={{ y: yParallax }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#efd476] rounded-full blur-[120px] opacity-30 -z-10 animate-pulse duration-[4000ms]" />
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[50px] md:text-[72px] font-playfair font-black text-zinc-900 leading-[1.1] tracking-tight mb-8"
            >
              How BuddyMatcher <span className="italic text-[#efd476]">Works</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-zinc-600 font-worksans leading-relaxed"
            >
              We've streamlined the entire process. From finding a peer to crushing your finals, here's how you go from solo to studying together in 4 simple steps.
            </motion.p>
          </section>

          <section className="pb-32 flex flex-col gap-24 md:gap-32 relative">
            {/* Connecting dashed line in background */}
            <motion.div 
              style={{ scaleY: scrollYProgress, transformOrigin: 'top' }}
              className="hidden md:block absolute left-1/2 top-[10%] bottom-[10%] w-0.5 border-l-2 border-dashed border-[#efd476]/50 -translate-x-1/2 -z-10" 
            />

            {steps.map((step, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                key={idx} 
                className={`flex flex-col ${idx % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-20 relative group`}
              >
                
                {/* Center node for desktop */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border-4 border-[#efd476] rounded-full items-center justify-center z-20 shadow-lg group-hover:scale-110 transition-transform duration-500">
                  {step.icon}
                </div>

                <div className="flex-1 w-full relative perspective-1000">
                  <div className="absolute -inset-4 bg-[#efd476]/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="relative overflow-hidden rounded-[32px] shadow-2xl transform group-hover:rotate-y-[5deg] group-hover:-translate-y-2 transition-all duration-700 border-4 border-white">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10 duration-500" />
                    <img 
                      src={step.img} 
                      alt={step.title} 
                      className="w-full aspect-[4/3] object-cover scale-100 group-hover:scale-110 transition-transform duration-1000"
                    />
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col items-start px-4 md:px-0 relative group-hover:translate-x-2 transition-transform duration-500">
                  <div className="absolute -left-10 -top-10 text-[120px] md:text-[180px] font-playfair italic font-black text-[#efd476] leading-none mb-4 md:mb-6 opacity-20 select-none -z-10 group-hover:text-[#eacc5a] transition-colors duration-500">
                    {step.num}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-playfair font-bold text-zinc-900 mb-6 drop-shadow-sm mt-4">
                    {step.title}
                  </h3>
                  <p className="text-lg md:text-xl text-zinc-600 font-worksans leading-relaxed mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-zinc-100 shadow-sm">
                    {step.desc}
                  </p>
                  <Link to="/signup" className="flex items-center gap-2 text-zinc-900 font-bold font-worksans hover:text-[#eacc5a] transition-colors group/btn">
                    <span className="border-b-2 border-transparent group-hover/btn:border-[#eacc5a]">Get started</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </section>

          {/* Call to action at bottom */}
          <section className="pb-32 pt-10 px-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-[#efd476] rounded-[40px] p-12 text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/30 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
              <h2 className="text-[40px] font-playfair font-bold text-zinc-900 mb-6 relative z-10">Start your journey today</h2>
              <p className="text-xl text-zinc-800 font-worksans mb-8 relative z-10 max-w-2xl mx-auto">
                Join our private community and get access to our goal-tracking tools and matching algorithms immediately.
              </p>
              <Link to="/signup" className="inline-block px-10 py-5 bg-zinc-900 text-white font-worksans font-bold text-lg rounded-2xl hover:bg-zinc-800 hover:-translate-y-1 transition-all duration-300 shadow-xl relative z-10">
                Join BuddyMatcher
              </Link>
            </motion.div>
          </section>

        </main>
        
        <Footer />
      </div>
    </>
  );
}