import React from "react";
import "./Instagram.css";
import insta1 from "../../../assets/instagram/instagram1-1.png";
import insta2 from "../../../assets/instagram/instagram2-1.png";
import insta3 from "../../../assets/instagram/instagram3-2-194x300.png";
import insta4 from "../../../assets/instagram/instagram4-2.png";
import insta5 from "../../../assets/instagram/instagram5-2.png";
import { FaInstagram } from "react-icons/fa6";
import AnimateText from "@moxy/react-animate-text";

const Instagram = () => {
  const instaImgs = [insta1, insta2, insta3, insta4, insta5];
  return (
    <section id="connect" className="container pt-6 mb-12 px-4 md:px-0">
      <div className="flex items-center md:items-end justify-between">
        <h3
          style={{ fontFamily: "var(--italiana)" }}
          className="text-xl md:text-4xl text-black font-bold tracking-wider w-[50%]"
        >
          <AnimateText initialDelay={0.2} wordDelay={0.2}>
            <span>Follow Us On Instagram</span>
          </AnimateText>
        </h3>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          style={{ fontFamily: "var(--poppins)" }}
          className="text-xs md:text-lg underline"
        >
          <h5>OUR INSTAGRAM</h5>
        </a>
      </div>

      <div className="md:grid md:grid-cols-5 gap-x-5 mt-8 overflow-x-auto whitespace-nowrap">
        {instaImgs.map((img, counter) => (
          <div
            key={img}
            className="relative insta-img-con overflow-hidden rounded-xl inline-block h-[300px] w-[60%] md:h-auto md:w-auto md:block mr-6 md:mr-0"
            data-aos="fade-left"
            data-aos-delay={`${counter * 150}`}
          >
            <img src={img} alt="" className="w-full aspect-square object-cover rounded-xl" />
            <div className="insta-img-overlay w-full h-full bg-[#00000066] absolute top-0 left-0 right-0 rounded-xl flex justify-center items-center cursor-pointer opacity-0 hover:opacity-100 transition-all duration-500 ease-in-out">
              <FaInstagram className="text-4xl text-white font-bold" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Instagram;
