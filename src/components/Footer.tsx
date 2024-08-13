import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const navitems = [
  {
    title: "Dhvanipustakāni",
    url: "/audiobooks",
  },

  {
    title: "Anveṣiṇī",
    url: "/search",
  },
  {
    title: "Saṃvādinī",
    url: "/samvadini",
  },
];

const otherLinks = [
  {
    title: "About Us",
    url: "/about",
  },
  {
    title: "Terms and Conditions",
    url: "/terms",
  },
  {
    title: "Privacy Policy",
    url: "/privacy",
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#c8c5bc] py-10 px-4 mt-8">
      <div className="container mx-auto flex flex-col items-center md:flex-row gap-8 md:items-center md:justify-between">
        <div>
          <h3 className="text-3xl font-bold tracking-wide">संस्कृतवाचिनी</h3>
        </div>
        <div>
          <ul className="flex flex-col gap-2 md:gap-4">
            {navitems.map((item, index) => (
              <li key={index}>
                <Link href={item.url}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <ul className="flex flex-col gap-2 md:gap-4">
            {otherLinks.map((item, index) => (
              <li key={index}>
                <Link href={item.url}> {item.title} </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
