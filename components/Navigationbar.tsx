"use client";

import React, { useState } from "react";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Navigationbar() {
  const [popup, setPopup] = useState(false);
  const { data: session, status } = useSession();
  const sgin = () => signIn();

  return (
    <div className="bg-transparent font-[var(--font-spoti-sans)] relative flex items-center justify-between flex-row px-24 py-6">
      <div className="ico">
        <h1 className="  font-spotiSans font-medium cursor-pointer text-3xl">
          Promptify
        </h1>
      </div>
      <ul className="list flex flex-row items-center space-x-8 font-medium">
        <li
          className="cursor-pointer"
          onClick={() => (window.location.href = "/create")}
        >
          Create
        </li>
        <li className="cursor-pointer">How it's work</li>
        <li className="cursor-pointer">Pricing</li>
        <li className="cta  ">
          {session ? (
            <ul
              onPointerOver={() => setPopup(true)}
              className="  flex flex-col space-y-3 m-0 relative items-center justify-center "
            >
              <li>
                <img
                  src={session.user?.image as string}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full cursor-pointer"
                />
              </li>
              {popup ? (
                <li
                  className="absolute top-10  right-0 bg-white"
                  onPointerOut={() => setPopup(false)}
                >
                  <p
                    onClick={() => (window.location.href = "/profile")}
                    className="px-4 py-2 text-md border-b cursor-pointer  border-b-black"
                  >
                    Profile
                  </p>
                  <p
                    onClick={() => (window.location.href = "/api/auth/signout")}
                    className="px-4 py-2 text-md cursor-pointer"
                  >
                    Logout
                  </p>
                </li>
              ) : null}
            </ul>
          ) : (
            <button
              onClick={sgin}
              className="px-4 py-2 text-md border  border-black"
            >
              SignUp
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Navigationbar;
