"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0E2A3F] text-white mt-10">
      <div className="mx-auto max-w-none px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Assistance */}
          <div>
            <h3 className="text-2xl font-semibold text-[#1EC1FF]">Assistance</h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li><Link href="#" className="hover:underline">Helpdesk</Link></li>
              <li><Link href="#" className="hover:underline">User Manuals</Link></li>
              <li><Link href="#" className="hover:underline">System Settings</Link></li>
              <li className="mt-2">FAQs</li>
              <li className="ml-4"><Link href="#" className="hover:underline">- E-Tender</Link></li>
              <li className="ml-4"><Link href="#" className="hover:underline">- E-Auction</Link></li>
              <li className="ml-4"><Link href="#" className="hover:underline">- E-Payment</Link></li>
            </ul>
          </div>

          {/* Useful Info */}
          <div>
            <h3 className="text-2xl font-semibold text-[#1EC1FF]">Useful Info</h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li><Link href="#" className="hover:underline">Procurement Projections</Link></li>
              <li><Link href="#" className="hover:underline">High Value Tenders</Link></li>
              <li><Link href="#" className="hover:underline">Approved Vendors</Link></li>
              <li><Link href="#" className="hover:underline">Banned / Suspended Firms</Link></li>
            </ul>
          </div>

          {/* Miscellaneous */}
          <div>
            <h3 className="text-2xl font-semibold text-[#1EC1FF]">Miscellaneous</h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li><Link href="#" className="hover:underline">About IREPS</Link></li>
              <li><Link href="#" className="hover:underline">CRIS</Link></li>
              <li><Link href="#" className="hover:underline">Terms & Conditions</Link></li>
              <li><Link href="#" className="hover:underline">Copyright</Link></li>
              <li><Link href="#" className="hover:underline">Privacy Statement</Link></li>
              <li><Link href="#" className="hover:underline">Contact</Link></li>
            </ul>
          </div>

          {/* Downloads */}
          <div>
            <h3 className="text-2xl font-semibold text-[#1EC1FF]">Downloads</h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li>
                <Link href="#" className="hover:underline">IREPS Signer (Version 1.5)</Link>
                <span className="ml-2 inline-block align-middle text-[#FF5E57]">NEW</span>
              </li>
              <li><Link href="#" className="hover:underline">User Manuals</Link></li>
              <li>Public Documents</li>
              <li className="ml-4"><Link href="#" className="hover:underline">- Goods & Services</Link></li>
              <li className="ml-4"><Link href="#" className="hover:underline">- Works</Link></li>
              <li className="ml-4"><Link href="#" className="hover:underline">- Earning / Leasing</Link></li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 mt-12">
          {/* Important External Links */}
          <div>
            <h3 className="text-2xl font-semibold text-[#1EC1FF]">Important External Links</h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              <li><Link href="#" className="hover:underline">Download JAVA (JRE)</Link></li>
              <li><Link href="#" className="hover:underline">Download PDF Reader</Link></li>
              <li><Link href="#" className="hover:underline">CCA India</Link></li>
              <li><Link href="#" className="hover:underline">Indian Railways</Link></li>
              <li><Link href="#" className="hover:underline">National Informatics Center</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-3">
            <a href="https://cris.org.in/" target="_blank" rel="noopener noreferrer" aria-label="CRIS website">
              <div className="relative h-12 w-28">
                <Image src="/b1.jpg" alt="CRIS" fill className="object-contain" />
              </div>
            </a>
          </div>
          <p className="opacity-90">
            Centre for Railway Information Systems, Designed, Developed and Hosted by CRIS
            <span className="ml-3">Version 7.1.0</span>
          </p>
        </div>
      </div>

      {/* Back to top floating button */}
      <button
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-[#2D6AA6] text-white grid place-items-center shadow-lg"
      >
        ↑
      </button>
    </footer>
  );
}


