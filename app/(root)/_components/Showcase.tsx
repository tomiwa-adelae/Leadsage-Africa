"use client";
import CountUp from "react-countup";
import Image from "next/image";
import { ShowcaseSearchForm } from "./ShowcaseSearchForm";
import { homeStats } from "@/constants";
import { ShowcaseBoxes } from "./ShowcaseBoxes";
import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";

// export const Showcase = () => {
//   return (
//     <div
//       className="text-white bg-scroll bg-no-repeat bg-cover bg-left min-h-[80vh] relative"
//       style={{
//         backgroundImage: `url(/assets/images/primary-bg.png)`,
//       }}
//     >
//       <main className="container py-20 grid grid-cols-1 lg:grid-cols-5 gap-14">
//         <div className="col-span-3">
//           <h1 className="font-medium text-4xl leading-snug md:text-5xl md:leading-snug">
//             Find Your Perfect Home, Designed for You
//           </h1>
//           {/* <p className="hidden lg:block text-base text-gray-200 mt-4">
// 						Explore a diverse selection of properties that match
// 						your lifestyle and budget. Whether you're renting,
// 						buying, or investing, we help you find the ideal space
// 						with ease—saving you time, effort, and money along the
// 						way.
// 					</p> */}
//           <ShowcaseSearchForm />
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
//             {homeStats.map(({ number, title, suffix }, index) => (
//               <div key={index} className="grid gap-1">
//                 <h3 className="font-medium text-3xl lg:text-4xl">
//                   <CountUp
//                     start={0}
//                     end={number}
//                     duration={2.25}
//                     decimal=","
//                     suffix={suffix}
//                   />
//                 </h3>
//                 <p className="text-sm lg:text-base">{title}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//         <div className="col-span-2 m-auto hidden md:block relative">
//           <Image
//             src={"/assets/images/showcase-display-img.png"}
//             alt="Showcase Images"
//             width={1000}
//             height={1000}
//             className="w-auto h-auto"
//           />
//           <ShowcaseBoxes />
//         </div>
//       </main>
//       <PartneringCompanies />
//     </div>
//   );
// };

