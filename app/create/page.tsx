"use client";

import Navigationbar from "@/components/Navigationbar";
import { useSession, signIn, signOut } from "next-auth/react";
import { Fragment } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  return (
    <Fragment>
      <div className="w-full h-screen bg-green-500 ">
        <Navigationbar />
        <div className="flex items-center justify-center px-24">
          <div className="container bg-black text-white">
            <form
              action=""
              method="post"
              className="flex flex-col px-16 py-8 space-y-4"
            >
              <div className="flex flex-col space-y-2">
                <label htmlFor="prompt" className="text-white font-medium">
                  Describe you'r feelings
                </label>
                <textarea
                  name="prompt"
                  id="prompt"
                  placeholder="Prompt..."
                  className="bg-gray-950 placeholder:text-gray-400 text-gray-300 border rounded-md p-2 border-white"
                ></textarea>
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="lanuge" className="text-white font-medium">
                  Lanuge
                </label>

                <select
                  id="lanuge"
                  className=" border rounded-md p-2 border-white bg-gray-950 text-white"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Italian">Italian</option>
                  <option value="Portuguese">Portuguese</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Korean">Korean</option>
                  <option value="Russian">Russian</option>
                  <option value="Arabic">Arabic</option>
                  <option value="Arabic">Sinhala</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Turkish">Turkish</option>
                  <option value="Dutch">Dutch</option>
                  <option value="Polish">Polish</option>
                  <option value="Swedish">Swedish</option>
                  <option value="Greek">Greek</option>
                  <option value="Czech">Czech</option>
                  <option value="Romanian">Romanian</option>
                  <option value="Thai">Thai</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option value="Indonesian">Indonesian</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>
              <input type="submit" value="Generate" className="bg-gray-950 p-2 border-white border rounded-md" />
            </form>

            {/* //propmpt */}
            {/* lanuge */}
            {/* /generate button  */}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
