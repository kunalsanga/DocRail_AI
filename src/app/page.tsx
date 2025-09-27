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
                "Document Search & Discovery",
                "Upload New Documents",
                "Knowledge Graph Explorer",
                "Compliance Dashboard",
                "Document Analytics",
                "Translation Services",
                "Audit Trail Viewer",
                "Safety Document Scanner",
                "Workflow Templates",
                "User Management",
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
                "API Documentation & Integration Guide",
                "Document Processing Status Checker",
                "Bulk Upload Tool (CSV/Excel)",
                "Document Version Control System",
                "AI-Powered Content Extraction",
                "Multi-language Support Center",
                "Compliance Reporting Tools",
                "Document Security & Access Control",
                "System Health Monitor",
                "Troubleshooting & Support",
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
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-800">🚀 New AI-Powered Document Processing Engine</h3>
                    <p className="text-sm text-gray-600">December 15, 2024</p>
                    <p>
                      We've upgraded our document processing system with advanced AI capabilities. The new engine can now extract data from complex forms, tables, and handwritten documents with 95% accuracy. This enhancement will significantly improve our document ingestion pipeline and reduce manual processing time by 70%.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-800">📊 Enhanced Compliance Dashboard Released</h3>
                    <p className="text-sm text-gray-600">December 10, 2024</p>
                    <p>
                      The new compliance dashboard provides real-time monitoring of document compliance status, automated alerts for upcoming deadlines, and comprehensive reporting features. Users can now track document lifecycle, identify compliance gaps, and generate audit reports with just a few clicks.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-800">🌐 Multi-Language Support Expansion</h3>
                    <p className="text-sm text-gray-600">December 5, 2024</p>
                    <p>
                      We've expanded our translation services to support 15 additional languages including Hindi, Tamil, Telugu, Bengali, and Marathi. The system now provides real-time translation for document content, metadata, and user interface elements, making the platform more accessible to regional users.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-800">🔒 Advanced Security Features Implemented</h3>
                    <p className="text-sm text-gray-600">November 28, 2024</p>
                    <p>
                      New security enhancements include end-to-end encryption for sensitive documents, role-based access control with granular permissions, and advanced audit logging. These features ensure that your documents are protected according to the highest security standards and regulatory requirements.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-800">⚠️ System Maintenance Scheduled</h3>
                    <p className="text-sm text-gray-600">November 25, 2024</p>
                    <p>
                      Planned maintenance window: December 20, 2024, 2:00 AM - 6:00 AM IST. During this time, document upload and processing services will be temporarily unavailable. We recommend completing any critical document processing tasks before this maintenance window.
                    </p>
                  </div>
                </div>
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
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 font-bold">🔴 URGENT</span>
                    <span className="text-xs text-gray-500">2 min ago</span>
                  </div>
                  <p className="text-red-700 mt-1">
                    Document processing failed for 15 files due to corrupted image format. Please re-upload with supported formats (PDF, PNG, JPG).
                  </p>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-600 font-bold">⚠️ WARNING</span>
                    <span className="text-xs text-gray-500">15 min ago</span>
                  </div>
                  <p className="text-yellow-700 mt-1">
                    High-priority safety document requires immediate review. Compliance deadline approaching in 2 days.
                  </p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600 font-bold">ℹ️ INFO</span>
                    <span className="text-xs text-gray-500">1 hour ago</span>
                  </div>
                  <p className="text-blue-700 mt-1">
                    Bulk document upload completed successfully. 247 documents processed and indexed in the knowledge graph.
                  </p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold">✅ SUCCESS</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-green-700 mt-1">
                    AI translation completed for 89 multilingual documents. All content is now available in 5 languages.
                  </p>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-600 font-bold">🔍 ALERT</span>
                    <span className="text-xs text-gray-500">3 hours ago</span>
                  </div>
                  <p className="text-purple-700 mt-1">
                    New related documents discovered through knowledge graph analysis. 12 additional relevant files found.
                  </p>
                </div>
                
                <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-600 font-bold">📊 UPDATE</span>
                    <span className="text-xs text-gray-500">5 hours ago</span>
                  </div>
                  <p className="text-orange-700 mt-1">
                    Weekly compliance report generated. 98.5% of documents are compliant with current regulations.
                  </p>
                </div>
                
                <div className="bg-gray-50 border-l-4 border-gray-400 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 font-bold">🔧 MAINTENANCE</span>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  <p className="text-gray-700 mt-1">
                    System backup completed successfully. All document data has been securely archived.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}