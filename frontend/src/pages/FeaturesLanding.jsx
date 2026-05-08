import React, { useRef } from "react";
import { Header } from "../components/landing/Header";
import { Footer } from "../components/landing/Footer";
import { Link } from "react-router-dom";
import { Brain, Video, GraduationCap, CalendarDays, MessageCircle, TrendingUp } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function FeaturesLanding() {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const yParallaxReverse = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const features = [
    {
      title: "Smart Matching Algorithm",
      desc: "Our engine pairs you with peers based on courses, study goals, preferred times, and learning styles. No more awkward trial and error.",
      icon: <Brain className="w-8 h-8 text-zinc-900" strokeWidth={2} />
    },
    {
      title: "Integrated Video Sessions",
      desc: "Jump straight into studying with built-in virtual rooms, shared whiteboards, and Pomodoro timers to stay laser-focused.",
      icon: <Video className="w-8 h-8 text-zinc-900" strokeWidth={2} />
    },
    {
      title: "Detailed Academic Profiles",
      desc: "Showcase your major, university, and specific subjects. Find people exactly at your level, taking the exact same tests.",
      icon: <GraduationCap className="w-8 h-8 text-zinc-900" strokeWidth={2} />
    },
    {
      title: "Availability Syncing",
      desc: "Connect your calendar and we’ll automatically suggest the best overlaps with your matches. Scheduling made effortless.",
      icon: <CalendarDays className="w-8 h-8 text-zinc-900" strokeWidth={2} />
    },
    {
      title: "Peer Messaging & Invites",
      desc: "Break the ice comfortably. Send connection requests and chat directly on the platform before committing to a study session.",
      icon: <MessageCircle className="w-8 h-8 text-zinc-900" strokeWidth={2} />
    },
    {
      title: "Progress & Stat Tracking",
      desc: "Gamify your learning. Track hours studied, connections made, and see your productivity metrics grow inside your dashboard.",
      icon: <TrendingUp className="w-8 h-8 text-zinc-900" strokeWidth={2} />
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-[#f5f5f5] flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 mx-auto max-w-[1220px] w-full px-6 md:px-10 relative">
          
          {/* Enhanced Feature Hero */}
          <section className="pt-16 pb-20 md:pt-24 md:pb-28 text-center max-w-4xl mx-auto relative group">
            <motion.div style={{ y: yParallax }} className="absolute top-0 right-0 w-64 h-64 bg-[#efd476] rounded-full blur-3xl opacity-20 -z-10" />
            <motion.div style={{ y: yParallaxReverse }} className="absolute bottom-10 left-10 w-48 h-48 bg-[#efd476] rounded-full blur-3xl opacity-20 -z-10" />
            
            <motion.h1 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[50px] md:text-[72px] font-playfair font-black text-zinc-900 leading-[1.1] tracking-tight mb-8"
            >
              Everything you need to <span className="italic text-[#efd476]">ace</span> your next exam.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-xl md:text-2xl text-zinc-600 font-worksans leading-relaxed mb-12"
            >
              BuddyMatcher isn't just a directory—it's a comprehensive environment designed to optimize how you learn alongside your peers.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex gap-4 justify-center items-center"
            >
              <Link to="/signup" className="px-8 py-4 bg-zinc-900 text-white font-worksans font-medium text-lg rounded-xl hover:bg-[#efd476] hover:text-zinc-900 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-2xl">
                Get Started Free
              </Link>
            </motion.div>
          </section>

          {/* Feature Grid */}
          <section className="pb-32 relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  key={i} 
                  className="bg-white p-8 rounded-[32px] border border-zinc-200 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-3 group relative overflow-hidden"
                >
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#efd476]/10 rounded-full blur-2xl group-hover:bg-[#efd476]/30 transition-colors duration-500" />
                  
                  <div className="mb-6 bg-[#efd476] w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-500 shadow-md">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-playfair font-bold text-zinc-900 mb-4 relative z-10">{feature.title}</h3>
                  <p className="text-zinc-600 font-worksans leading-relaxed relative z-10">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Deep Dive Section */}
          <section className="pb-32 relative" style={{ perspective: "1000px" }}>
            <motion.div 
              initial={{ opacity: 0, rotateX: -10, y: 100 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-zinc-900 rounded-[40px] p-10 md:p-20 text-white flex flex-col md:flex-row items-center gap-16 relative overflow-hidden group"
            >
              {/* Animated abstract shapes behind */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#efd476] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000 -translate-y-1/2 translate-x-1/4" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#efd476] rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000 translate-y-1/4 -translate-x-1/4" />

              <div className="flex-1 relative z-10">
                <h2 className="text-[40px] md:text-[56px] font-playfair italic font-bold leading-[1.1] mb-6">
                  Ready to level up your study routine?
                </h2>
                <p className="font-worksans text-lg text-zinc-300 mb-8 max-w-lg">
                  Join thousands of university students matching perfectly with their ideal study partners. Reduce procrastination, hold yourself accountable, and achieve better grades.
                </p>
                <Link to="/signup" className="inline-block px-8 py-4 bg-[#efd476] text-zinc-900 font-bold font-worksans text-lg rounded-xl hover:bg-[#eacc5a] outline outline-2 outline-transparent hover:outline-[#efd476] outline-offset-4 transition-all duration-300 hover:scale-105">
                  Create your profile
                </Link>
              </div>
              <div className="flex-1 w-full relative z-10">
                <div className="relative group-hover:-translate-y-2 transition-transform duration-700">
                  <div className="absolute inset-0 bg-[#efd476] rounded-2xl transform translate-x-4 translate-y-4 shadow-xl" />
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                    alt="Students studying" 
                    className="rounded-2xl object-cover shadow-2xl relative z-10 border-2 border-zinc-800 h-[400px] w-full" 
                  />
                  
                  {/* Floating decorative elements */}
                  <div className="absolute -left-8 top-10 bg-white p-4 rounded-xl shadow-xl z-20 animate-bounce duration-[3000ms]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#efd476] rounded-full flex items-center justify-center">
                        <TrendingUp className="text-zinc-900 w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-zinc-900 font-bold font-worksans text-sm leading-tight">Focus Up 32%</p>
                        <p className="text-zinc-500 font-worksans text-xs">This month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

        </main>
        
        <Footer />
      </div>
    </>
  );
}