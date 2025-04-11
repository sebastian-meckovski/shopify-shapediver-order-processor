import type { MetaFunction } from "@remix-run/cloudflare";
import { ClientOnly } from "remix-utils/client-only";
import { Slider } from "@mui/material";
import { useEffect } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  
  useEffect(() => {
    const init = async () => {
      console.log("Initializing session...");
      try {
        const { createSession } = await import("@shapediver/viewer.session");

        const session = await createSession({
          ticket: 'ba390f092896eaf776e6259f607aeb8946ac1359671be86608452f0718ef7311da4b9ba9d6eff6c841415ca7927ef211a018ba90591a32b75a2d578bd9e613dc1d00e9387ba90e69c809ac6f7f7f923cea54ea061dba656144fd788b65173466f3a8a20fd9429a-2511deeda86828ddaa2386dca43e3bea',
          modelViewUrl: 'https://sdr8euc1.eu-central-1.shapediver.com',
        });
        console.log("Session created:", session);
      } catch (error) {
        console.error("Error initializing the session or viewport:", error);
      }
    };
    init();
  }, [  ]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome to <span className="sr-only">Remix</span>
          </h1>
          <div className="h-[144px] w-[434px]">
            <img
              src="/logo-light.png"
              alt="Remix"
              className="block w-full dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt="Remix"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <p className="leading-6 text-gray-700 dark:text-gray-200">
            What&apos;s next?
          </p>
        </nav>
        <ClientOnly fallback={<div>Loading...</div>}>
          {() => <Slider defaultValue={30} />}
        </ClientOnly>
      </div>
    </div>
  );
}