export const Showcase = () => {
  return (
    <div className="min-h-[70vh] relative py-16 overflow-x-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source
          src={
            "https://res.cloudinary.com/dh0rc6p1c/video/upload/v1744907189/LeadSage/videos/856661-hd_1920_1080_25fps_t2v6ti.mp4"
          }
          type="video/mp4"
        />
      </video>
      <div className="grid container text-white z-50">
        <div className="z-50">
          <main className="py-20 grid grid-cols-1 lg:grid-cols-5 gap-14">
            <div className="col-span-3">
              <h1 className="font-semibold text-4xl leading-snug md:text-5xl md:leading-snug">
                Find Your Perfect Home, Designed for You
              </h1>
              <ShowcaseSearchForm />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {homeStats.map(({ number, title, suffix }, index) => (
                  <div key={index} className="grid gap-1">
                    <h3 className="font-medium text-3xl lg:text-4xl">
                      <CountUp
                        start={0}
                        end={number}
                        duration={2.25}
                        decimal=","
                        suffix={suffix}
                      />
                    </h3>
                    <p className="text-sm lg:text-base">{title}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/70" />
    </div>
  );
};

// import React from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
// import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
// import { ChevronRight } from "lucide-react";
// import { Header } from "./Header";

// export function Showcase() {
//   return (
//     <>
//       <main className="overflow-x-hidden">
//         <section>
//           <div className="py-24 md:pb-32 lg:pb-36 lg:pt-72">
//             <div className="relative mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
//               <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
//                 <h1 className="mt-8 max-w-2xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl">
//                   Build 10x Faster with NS
//                 </h1>
//                 <p className="mt-8 max-w-2xl text-balance text-lg">
//                   Highly customizable components for building modern websites
//                   and applications you mean it.
//                 </p>

//                 <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
//                   <Button
//                     asChild
//                     size="lg"
//                     className="h-12 rounded-full pl-5 pr-3 text-base"
//                   >
//                     <Link href="#link">
//                       <span className="text-nowrap">Start Building</span>
//                       <ChevronRight className="ml-1" />
//                     </Link>
//                   </Button>
//                   <Button
//                     key={2}
//                     asChild
//                     size="lg"
//                     variant="ghost"
//                     className="h-12 rounded-full px-5 text-base hover:bg-zinc-950/5 dark:hover:bg-white/5"
//                   >
//                     <Link href="#link">
//                       <span className="text-nowrap">Request a demo</span>
//                     </Link>
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             <div className="aspect-2/3 absolute inset-1 -z-10 overflow-hidden rounded-3xl border border-black/10 lg:aspect-video lg:rounded-[3rem] dark:border-white/5">
//               <video
//                 autoPlay
//                 loop
//                 muted
//                 playsInline
//                 className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
//               >
//                 <source
//                   src={
//                     "https://res.cloudinary.com/dh0rc6p1c/video/upload/v1744907189/LeadSage/videos/856661-hd_1920_1080_25fps_t2v6ti.mp4"
//                   }
//                   type="video/mp4"
//                 />
//               </video>
//             </div>
//           </div>
//         </section>
//         <section className="bg-background pb-2">
//           <div className="group relative m-auto max-w-7xl px-6">
//             <div className="flex flex-col items-center md:flex-row">
//               <div className="md:max-w-44 md:border-r md:pr-6">
//                 <p className="text-end text-sm">Powering the best teams</p>
//               </div>
//               <div className="relative py-6 md:w-[calc(100%-11rem)]">
//                 <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
//                   <div className="flex">
//                     <img
//                       className="mx-auto h-5 w-fit dark:invert"
//                       src="https://html.tailus.io/blocks/customers/nvidia.svg"
//                       alt="Nvidia Logo"
//                       height="20"
//                       width="auto"
//                     />
//                   </div>

//                   <div className="flex">
//                     <img
//                       className="mx-auto h-4 w-fit dark:invert"
//                       src="https://html.tailus.io/blocks/customers/column.svg"
//                       alt="Column Logo"
//                       height="16"
//                       width="auto"
//                     />
//                   </div>
//                   <div className="flex">
//                     <img
//                       className="mx-auto h-4 w-fit dark:invert"
//                       src="https://html.tailus.io/blocks/customers/github.svg"
//                       alt="GitHub Logo"
//                       height="16"
//                       width="auto"
//                     />
//                   </div>
//                   <div className="flex">
//                     <img
//                       className="mx-auto h-5 w-fit dark:invert"
//                       src="https://html.tailus.io/blocks/customers/nike.svg"
//                       alt="Nike Logo"
//                       height="20"
//                       width="auto"
//                     />
//                   </div>
//                   <div className="flex">
//                     <img
//                       className="mx-auto h-5 w-fit dark:invert"
//                       src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
//                       alt="Lemon Squeezy Logo"
//                       height="20"
//                       width="auto"
//                     />
//                   </div>
//                   <div className="flex">
//                     <img
//                       className="mx-auto h-4 w-fit dark:invert"
//                       src="https://html.tailus.io/blocks/customers/laravel.svg"
//                       alt="Laravel Logo"
//                       height="16"
//                       width="auto"
//                     />
//                   </div>
//                   <div className="flex">
//                     <img
//                       className="mx-auto h-7 w-fit dark:invert"
//                       src="https://html.tailus.io/blocks/customers/lilly.svg"
//                       alt="Lilly Logo"
//                       height="28"
//                       width="auto"
//                     />
//                   </div>

//                   <div className="flex">
//                     <img
//                       className="mx-auto h-6 w-fit dark:invert"
//                       src="https://html.tailus.io/blocks/customers/openai.svg"
//                       alt="OpenAI Logo"
//                       height="24"
//                       width="auto"
//                     />
//                   </div>
//                 </InfiniteSlider>

//                 <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
//                 <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
//                 <ProgressiveBlur
//                   className="pointer-events-none absolute left-0 top-0 h-full w-20"
//                   direction="left"
//                   blurIntensity={1}
//                 />
//                 <ProgressiveBlur
//                   className="pointer-events-none absolute right-0 top-0 h-full w-20"
//                   direction="right"
//                   blurIntensity={1}
//                 />
//               </div>
//             </div>
//           </div>
//         </section>
//         <div className="absolute inset-0 bg-black/40" />
//       </main>
//     </>
//   );
// }
