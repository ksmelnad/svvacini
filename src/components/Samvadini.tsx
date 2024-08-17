"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const Samvadini = () => {
  const [prompt, setPrompt] = useState("");
  const [promptShow, setPromptShow] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  //   const session = useSession();

  const { toast } = useToast();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // if (!session.data?.user?.email) {
    //   toast.error("You need to signin first!");
    //   return;
    // }
    if (prompt.trim() === "") {
      toast({
        variant: "destructive",
        description: "Question cannot be empty!",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/samvadini", {
        userQuery: prompt,
      });

      if (response.status === 200) {
        setResponse(response.data);
        setPromptShow(prompt);
        setPrompt("");
      }

      setLoading(false);
      e.target.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" p-4 max-w-lg mx-auto flex flex-col gap-2">
      <div>
        <h1 className="text-3xl pt-6 md:pt-10 text-center font-medium text-gray-800">
          Saṃvādinī
        </h1>
      </div>
      <div className="overflow-y-auto bg-white/80 p-4  w-full h-[70vh] rounded">
        {loading ? (
          <span className="loading loading-dots loading-md text-gray-600 text-center py-10"></span>
        ) : (
          <>
            <p className="font-semibold text-sm md:text-base">{promptShow}</p>
            <p className="text-sm mt-2 md:text-base">{response}</p>
          </>
        )}
      </div>
      <div className="w-full mx-auto">
        {/* absolute bottom-0 right-0 */}
        {/* Input */}
        <form className="flex gap-2 items-baseline" onSubmit={handleSubmit}>
          <Input
            className="flex-1 bg-white/80 text-sm"
            value={prompt}
            disabled={loading}
            placeholder="Ask your question..."
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button className="btn btn-sm btn-primary" disabled={loading}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Samvadini;
