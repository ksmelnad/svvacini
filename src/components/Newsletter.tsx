
"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Integrate with your email marketing service
    console.log("Submitting email:", email);

    setEmail("");
  };

  return (
    <div className=" py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">
            Stay Updated with us
          </h2>
          <p className="mt-3 max-w-2xl mx-auto  text-gray-500 sm:mt-4">
            Subscribe for news on Sanskrit Books and Audio Books additions
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 sm:flex">
          <div className="min-w-0 flex-1">
            <Label htmlFor="email" className="sr-only">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-3">
            <Button type="submit">Subscribe</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;
