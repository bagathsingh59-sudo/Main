"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionLayout } from "@/layouts/SectionLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FAQS } from "@/constants/faq";
import { fadeUp, viewportOnce } from "@/animations/variants";

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

  return (
    <SectionLayout id="faq" className="bg-mist">
      <SectionHeader
        align="center"
        eyebrow="Frequently asked questions"
        title={
          <>
            Answers to the questions <em className="not-italic text-navy-600">CFOs ask first.</em>
          </>
        }
        description="Can't find what you're looking for? Drop us a note — every email is answered in under a working day."
      />

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="mx-auto mt-12 max-w-3xl space-y-3"
      >
        {FAQS.map((f) => {
          const isOpen = openId === f.id;
          return (
            <div
              key={f.id}
              className="overflow-hidden rounded-2xl border border-white/70 bg-white/65 shadow-soft backdrop-blur-xl"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : f.id)}
                className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                aria-expanded={isOpen}
                aria-controls={`faq-${f.id}`}
              >
                <span className="text-[1rem] font-semibold text-navy-900">{f.question}</span>
                <span
                  aria-hidden="true"
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-600 transition-transform ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    id={`faq-${f.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-[0.92rem] leading-[1.75] text-navy-900/65">{f.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>
    </SectionLayout>
  );
}
