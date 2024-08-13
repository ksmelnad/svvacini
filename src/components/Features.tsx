import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const features = [
  {
    item: "Immerse in Sanskrit Audio Books",
    desc: "Listen to timeless Sanskrit literature narrated by expert scholars. Perfect for deepening your understanding of the language and culture, even on the go.",
    src: "/audiobook-svgrepo-com.svg",
    href: "/audiobooks",
  },
  {
    item: "Explore Sanskrit Texts Effortlessly",
    desc: "Quickly search through vast collections of Sanskrit texts using our powerful Full Text Search, enabled by Apache Lucene, to find exactly what you need in seconds.",
    src: "/search.svg",
    href: "/search",
  },
  {
    item: "AI-Powered Q&A with Sanskrit Texts",
    desc: "Engage with Sanskrit literature like never before. Ask questions and receive accurate answers, powered by the latest AI models tailored for Sanskrit texts.",
    src: "/12291062_Wavy_Tech-20_Single-08.svg",
    href: "/samvadini",
  },
  {
    item: "Read in Any Script of Your Choice",
    desc: "Access Sanskrit texts in your preferred script. Our platform supports all major Indic scripts, ensuring you read comfortably and authentically.",
    src: "/Green_translation_icon_Devanagari.svg.png",
    href: ""
  },
];

const Features = () => {
  return (
    <div className=" px-4 my-20 py-10 md:py-20 max-w-5xl mx-4 md:mx-auto bg-white/50 rounded-md flex flex-col gap-12 md:gap-20">
      {features.map((feature, index) => (
        <div
          key={index}
          className={`px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 place-items-center gap-4 `}
        >
          <Image
            src={feature.src}
            alt={feature.item}
            width={200}
            height={200}
            className={index % 2 === 0 ? "md:order-2" : ""}
          />
          <div>
            <p className="text-lg lg:text-2xl font-semibold">{feature.item}</p>
            <p className="lg:text-lg mt-4">{feature.desc}</p>
            {feature.href && (
              <Link
                href={feature.href}
                
                // variant="link"
              >
               <Button 
                className="mt-4 font-serif text-gray-100 text-sm tracking-wide "
               
               > Start</Button>
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Features;
