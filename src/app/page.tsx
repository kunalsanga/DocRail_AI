"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Page() {
  const { t, language } = useLanguage();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const images = [
    { src: "/1.jpeg", alt: "Kochi Metro Rail Limited - Metro Train Station" },
    { src: "/2.jpg", alt: "Kochi Metro Platform with Passengers" },
    { src: "/3.jpeg", alt: "Kochi Metro Train at Station" },
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
            <div className="bg-[#1E6BB8] text-white font-bold px-4 py-3 text-lg">
              {language === "ml" ? "ദ്രുത ലിങ്കുകൾ" : "QUICK LINKS"}
            </div>
            <nav className="bg-white divide-y">
              {[
                { en: "Document Search & Discovery", ml: "ഡോക്യുമെന്റ് തിരച്ചിൽ & കണ്ടെത്തൽ" },
                { en: "Upload New Documents", ml: "പുതിയ ഡോക്യുമെന്റുകൾ അപ്ലോഡ് ചെയ്യുക" },
                { en: "Knowledge Graph Explorer", ml: "നോളജ് ഗ്രാഫ് എക്സ്പ്ലോറർ" },
                { en: "Compliance Dashboard", ml: "കമ്പ്ലയൻസ് ഡാഷ്ബോർഡ്" },
                { en: "Document Analytics", ml: "ഡോക്യുമെന്റ് അനാലിറ്റിക്സ്" },
                { en: "Translation Services", ml: "വിവർത്തന സേവനങ്ങൾ" },
                { en: "Audit Trail Viewer", ml: "ഓഡിറ്റ് ട്രെയിൽ വ്യൂവർ" },
                { en: "Safety Document Scanner", ml: "സുരക്ഷാ ഡോക്യുമെന്റ് സ്കാനർ" },
                { en: "Workflow Templates", ml: "വർക്ക്ഫ്ലോ ടെംപ്ലേറ്റുകൾ" },
                { en: "User Management", ml: "ഉപയോക്തൃ മാനേജ്മെന്റ്" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="block px-4 py-3 hover:bg-slate-50 text-[15px]"
                >
                  {language === "ml" ? item.ml : item.en}
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-6 border rounded-md overflow-hidden">
            <div className="bg-[#E85D04] text-white font-bold px-4 py-3 text-lg">
              {language === "ml" ? "മറ്റ് ഉപയോഗപ്രദമായ ലിങ്കുകൾ" : "OTHER USEFUL LINKS"}
            </div>
            <div className="bg-white divide-y">
              {[
                { en: "API Documentation & Integration Guide", ml: "API ഡോക്യുമെന്റേഷൻ & ഇന്റഗ്രേഷൻ ഗൈഡ്" },
                { en: "Document Processing Status Checker", ml: "ഡോക്യുമെന്റ് പ്രോസസ്സിംഗ് സ്റ്റാറ്റസ് ചെക്കർ" },
                { en: "Bulk Upload Tool (CSV/Excel)", ml: "ബൾക്ക് അപ്ലോഡ് ടൂൾ (CSV/Excel)" },
                { en: "Document Version Control System", ml: "ഡോക്യുമെന്റ് വേർഷൻ കൺട്രോൾ സിസ്റ്റം" },
                { en: "AI-Powered Content Extraction", ml: "AI-സഹായിത ഉള്ളടക്ക എക്സ്ട്രാക്ഷൻ" },
                { en: "Multi-language Support Center", ml: "മൾട്ടി-ലാംഗ്വേജ് സപ്പോർട്ട് സെന്റർ" },
                { en: "Compliance Reporting Tools", ml: "കമ്പ്ലയൻസ് റിപ്പോർട്ടിംഗ് ടൂളുകൾ" },
                { en: "Document Security & Access Control", ml: "ഡോക്യുമെന്റ് സുരക്ഷ & ആക്സസ് കൺട്രോൾ" },
                { en: "System Health Monitor", ml: "സിസ്റ്റം ഹെൽത്ത് മോണിറ്റർ" },
                { en: "Troubleshooting & Support", ml: "ട്രബിൾഷൂട്ടിംഗ് & സപ്പോർട്ട്" },
              ].map((item, idx) => (
                <Link key={idx} href="#" className="block px-4 py-3 hover:bg-slate-50 text-[15px]">
                  {language === "ml" ? item.ml : item.en}
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
            <h2 className="text-[26px] font-semibold text-[#1E6BB8] leading-tight">
              {language === "ml" ? "വാർത്തകളും അപ്ഡേറ്റുകളും" : "News & Updates"}
            </h2>
            <div className="mt-3 h-[420px] overflow-y-auto pr-2">
              <article className="prose prose-slate max-w-none">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {language === "ml" ? "🚀 പുതിയ AI-സഹായിത ഡോക്യുമെന്റ് പ്രോസസ്സിംഗ് എഞ്ചിൻ" : "🚀 New AI-Powered Document Processing Engine"}
                    </h3>
                    <p className="text-sm text-gray-600">December 15, 2024</p>
                    <p>
                      {language === "ml" 
                        ? "ഞങ്ങൾ ഞങ്ങളുടെ ഡോക്യുമെന്റ് പ്രോസസ്സിംഗ് സിസ്റ്റം അഡ്വാൻസ്ഡ് AI കഴിവുകളുമായി അപ്ഗ്രേഡ് ചെയ്തിരിക്കുന്നു. പുതിയ എഞ്ചിൻ ഇപ്പോൾ സങ്കീർണ്ണമായ ഫോമുകൾ, പട്ടികകൾ, കൈയെഴുത്ത് ഡോക്യുമെന്റുകളിൽ നിന്ന് 95% കൃത്യതയോടെ ഡാറ്റ എക്സ്ട്രാക്റ്റ് ചെയ്യാൻ കഴിയും. ഈ മെച്ചപ്പെടുത്തൽ ഞങ്ങളുടെ ഡോക്യുമെന്റ് ഇംജെഷൻ പൈപ്പ്ലൈൻ ഗണ്യമായി മെച്ചപ്പെടുത്തുകയും മാനുവൽ പ്രോസസ്സിംഗ് സമയം 70% കുറയ്ക്കുകയും ചെയ്യും."
                        : "We've upgraded our document processing system with advanced AI capabilities. The new engine can now extract data from complex forms, tables, and handwritten documents with 95% accuracy. This enhancement will significantly improve our document ingestion pipeline and reduce manual processing time by 70%."
                      }
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {language === "ml" ? "📊 മെച്ചപ്പെടുത്തിയ കമ്പ്ലയൻസ് ഡാഷ്ബോർഡ് പുറത്തിറക്കി" : "📊 Enhanced Compliance Dashboard Released"}
                    </h3>
                    <p className="text-sm text-gray-600">December 10, 2024</p>
                    <p>
                      {language === "ml" 
                        ? "പുതിയ കമ്പ്ലയൻസ് ഡാഷ്ബോർഡ് ഡോക്യുമെന്റ് കമ്പ്ലയൻസ് സ്റ്റാറ്റസിന്റെ റിയൽ-ടൈം മോണിറ്ററിംഗ്, വരാനിരിക്കുന്ന ഡെഡ്ലൈനുകൾക്കായുള്ള ഓട്ടോമേറ്റഡ് അലേർട്ടുകൾ, സമഗ്ര റിപ്പോർട്ടിംഗ് സവിശേഷതകൾ നൽകുന്നു. ഉപയോക്താക്കൾക്ക് ഇപ്പോൾ ഡോക്യുമെന്റ് ലൈഫ് സൈക്കിൾ ട്രാക്ക് ചെയ്യാനും കമ്പ്ലയൻസ് വിടവുകൾ തിരിച്ചറിയാനും കുറച്ച് ക്ലിക്കുകളിൽ ഓഡിറ്റ് റിപ്പോർട്ടുകൾ സൃഷ്ടിക്കാനും കഴിയും."
                        : "The new compliance dashboard provides real-time monitoring of document compliance status, automated alerts for upcoming deadlines, and comprehensive reporting features. Users can now track document lifecycle, identify compliance gaps, and generate audit reports with just a few clicks."
                      }
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {language === "ml" ? "🌐 മൾട്ടി-ലാംഗ്വേജ് സപ്പോർട്ട് വിപുലീകരണം" : "🌐 Multi-Language Support Expansion"}
                    </h3>
                    <p className="text-sm text-gray-600">December 5, 2024</p>
                    <p>
                      {language === "ml" 
                        ? "ഞങ്ങൾ ഹിന്ദി, തമിഴ്, തെലുഗു, ബംഗാളി, മറാത്തി എന്നിവയുൾപ്പെടെ 15 അധിക ഭാഷകൾ പിന്തുണയ്ക്കാൻ ഞങ്ങളുടെ വിവർത്തന സേവനങ്ങൾ വിപുലീകരിച്ചിരിക്കുന്നു. സിസ്റ്റം ഇപ്പോൾ ഡോക്യുമെന്റ് ഉള്ളടക്കം, മെറ്റാഡാറ്റ, ഉപയോക്തൃ ഇന്റർഫേസ് ഘടകങ്ങൾ എന്നിവയ്ക്കായി റിയൽ-ടൈം വിവർത്തനം നൽകുന്നു, ഇത് പ്ലാറ്റ്ഫോമിനെ പ്രാദേശിക ഉപയോക്താക്കൾക്ക് കൂടുതൽ ലഭ്യമാക്കുന്നു."
                        : "We've expanded our translation services to support 15 additional languages including Hindi, Tamil, Telugu, Bengali, and Marathi. The system now provides real-time translation for document content, metadata, and user interface elements, making the platform more accessible to regional users."
                      }
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {language === "ml" ? "🔒 അഡ്വാൻസ്ഡ് സുരക്ഷാ സവിശേഷതകൾ നടപ്പാക്കി" : "🔒 Advanced Security Features Implemented"}
                    </h3>
                    <p className="text-sm text-gray-600">November 28, 2024</p>
                    <p>
                      {language === "ml" 
                        ? "പുതിയ സുരക്ഷാ മെച്ചപ്പെടുത്തലുകളിൽ സെൻസിറ്റീവ് ഡോക്യുമെന്റുകൾക്കായുള്ള എൻഡ്-ടു-എൻഡ് എൻക്രിപ്ഷൻ, ഗ്രാനുലാർ പെർമിഷനുകളുള്ള റോൾ-ബേസ്ഡ് ആക്സസ് കൺട്രോൾ, അഡ്വാൻസ്ഡ് ഓഡിറ്റ് ലോഗിംഗ് എന്നിവ ഉൾപ്പെടുന്നു. ഈ സവിശേഷതകൾ നിങ്ങളുടെ ഡോക്യുമെന്റുകൾ ഉയർന്ന സുരക്ഷാ മാനദണ്ഡങ്ങളും നിയന്ത്രണ ആവശ്യകതകളും അനുസരിച്ച് സംരക്ഷിക്കപ്പെടുന്നുവെന്ന് ഉറപ്പാക്കുന്നു."
                        : "New security enhancements include end-to-end encryption for sensitive documents, role-based access control with granular permissions, and advanced audit logging. These features ensure that your documents are protected according to the highest security standards and regulatory requirements."
                      }
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {language === "ml" ? "⚠️ സിസ്റ്റം പരിപാലനം ഷെഡ്യൂൾ ചെയ്തു" : "⚠️ System Maintenance Scheduled"}
                    </h3>
                    <p className="text-sm text-gray-600">November 25, 2024</p>
                    <p>
                      {language === "ml" 
                        ? "ആസൂത്രിത പരിപാലന വിൻഡോ: ഡിസംബർ 20, 2024, രാവിലെ 2:00 - 6:00 AM IST. ഈ സമയത്ത്, ഡോക്യുമെന്റ് അപ്ലോഡ്, പ്രോസസ്സിംഗ് സേവനങ്ങൾ താൽക്കാലികമായി ലഭ്യമല്ല. ഈ പരിപാലന വിൻഡോയ്ക്ക് മുമ്പ് ഏതെങ്കിലും നിർണായക ഡോക്യുമെന്റ് പ്രോസസ്സിംഗ് ടാസ്ക്കുകൾ പൂർത്തിയാക്കാൻ ഞങ്ങൾ ശുപാർശ ചെയ്യുന്നു."
                        : "Planned maintenance window: December 20, 2024, 2:00 AM - 6:00 AM IST. During this time, document upload and processing services will be temporarily unavailable. We recommend completing any critical document processing tasks before this maintenance window."
                      }
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
              <h2 className="text-[26px] font-semibold text-[#1E6BB8]">
                {language === "ml" ? "അറിയിപ്പുകൾ" : "Notifications"}
              </h2>
            </div>
            <div className="px-5 pb-5 max-h-[760px] overflow-y-auto text-[15px] leading-7">
              <div className="space-y-4">
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-500 font-bold">
                      {language === "ml" ? "🔴 അടിയന്തിരം" : "🔴 URGENT"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {language === "ml" ? "2 മിനിറ്റ് മുമ്പ്" : "2 min ago"}
                    </span>
                  </div>
                  <p className="text-red-700 mt-1">
                    {language === "ml" 
                      ? "കേടായ ഇമേജ് ഫോർമാറ്റ് കാരണം 15 ഫയലുകൾക്ക് ഡോക്യുമെന്റ് പ്രോസസ്സിംഗ് പരാജയപ്പെട്ടു. പിന്തുണയ്ക്കുന്ന ഫോർമാറ്റുകളിൽ (PDF, PNG, JPG) വീണ്ടും അപ്ലോഡ് ചെയ്യുക."
                      : "Document processing failed for 15 files due to corrupted image format. Please re-upload with supported formats (PDF, PNG, JPG)."
                    }
                  </p>
                </div>
                
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-600 font-bold">
                      {language === "ml" ? "⚠️ മുന്നറിയിപ്പ്" : "⚠️ WARNING"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {language === "ml" ? "15 മിനിറ്റ് മുമ്പ്" : "15 min ago"}
                    </span>
                  </div>
                  <p className="text-yellow-700 mt-1">
                    {language === "ml" 
                      ? "ഉയർന്ന പ്രാധാന്യമുള്ള സുരക്ഷാ ഡോക്യുമെന്റ് തൽക്ഷണ അവലോകനം ആവശ്യമാണ്. കമ്പ്ലയൻസ് ഡെഡ്ലൈൻ 2 ദിവസത്തിനുള്ളിൽ വരുന്നു."
                      : "High-priority safety document requires immediate review. Compliance deadline approaching in 2 days."
                    }
                  </p>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600 font-bold">
                      {language === "ml" ? "ℹ️ വിവരം" : "ℹ️ INFO"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {language === "ml" ? "1 മണിക്കൂർ മുമ്പ്" : "1 hour ago"}
                    </span>
                  </div>
                  <p className="text-blue-700 mt-1">
                    {language === "ml" 
                      ? "ബൾക്ക് ഡോക്യുമെന്റ് അപ്ലോഡ് വിജയകരമായി പൂർത്തിയായി. 247 ഡോക്യുമെന്റുകൾ പ്രോസസ്സുചെയ്ത് നോളജ് ഗ്രാഫിൽ ഇൻഡെക്സ് ചെയ്തു."
                      : "Bulk document upload completed successfully. 247 documents processed and indexed in the knowledge graph."
                    }
                  </p>
                </div>
                
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600 font-bold">
                      {language === "ml" ? "✅ വിജയം" : "✅ SUCCESS"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {language === "ml" ? "2 മണിക്കൂർ മുമ്പ്" : "2 hours ago"}
                    </span>
                  </div>
                  <p className="text-green-700 mt-1">
                    {language === "ml" 
                      ? "89 മൾട്ടിലാംഗ്വേജ് ഡോക്യുമെന്റുകൾക്ക് AI വിവർത്തനം പൂർത്തിയായി. എല്ലാ ഉള്ളടക്കവും ഇപ്പോൾ 5 ഭാഷകളിൽ ലഭ്യമാണ്."
                      : "AI translation completed for 89 multilingual documents. All content is now available in 5 languages."
                    }
                  </p>
                </div>
                
                <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-purple-600 font-bold">
                      {language === "ml" ? "🔍 അലേർട്ട്" : "🔍 ALERT"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {language === "ml" ? "3 മണിക്കൂർ മുമ്പ്" : "3 hours ago"}
                    </span>
                  </div>
                  <p className="text-purple-700 mt-1">
                    {language === "ml" 
                      ? "നോളജ് ഗ്രാഫ് വിശകലനത്തിലൂടെ പുതിയ ബന്ധപ്പെട്ട ഡോക്യുമെന്റുകൾ കണ്ടെത്തി. 12 അധിക പ്രസക്തമായ ഫയലുകൾ കണ്ടെത്തി."
                      : "New related documents discovered through knowledge graph analysis. 12 additional relevant files found."
                    }
                  </p>
                </div>
                
                <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-orange-600 font-bold">
                      {language === "ml" ? "📊 അപ്ഡേറ്റ്" : "📊 UPDATE"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {language === "ml" ? "5 മണിക്കൂർ മുമ്പ്" : "5 hours ago"}
                    </span>
                  </div>
                  <p className="text-orange-700 mt-1">
                    {language === "ml" 
                      ? "ആഴ്ചയിലെ കമ്പ്ലയൻസ് റിപ്പോർട്ട് സൃഷ്ടിച്ചു. 98.5% ഡോക്യുമെന്റുകൾ നിലവിലെ നിയന്ത്രണങ്ങൾക്ക് അനുസൃതമാണ്."
                      : "Weekly compliance report generated. 98.5% of documents are compliant with current regulations."
                    }
                  </p>
                </div>
                
                <div className="bg-gray-50 border-l-4 border-gray-400 p-3 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 font-bold">
                      {language === "ml" ? "🔧 പരിപാലനം" : "🔧 MAINTENANCE"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {language === "ml" ? "1 ദിവസം മുമ്പ്" : "1 day ago"}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">
                    {language === "ml" 
                      ? "സിസ്റ്റം ബാക്കപ്പ് വിജയകരമായി പൂർത്തിയായി. എല്ലാ ഡോക്യുമെന്റ് ഡാറ്റയും സുരക്ഷിതമായി ആർക്കൈവ് ചെയ്തു."
                      : "System backup completed successfully. All document data has been securely archived."
                    }
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