// import PeaksComp from "@/components/PeaksComp";

import dynamic from "next/dynamic";

const PeaksNoSSR = dynamic(() => import("@/components/PeaksComp"), {
  ssr: false,
});

export default function Peaks() {
  return <PeaksNoSSR />;
}
