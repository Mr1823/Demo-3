import React from "react";
import "./Hero.css";
import Slider from "react-slick";
import img1 from "../../../assets/carousel 1.jpg";
import img2 from "../../../assets/carousel 2.jpg";
import img3 from "../../../assets/carousel 3.jpg";
import img4 from "../../../assets/carousel 4.jpg";
import img5 from "../../../assets/carousel 5.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  const settings = {
    arrows: false,
    fade: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 6000,
    cssEase: "ease",
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div id="hero" className="w-full relative overflow-hidden">
      <Slider {...settings}>
        <div className="hero-slide">
          <img src={img1} alt="Slide 1" />
          <div className="hero-text">
            <h1 className="">Romance</h1>
            <button>SHOP NOW</button>
          </div>
        </div>
        <div className="hero-slide">
          <img src={img2} alt="Slide 2" />
          <div className="hero-text">
            <h1 className="">Charms</h1>
            <button>SHOP NOW</button>
          </div>
        </div>
        <div className="hero-slide">
          <img src={img3} alt="Slide 3" />
          <div className="hero-text">
            <h1 className="">Pearls</h1>
            <button>SHOP NOW</button>
          </div>
        </div>
        <div className="hero-slide">
          <img src={img4} alt="Slide 4" />
          <div className="hero-text">
            <h1 className="">Richstones</h1>
            <button>SHOP NOW</button>
          </div>
        </div>
        <div className="hero-slide">
          <img src={img5} alt="Slide 5" />
          <div className="hero-text">
            <h1 className="">Diamonds</h1>
            <Link to={"/shop"}>
              <button>SHOP NOW</button>
            </Link>
          </div>
        </div>
      </Slider>
    </div>
  );
};

export default Hero;

