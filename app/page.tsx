"use client";

import Navigationbar from "@/components/Navigationbar";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Fragment } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
 
  return (
    <Fragment>
      <div className="w-full h-screen bg-green-500 ">
        {/* //Navigationbar */}
        <Navigationbar />
        {/* herosection */}
      </div>
    </Fragment>
  );
}
