"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

function WhatsAppIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [timeStr, setTimeStr] = useState("16:38");

  useEffect(() => {
    const now = new Date();
    setTimeStr(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }));
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsTyping(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 900);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const whatsappUrl =
    "https://api.whatsapp.com/send/?phone=918160602060&text=&type=phone_number&app_absent=0";

  return (
    <>
      {/* Floating WhatsApp trigger button */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50">
        <motion.button
          type="button"
          onClick={() => (isOpen ? setIsOpen(false) : handleOpen())}
          aria-label="Open WhatsApp chat"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative grid size-14 place-items-center rounded-full bg-white shadow-2xl border border-gray-100 hover:shadow-green-500/20 text-[#25D366] transition-shadow cursor-pointer"
        >
          <WhatsAppIcon className="size-8" />
          {/* Subtle online badge */}
          <span className="absolute top-1 right-1 size-3 rounded-full bg-[#25D366] border-2 border-white" />
        </motion.button>
      </div>

      {/* WhatsApp Chat Popup Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-22 right-4 sm:bottom-24 sm:right-6 z-50 w-[90vw] max-w-[340px] sm:w-[350px] overflow-hidden rounded-2xl shadow-2xl border border-gray-200/80 bg-[#ece5dd]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-[#075e54] px-4 py-3.5 text-white">
              <div className="flex items-center gap-3">
                <div className="relative size-10 overflow-hidden rounded-full border border-white/30 bg-gray-200">
                  <Image
                    src="/gallery/doc.webp"
                    alt="Dr. Neeta"
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight text-white">Dr. Neeta</h3>
                  <p className="text-xs text-white/80">Typically replies within a day</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="grid size-7 place-items-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div
              className="p-4 flex flex-col min-h-[220px] justify-between relative bg-[#efeae2]"
              style={{
                backgroundImage:
                  "radial-gradient(#00000007 1px, transparent 1px), radial-gradient(#00000007 1px, #efeae2 1px)",
                backgroundSize: "20px 20px",
                backgroundPosition: "0 0, 10px 10px",
              }}
            >
              {/* Timestamp */}
              <div className="text-center my-1">
                <span className="text-[11px] font-medium text-gray-500 bg-white/70 px-2 py-0.5 rounded-md shadow-xs">
                  {timeStr}
                </span>
              </div>

              {/* Chat Message or Typing Indicator */}
              <div className="my-3">
                <AnimatePresence mode="wait">
                  {isTyping ? (
                    <motion.div
                      key="typing"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="bg-white rounded-2xl rounded-tl-xs px-4 py-3 shadow-sm inline-flex items-center gap-1.5 w-fit"
                    >
                      <span className="size-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="size-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="size-2 rounded-full bg-gray-400 animate-bounce" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="message"
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-2xl rounded-tl-xs p-3.5 shadow-sm max-w-[85%] text-gray-800 text-[13.5px] leading-relaxed relative"
                    >
                      <p className="font-semibold text-gray-900">Hi there 👋</p>
                      <p className="mt-1 text-gray-700">How can I help you?</p>
                      <span className="block text-[10px] text-gray-400 text-right mt-1">
                        {timeStr}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Button: Start Chat */}
              <div className="mt-4 pt-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 px-5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <WhatsAppIcon className="size-5" />
                  <span>Start Chat</span>
                </a>
                <p className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1 mt-2.5">
                  <span>⚡</span> Free WhatsApp Chat Widget
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
