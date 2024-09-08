import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Audio Books",
  description: "Description of Audio Books",
};

export default function AudioBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
