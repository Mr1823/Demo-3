import React, { useEffect } from "react";
import "./Home.css";
import Hero from "./Hero/Hero";
import Categories from "./Categories/Categories";
import Featured from "./Featured/Featured";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";
import { useLocation } from "react-router-dom";
import Pace from "pace-js";

const Home = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === "/" && location.hash === "") {
      Pace.restart();
    }
  }, [location]);

  return (
    <div id="home" className="min-h-screen bg-background text-on-background font-body">
      <CustomHelmet title={"Home"} />
      
      {/* Hero and Live Rate Strip */}
      <Hero />
      
      {/* Main Content Canvas */}
      <main className="py-section-gap-sm md:py-section-gap-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto space-y-section-gap-lg">
        <Categories />
        <Featured />
        
        {/* Testimonials */}
        <section className="py-section-gap-lg bg-surface-container-low/50 border-y border-primary/5 -mx-margin-mobile md:-mx-margin-desktop px-margin-mobile md:px-margin-desktop">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <span className="material-symbols-outlined text-5xl text-primary/40">format_quote</span>
            <blockquote className="font-display-lg text-headline-sm md:text-headline-md text-primary italic leading-relaxed">
              "The craftsmanship at Sri Ram Jewellery is unparalleled. Every piece feels like a work of art, a true heirloom that my family will cherish for generations. Their attention to detail and dedication to traditional techniques is truly remarkable."
            </blockquote>
            <div className="space-y-2">
              <p className="font-label-caps text-xs text-on-surface uppercase tracking-[0.4em]">Anjali R.</p>
              <p className="font-body-base text-sm text-on-surface-variant italic">Client since 2010</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
