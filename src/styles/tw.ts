// src/styles/tw.ts
// Centralized Tailwind class sets for reuse across the app.
//
// --- COMMON ELEMENTS ---
export const btnPrimary =
  "inline-block px-4 py-2 rounded bg-primary-700 dark:bg-primary-300 text-white dark:text-neutral-900 font-semibold hover:bg-primary-800 dark:hover:bg-primary-200 transition-colors";
export const btnSecondary =
  "inline-block px-4 py-2 rounded border border-primary-700 dark:border-primary-300 text-primary-700 dark:text-primary-300 font-semibold hover:bg-primary-50 dark:hover:bg-primary-900 transition-colors";
export const flexCol = "flex flex-col";
export const flexRow = "flex flex-row";
export const card =
  "bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm p-6 md:p-8";
export const sectionTitle =
  "text-2xl font-bold mb-4 text-primary-700 dark:text-primary-300";
export const viewMoreLink =
  "self-end text-primary-700 dark:text-primary-300 font-semibold hover:underline transition-colors";
export const mainContainer =
  "flex-1 w-full max-w-4xl mx-auto px-4 py-8 md:py-12";
export const pageWrapper =
  "min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300";
export const footer =
  "w-full py-6 border-t border-neutral-200 dark:border-neutral-800 text-center text-sm bg-neutral-100 dark:bg-neutral-950";

// --- PAGE-SPECIFIC ELEMENTS ---
// Home Page
export const homeSection =
  "mb-8 bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-sm p-6 md:p-8 flex flex-col gap-4";

// Certifications Page
export const featuredGrid =
  "flex flex-col gap-9 mt-6 w-full items-center";
export const featuredCard =
  "w-[95vw] max-w-5xl p-8 mx-auto bg-white dark:bg-neutral-900 rounded-xl shadow-md flex flex-col items-center";
export const featuredImage =
  "w-full max-w-3xl h-auto rounded-xl shadow-md object-contain";
