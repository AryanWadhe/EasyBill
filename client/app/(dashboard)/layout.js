import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";

export default function DashLayout({ children }) {
  const token = cookies().get("accessToken");
  return (
    <div className="flex">
      {token && <Navbar />}
      <div className="max-w-7xl mx-auto w-full mt-20">{children}</div>
    </div>
  );
}
