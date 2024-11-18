"use client";

import Navigationbar from "@/components/Navigationbar";
import { useSession } from "next-auth/react";
import React, { Fragment } from "react";

function page() {
  const { data: session, status } = useSession();
 

  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>unauthenticated</p>;

  return (
    <Fragment>
      <Navigationbar />
      <h1>welcome, {session?.user?.name}</h1>
      <p>{session?.accessToken}</p>
    </Fragment>
  );
}

export default page;
