import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomHelmet from "../../components/CustomHelmet/CustomHelmet";

const About = () => {
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    // FLAG: Needs POST /contact backend endpoint
    // For now, simulate submission
    setTimeout(() => {
      setContactSubmitting(false);
      setContactSubmitted(true);
      setContactForm({ name: "", email: "", phone: "", message: "" });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#F4EADB] font-body-base text-on-surface">
      <CustomHelmet title={"Our Heritage & Contact"} />

      {/* Section 1: About Us (Our Story) */}
      <section className="py-section-gap-lg px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-24 animate-fade-in-up visible">
          <span className="font-label-caps text-label-caps text-primary tracking-[0.3em] block mb-6">OUR STORY</span>
          <h1 className="font-display-lg text-display-lg md:text-display-lg text-on-surface mb-12">Artisanal Heritage Since 1970</h1>
          <div className="space-y-8 font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            <p>Founded on the principles of uncompromising quality and poetic design, Sri Ram Jewellery began as a small boutique atelier in the heart of the historic district. For over five generations, our master craftsmen have dedicated their lives to the alchemy of precious metals and gemstones.</p>
            <p>Every piece we create is a narrative of tradition meeting modernity. We do not simply design jewellery; we forge heirlooms that carry the weight of memory and the sparkle of future legacies.</p>
          </div>
          <div className="mt-12">
            <div className="w-16 h-px bg-[#c8a684] mx-auto"></div>
          </div>
        </div>
        
        {/* Full-bleed style Editorial Photography */}
        <div className="relative w-full h-[600px] overflow-hidden rounded-lg animate-fade-in-up visible" style={{ transitionDelay: "200ms" }}>
          <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none"></div>
          <img 
            className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out hover:scale-105" 
            alt="A cinematic, high-fidelity close-up of an artisan's weathered hands carefully setting a brilliant diamond into a 22k gold filigree necklace." 
            src="/images/about-artisan.jpg"
          />
        </div>
      </section>

      {/* Section 2: Contact (Get in Touch) */}
      <section className="py-section-gap-lg bg-surface-container-low/30" id="contact">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-2 gap-24 items-start">
          
          {/* Contact Form */}
          <div className="animate-fade-in-up visible">
            <span className="font-label-caps text-label-caps text-primary tracking-[0.3em] block mb-6">GET IN TOUCH</span>
            <h2 className="font-display-lg text-display-lg text-on-surface mb-12">Let’s Start a Conversation</h2>
            <form className="space-y-12" onSubmit={handleContactSubmit}>
              {contactSubmitted && (
                <div className="p-4 bg-success-sage/10 border border-success-sage/30 text-[#4CAF50] text-sm font-semibold flex items-center gap-2 animate-fade-in">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Thank you! We'll get back to you shortly.
                </div>
              )}
              
              <div className="relative group">
                <label className="font-label-caps text-[10px] text-primary block mb-2 opacity-0 group-focus-within:opacity-100 transition-opacity">NAME</label>
                <input 
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:border-primary focus:ring-0 py-4 px-0 font-body-base text-on-surface placeholder:text-on-surface-variant/50 transition-all duration-300 outline-none" 
                  placeholder="Name" 
                  type="text" 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="relative group">
                <label className="font-label-caps text-[10px] text-primary block mb-2 opacity-0 group-focus-within:opacity-100 transition-opacity">EMAIL</label>
                <input 
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:border-primary focus:ring-0 py-4 px-0 font-body-base text-on-surface placeholder:text-on-surface-variant/50 transition-all duration-300 outline-none" 
                  placeholder="Email" 
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="relative group">
                <label className="font-label-caps text-[10px] text-primary block mb-2 opacity-0 group-focus-within:opacity-100 transition-opacity">MESSAGE</label>
                <textarea 
                  className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant focus:border-primary focus:ring-0 py-4 px-0 font-body-base text-on-surface placeholder:text-on-surface-variant/50 resize-none transition-all duration-300 outline-none" 
                  placeholder="How can we assist you?" 
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={contactSubmitting}
                className="bg-primary-container text-on-primary-container font-button-text text-button-text px-12 py-5 hover:scale-[1.02] transition-transform duration-300 inline-flex items-center gap-4 justify-center cursor-pointer disabled:opacity-70 disabled:hover:scale-100"
              >
                {contactSubmitting ? <span className="loading loading-spinner loading-md"></span> : "SEND MESSAGE"}
                {!contactSubmitting && <span className="material-symbols-outlined text-sm">arrow_forward</span>}
              </button>
            </form>
          </div>
          
          {/* Store Details Card */}
          <div className="animate-fade-in-up visible" style={{ transitionDelay: "300ms" }}>
            <div className="bg-[#E6D2BA] p-12 lg:p-16 border-t border-[#c8a684] space-y-12">
              <div>
                <h3 className="font-display-lg text-headline-sm text-primary mb-6">Flagship Boutique</h3>
                <p className="font-body-base text-on-surface-variant leading-relaxed">
                  42 Heritage Square, Jewellery District<br/>
                  Gold Coast, State 40001
                </p>
              </div>
              <div>
                <h3 className="font-display-lg text-headline-sm text-primary mb-6">Concierge</h3>
                <p className="font-body-base text-on-surface-variant">
                  Direct: +1 (555) 890 2341<br/>
                  Email: atelier@sriramjewellery.com
                </p>
              </div>
              <div>
                <h3 className="font-display-lg text-headline-sm text-primary mb-6">Hours</h3>
                <ul className="font-body-base text-on-surface-variant space-y-2">
                  <li className="flex justify-between"><span>Mon - Sat:</span> <span>10:00 AM - 7:00 PM</span></li>
                  <li className="flex justify-between"><span>Sunday:</span> <span>By Appointment</span></li>
                </ul>
              </div>
              <div className="pt-8">
                <div className="relative h-64 w-full grayscale opacity-80 hover:grayscale-0 transition-all duration-700 overflow-hidden group">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Gold Coast, India" 
                    src="/images/about-store.jpg"
                  />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter / Footer Teaser */}
      <section className="py-section-gap-lg border-t border-outline-variant/30 text-center">
        <div className="max-w-2xl mx-auto px-margin-mobile">
          <span className="material-symbols-outlined text-primary mb-6 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <h2 className="font-display-lg text-headline-md text-on-surface mb-6">Experience Artisanal Excellence</h2>
          <p className="font-body-base text-on-surface-variant mb-8">Join our private circle for early access to boutique collections and heritage exhibitions.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              className="bg-surface-container-low border border-[#c8a684]/30 px-6 py-4 font-body-base text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none min-w-[300px]" 
              placeholder="Your email address" 
              type="email" 
            />
            <button className="bg-primary text-on-primary px-8 py-4 font-button-text hover:bg-primary-container transition-colors cursor-pointer uppercase">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
