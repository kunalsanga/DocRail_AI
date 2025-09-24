"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const images = [
    { src: "/r1.jpg", alt: "Carousel image 1" },
    { src: "/r2.jpg", alt: "Carousel image 2" },
    { src: "/r3.jpg", alt: "Carousel image 3" },
  ];

  const goPrev = () => setCarouselIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () => setCarouselIndex((i) => (i + 1) % images.length);

  useEffect(() => {
    const id = setInterval(() => setCarouselIndex((i) => (i + 1) % images.length), 4000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="mx-auto max-w-none px-2 sm:px-4 lg:px-6 py-4">
      <div className="grid grid-cols-12 gap-4 lg:gap-5">
        {/* Left Sidebar - Quick Links */}
        <aside className="col-span-12 md:col-span-3">
          <div className="border rounded-md overflow-hidden">
            <div className="bg-[#1E6BB8] text-white font-bold px-4 py-3 text-lg">QUICK LINKS</div>
            <nav className="bg-white divide-y">
              {[
                "Search E-Tenders",
                "Search E-Auctions ( Leasing )",
                "Search E-Auction Sale",
                "System Settings",
                "Learning Center (User Manuals)",
                "Rly. Board Policy Circulars (For Procurement Of Goods)",
              ].map((label, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="block px-4 py-3 hover:bg-slate-50 text-[15px]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-6 border rounded-md overflow-hidden">
            <div className="bg-[#E85D04] text-white font-bold px-4 py-3 text-lg">OTHER USEFUL LINKS</div>
            <div className="bg-white divide-y">
              {[
                "Click here if you encounter any error while logging in to iMMS.",
                "High Value Tenders",
                "Download JAVA (JRE)",
                "IREPS Signer (Version 1.5)",
              ].map((label, idx) => (
                <Link key={idx} href="#" className="block px-4 py-3 hover:bg-slate-50 text-[15px]">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Center - Hero Carousel and News */}
        <section className="col-span-12 md:col-span-6">
          {/* Carousel */}
          <div className="relative rounded-md overflow-hidden border">
            <div className="relative h-[320px] w-full bg-white">
              <Image
                src={images[carouselIndex].src}
                alt={images[carouselIndex].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
                priority
              />
            </div>
            <button
              aria-label="Previous"
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full h-9 w-9 grid place-items-center shadow"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full h-9 w-9 grid place-items-center shadow"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-6 rounded-sm ${i === carouselIndex ? "bg-[#1E6BB8]" : "bg-slate-300"}`}
                  aria-hidden
                />
              ))}
            </div>
          </div>

          {/* News & Updates */}
          <div className="mt-6">
            <h2 className="text-[26px] font-semibold text-[#1E6BB8] leading-tight">News & Updates</h2>
            <div className="mt-3 h-[420px] overflow-y-auto pr-2">
              <article className="prose prose-slate max-w-none">
                <p>
                  The Integral Coach Factory-Chennai (ICF) is organizing a Vendor Development Awareness Program 2025 – with Special Emphasis on SC/ST and Women Entrepreneurs, on Wednesday,3rd September 2025 from 14:30 Hrs onwards. Firms may confirm vendor participation details via email: dycmmdc@icf.railnet.gov.in.
                </p>
                <p className="font-semibold">
                  Venue: Advanced Welding & Training Institute (AWTI), ICF, CHENNAI – 600038
                </p>
                <p>
                  RCF-Kapurthala shall be organizing Vendor Development Programme (VDP).
                </p>
                <p>
                  RCF-Kapurthala shall be organizing Vendor Development Programme (VDP) on Saturday, 6th October 2027 and also to promote indigenization. All the vendors / MSEs etc. are invited to attend this VDP.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Right - Notifications */}
        <aside className="col-span-12 md:col-span-3">
          <div className="border rounded-md overflow-hidden">
            <div className="bg-white px-4 py-3">
              <h2 className="text-[26px] font-semibold text-[#1E6BB8]">Notifications</h2>
            </div>
            <div className="px-5 pb-5 max-h-[760px] overflow-y-auto text-[15px] leading-7">
              <ul className="list-disc pl-5 space-y-3 text-[#D92D20]">
                <li>
                  NORTH EASTERN RAILWAY (NER) is seeking qualified partners for sale of seventeen (17) In-Service Diesel Locomotives...
                </li>
                <li>
                  Expression of Interest (EOI) invited before 16:00 hrs, 13 Sept 2025. Notice for EOI or EOI Document available upon request.
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={async () => { await fetch('/api/demo/seed', { method: 'POST' }); alert('Guided demo data seeded. Go to Dashboard to run workflows.'); }}
              className="w-full border rounded-md bg-white px-4 py-2 hover:bg-slate-50"
            >
              Start Guided Demo
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}