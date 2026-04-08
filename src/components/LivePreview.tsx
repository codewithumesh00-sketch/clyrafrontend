"use client";

import React, {
  memo,
  useMemo,
  Suspense,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import { ExternalLink } from "lucide-react";

const WebsiteRenderer = dynamic(
  () => import("@/components/renderer/WebsiteRenderer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
        ⚡ Building website...
      </div>
    ),
  }
);

interface LivePreviewProps {
  schema?: any;
  isDark?: boolean;
}

function LivePreviewComponent({
  schema,
  isDark = true,
}: LivePreviewProps) {
  // ✅ supports both sections + pages
const hasContent =
  !!schema &&
  (
    (Array.isArray(schema.sections) && schema.sections.length > 0) ||
    (Array.isArray(schema.pages) && schema.pages.length > 0) ||
    Object.keys(schema || {}).length > 0
  );

  // ✅ deep clone for fresh renderer updates
  const memoizedSchema = useMemo(() => {
    if (!schema || typeof schema !== "object") return null;

    try {
      return JSON.parse(JSON.stringify(schema));
    } catch (error) {
      console.error("Schema clone failed:", error);
      return null;
    }
  }, [schema]);

  // ✅ open exact same generated preview in new tab
  const handleOpenNewTab = useCallback(() => {
    if (!memoizedSchema) return;

    try {
      sessionStorage.setItem(
        "live-preview-schema",
        JSON.stringify(memoizedSchema)
      );

      window.open(
        `/preview?t=${Date.now()}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.error("Preview open failed:", error);
    }
  }, [memoizedSchema]);

  return (
    <div
      className={`relative h-full w-full overflow-auto ${
        isDark ? "bg-black text-white" : "bg-white text-black"
      }`}
    >
      {/* ✅ top preview action bar */}
      {hasContent && (
        <div
          className={`sticky top-0 z-20 flex justify-end border-b p-3 backdrop-blur-md ${
            isDark
              ? "border-white/10 bg-black/70"
              : "border-black/10 bg-white/70"
          }`}
        >
          <button
            type="button"
            onClick={handleOpenNewTab}
            className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
              isDark
                ? "border-white/20 hover:bg-white/10"
                : "border-black/20 hover:bg-black/5"
            }`}
          >
            <ExternalLink size={16} />
            Watch your website in new tab
          </button>
        </div>
      )}

      {!hasContent ? (
        <div className="flex h-full w-full items-center justify-center text-sm opacity-60">
          🚀 Start by entering a prompt to generate your website
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center text-sm opacity-60">
              ⚡ Generating preview...
            </div>
          }
        >
          <WebsiteRenderer schema={memoizedSchema} />
        </Suspense>
      )}
    </div>
  );
}

export default memo(LivePreviewComponent);
// "use client";

// import React, { useMemo } from "react";

// interface LivePreviewProps {
//   files: Record<string, string>;
//   globalCss: string;
//   isDark?: boolean;
// }

// export default function LivePreview({
//   files,
//   globalCss,
//   isDark = true,
// }: LivePreviewProps) {
//   const html = useMemo(() => {
//     const page =
//       files["src/app/page.tsx"] ||
//       `
//       <div class="container ${isDark ? "dark" : ""}">
//         <div class="animated-bg"></div>
        
//         <div class="content">
//           <div class="badge">
//             <span class="badge-dot"></span>
//             <span class="badge-text">Welcome to</span>
//           </div>
          
//           <h1 class="title">
//             <span class="gradient-text">clyraweb</span>
//           </h1>
          
//           <p class="subtitle">
//             <span class="typewriter">Create. Build. Deploy.</span>
//             <span class="cursor">|</span>
//           </p>
          
//           <div class="features">
//             <div class="feature-item">
//               <span class="feature-icon">◇</span>
//               <span class="feature-text">Fast</span>
//             </div>
//             <div class="feature-item">
//               <span class="feature-icon">○</span>
//               <span class="feature-text">Modern</span>
//             </div>
//             <div class="feature-item">
//               <span class="feature-icon">△</span>
//               <span class="feature-text">Powerful</span>
//             </div>
//           </div>
          
//           <div class="cta-wrapper">
//             <button class="cta-button">
//               <span class="button-text">Get Started</span>
//               <span class="button-arrow">→</span>
//             </button>
//           </div>
//         </div>

//         <div class="grid-overlay"></div>
//       </div>

//       <style>
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
//         * {
//           margin: 0;
//           padding: 0;
//           box-sizing: border-box;
//         }

//         :root {
//           --bg-light: #ffffff;
//           --bg-dark: #0a0a0a;
//           --text-light: #0a0a0a;
//           --text-dark: #ffffff;
//           --gradient-1: #667eea;
//           --gradient-2: #764ba2;
//           --gradient-3: #f093fb;
//         }

//         .container {
//           min-height: 100vh;
//           width: 100%;
//           position: relative;
//           overflow: hidden;
//           font-family: 'Inter', system-ui, -apple-system, sans-serif;
//           background: var(--bg-light);
//           color: var(--text-light);
//           transition: background-color 0.3s ease, color 0.3s ease;
//         }

//         .container.dark {
//           background: var(--bg-dark);
//           color: var(--text-dark);
//         }

//         /* Animated Background */
//         .animated-bg {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background: 
//             radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
//             radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
//             radial-gradient(circle at 40% 20%, rgba(240, 147, 251, 0.1) 0%, transparent 50%);
//           animation: bgPulse 8s ease-in-out infinite;
//           pointer-events: none;
//         }

//         @keyframes bgPulse {
//           0%, 100% { opacity: 0.5; transform: scale(1); }
//           50% { opacity: 1; transform: scale(1.1); }
//         }

//         /* Grid Overlay */
//         .grid-overlay {
//           position: absolute;
//           top: 0;
//           left: 0;
//           width: 100%;
//           height: 100%;
//           background-image: 
//             linear-gradient(rgba(102, 126, 234, 0.03) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(102, 126, 234, 0.03) 1px, transparent 1px);
//           background-size: 50px 50px;
//           pointer-events: none;
//           opacity: 0;
//           animation: fadeIn 2s ease 0.5s forwards;
//         }

//         .container.dark .grid-overlay {
//           background-image: 
//             linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
//         }

//         @keyframes fadeIn {
//           to { opacity: 1; }
//         }

//         /* Content */
//         .content {
//           position: relative;
//           z-index: 10;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           min-height: 100vh;
//           padding: 40px 20px;
//           text-align: center;
//         }

//         /* Badge */
//         .badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 8px 16px;
//           background: rgba(102, 126, 234, 0.1);
//           border: 1px solid rgba(102, 126, 234, 0.2);
//           border-radius: 50px;
//           font-size: 0.75rem;
//           font-weight: 500;
//           letter-spacing: 0.5px;
//           text-transform: uppercase;
//           margin-bottom: 30px;
//           opacity: 0;
//           animation: slideDown 0.8s ease forwards;
//         }

//         .container.dark .badge {
//           background: rgba(102, 126, 234, 0.15);
//           border-color: rgba(102, 126, 234, 0.3);
//         }

//         .badge-dot {
//           width: 6px;
//           height: 6px;
//           background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
//           border-radius: 50%;
//           animation: pulse 2s ease-in-out infinite;
//         }

//         @keyframes pulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(1.2); }
//         }

//         @keyframes slideDown {
//           0% {
//             opacity: 0;
//             transform: translateY(-20px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         /* Title with Gradient Text */
//         .title {
//           font-size: clamp(3rem, 10vw, 6rem);
//           font-weight: 700;
//           margin-bottom: 20px;
//           letter-spacing: -0.02em;
//           opacity: 0;
//           animation: scaleIn 1s ease 0.2s forwards;
//         }

//         .gradient-text {
//           background: linear-gradient(
//             135deg,
//             #667eea 0%,
//             #764ba2 25%,
//             #f093fb 50%,
//             #764ba2 75%,
//             #667eea 100%
//           );
//           background-size: 200% auto;
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           animation: gradientShift 3s linear infinite;
//           display: inline-block;
//         }

//         @keyframes gradientShift {
//           0% { background-position: 0% center; }
//           100% { background-position: 200% center; }
//         }

//         @keyframes scaleIn {
//           0% {
//             opacity: 0;
//             transform: scale(0.8);
//           }
//           100% {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }

//         /* Subtitle with Typewriter */
//         .subtitle {
//           font-size: 1.125rem;
//           font-weight: 400;
//           color: inherit;
//           opacity: 0.7;
//           margin-bottom: 40px;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//         }

//         .typewriter {
//           overflow: hidden;
//           white-space: nowrap;
//           animation: typing 3s steps(20) 0.5s forwards, blink 1s step-end infinite;
//           opacity: 0;
//         }

//         @keyframes typing {
//           0% {
//             width: 0;
//             opacity: 1;
//           }
//           100% {
//             width: 100%;
//             opacity: 1;
//           }
//         }

//         @keyframes blink {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0; }
//         }

//         .cursor {
//           color: #667eea;
//           font-weight: 600;
//           animation: cursorBlink 1s step-end infinite;
//         }

//         @keyframes cursorBlink {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0; }
//         }

//         /* Features */
//         .features {
//           display: flex;
//           gap: 30px;
//           margin-bottom: 50px;
//           flex-wrap: wrap;
//           justify-content: center;
//         }

//         .feature-item {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 0.875rem;
//           font-weight: 500;
//           opacity: 0;
//           animation: fadeInUp 0.6s ease forwards;
//         }

//         .feature-item:nth-child(1) { animation-delay: 1s; }
//         .feature-item:nth-child(2) { animation-delay: 1.2s; }
//         .feature-item:nth-child(3) { animation-delay: 1.4s; }

//         @keyframes fadeInUp {
//           0% {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           100% {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .feature-icon {
//           font-size: 1rem;
//           background: linear-gradient(135deg, #667eea, #764ba2);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           background-clip: text;
//           animation: rotate 4s linear infinite;
//           display: inline-block;
//         }

//         @keyframes rotate {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }

//         /* CTA Button */
//         .cta-wrapper {
//           opacity: 0;
//           animation: fadeInUp 0.8s ease 1.6s forwards;
//         }

//         .cta-button {
//           position: relative;
//           padding: 14px 32px;
//           background: transparent;
//           border: 2px solid;
//           border-color: rgba(102, 126, 234, 0.5);
//           border-radius: 50px;
//           font-size: 0.875rem;
//           font-weight: 600;
//           font-family: inherit;
//           cursor: pointer;
//           overflow: hidden;
//           transition: all 0.3s ease;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           color: inherit;
//         }

//         .cta-button::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: -100%;
//           width: 100%;
//           height: 100%;
//           background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent);
//           transition: left 0.5s ease;
//         }

//         .cta-button:hover::before {
//           left: 100%;
//         }

//         .cta-button:hover {
//           border-color: #667eea;
//           transform: translateY(-2px);
//           box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
//         }

//         .button-arrow {
//           transition: transform 0.3s ease;
//           display: inline-block;
//         }

//         .cta-button:hover .button-arrow {
//           transform: translateX(4px);
//         }
//       </style>
//       `;

//     return `
//       <!DOCTYPE html>
//       <html class="${isDark ? "dark" : ""}">
//         <head>
//           <style>
//             * { box-sizing: border-box; }
//             body {
//               margin: 0;
//               font-family: system-ui, sans-serif;
//             }
//             ${globalCss}
//           </style>
//         </head>
//         <body class="${isDark ? "dark" : ""}">
//           ${page}
//         </body>
//       </html>
//     `;
//   }, [files, globalCss, isDark]);

//   return (
//     <iframe
//       srcDoc={html}
//       title="Live Preview"
//       className="w-full h-full border-0"
//       sandbox="allow-scripts allow-same-origin"
//     />
//   );
// }

// // "use client";

// // import React, { useMemo } from "react";

// // interface LivePreviewProps {
// //   files: Record<string, string>;
// //   globalCss: string;
// // }

// // export default function LivePreview({
// //   files,
// //   globalCss,
// // }: LivePreviewProps) {
// //   const html = useMemo(() => {
// //     const page =
// //       files["src/app/page.tsx"] ||
// //       `
// //       <div class="container">
// //         <div class="animated-bg"></div>
        
// //         <div class="content">
// //           <div class="badge">
// //             <span class="badge-dot"></span>
// //             <span class="badge-text">Welcome to</span>
// //           </div>
          
// //           <h1 class="title">
// //             <span class="gradient-text">clyraweb</span>
// //           </h1>
          
// //           <p class="subtitle">
// //             <span class="typewriter">Create. Build. Deploy.</span>
// //             <span class="cursor">|</span>
// //           </p>
          
// //           <div class="features">
// //             <div class="feature-item">
// //               <span class="feature-icon">◇</span>
// //               <span class="feature-text">Fast</span>
// //             </div>
// //             <div class="feature-item">
// //               <span class="feature-icon">○</span>
// //               <span class="feature-text">Modern</span>
// //             </div>
// //             <div class="feature-item">
// //               <span class="feature-icon">△</span>
// //               <span class="feature-text">Powerful</span>
// //             </div>
// //           </div>
          
// //           <div class="cta-wrapper">
// //             <button class="cta-button">
// //               <span class="button-text">Get Started</span>
// //               <span class="button-arrow">→</span>
// //             </button>
// //           </div>
// //         </div>

// //         <div class="grid-overlay"></div>
// //       </div>

// //       <style>
// //         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
// //         * {
// //           margin: 0;
// //           padding: 0;
// //           box-sizing: border-box;
// //         }

// //         :root {
// //           --bg-light: #ffffff;
// //           --bg-dark: #0a0a0a;
// //           --text-light: #0a0a0a;
// //           --text-dark: #ffffff;
// //           --gradient-1: #667eea;
// //           --gradient-2: #764ba2;
// //           --gradient-3: #f093fb;
// //         }

// //         .container {
// //           min-height: 100vh;
// //           width: 100%;
// //           position: relative;
// //           overflow: hidden;
// //           font-family: 'Inter', system-ui, -apple-system, sans-serif;
// //           background: var(--bg-light);
// //           color: var(--text-light);
// //           transition: all 0.5s ease;
// //         }

// //         .container.dark {
// //           background: var(--bg-dark);
// //           color: var(--text-dark);
// //         }

// //         /* Animated Background */
// //         .animated-bg {
// //           position: absolute;
// //           top: 0;
// //           left: 0;
// //           width: 100%;
// //           height: 100%;
// //           background: 
// //             radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
// //             radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
// //             radial-gradient(circle at 40% 20%, rgba(240, 147, 251, 0.1) 0%, transparent 50%);
// //           animation: bgPulse 8s ease-in-out infinite;
// //           pointer-events: none;
// //         }

// //         @keyframes bgPulse {
// //           0%, 100% { opacity: 0.5; transform: scale(1); }
// //           50% { opacity: 1; transform: scale(1.1); }
// //         }

// //         /* Grid Overlay */
// //         .grid-overlay {
// //           position: absolute;
// //           top: 0;
// //           left: 0;
// //           width: 100%;
// //           height: 100%;
// //           background-image: 
// //             linear-gradient(rgba(102, 126, 234, 0.03) 1px, transparent 1px),
// //             linear-gradient(90deg, rgba(102, 126, 234, 0.03) 1px, transparent 1px);
// //           background-size: 50px 50px;
// //           pointer-events: none;
// //           opacity: 0;
// //           animation: fadeIn 2s ease 0.5s forwards;
// //         }

// //         .container.dark .grid-overlay {
// //           background-image: 
// //             linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
// //             linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
// //         }

// //         @keyframes fadeIn {
// //           to { opacity: 1; }
// //         }

// //         /* Content */
// //         .content {
// //           position: relative;
// //           z-index: 10;
// //           display: flex;
// //           flex-direction: column;
// //           align-items: center;
// //           justify-content: center;
// //           min-height: 100vh;
// //           padding: 40px 20px;
// //           text-align: center;
// //         }

// //         /* Badge */
// //         .badge {
// //           display: inline-flex;
// //           align-items: center;
// //           gap: 8px;
// //           padding: 8px 16px;
// //           background: rgba(102, 126, 234, 0.1);
// //           border: 1px solid rgba(102, 126, 234, 0.2);
// //           border-radius: 50px;
// //           font-size: 0.75rem;
// //           font-weight: 500;
// //           letter-spacing: 0.5px;
// //           text-transform: uppercase;
// //           margin-bottom: 30px;
// //           opacity: 0;
// //           animation: slideDown 0.8s ease forwards;
// //         }

// //         .container.dark .badge {
// //           background: rgba(102, 126, 234, 0.15);
// //           border-color: rgba(102, 126, 234, 0.3);
// //         }

// //         .badge-dot {
// //           width: 6px;
// //           height: 6px;
// //           background: linear-gradient(135deg, var(--gradient-1), var(--gradient-2));
// //           border-radius: 50%;
// //           animation: pulse 2s ease-in-out infinite;
// //         }

// //         @keyframes pulse {
// //           0%, 100% { opacity: 1; transform: scale(1); }
// //           50% { opacity: 0.5; transform: scale(1.2); }
// //         }

// //         @keyframes slideDown {
// //           0% {
// //             opacity: 0;
// //             transform: translateY(-20px);
// //           }
// //           100% {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }

// //         /* Title with Gradient Text */
// //         .title {
// //           font-size: clamp(3rem, 10vw, 6rem);
// //           font-weight: 700;
// //           margin-bottom: 20px;
// //           letter-spacing: -0.02em;
// //           opacity: 0;
// //           animation: scaleIn 1s ease 0.2s forwards;
// //         }

// //         .gradient-text {
// //           background: linear-gradient(
// //             135deg,
// //             #667eea 0%,
// //             #764ba2 25%,
// //             #f093fb 50%,
// //             #764ba2 75%,
// //             #667eea 100%
// //           );
// //           background-size: 200% auto;
// //           -webkit-background-clip: text;
// //           -webkit-text-fill-color: transparent;
// //           background-clip: text;
// //           animation: gradientShift 3s linear infinite;
// //           display: inline-block;
// //         }

// //         @keyframes gradientShift {
// //           0% { background-position: 0% center; }
// //           100% { background-position: 200% center; }
// //         }

// //         @keyframes scaleIn {
// //           0% {
// //             opacity: 0;
// //             transform: scale(0.8);
// //           }
// //           100% {
// //             opacity: 1;
// //             transform: scale(1);
// //           }
// //         }

// //         /* Subtitle with Typewriter */
// //         .subtitle {
// //           font-size: 1.125rem;
// //           font-weight: 400;
// //           color: inherit;
// //           opacity: 0.7;
// //           margin-bottom: 40px;
// //           display: flex;
// //           align-items: center;
// //           gap: 8px;
// //         }

// //         .typewriter {
// //           overflow: hidden;
// //           white-space: nowrap;
// //           animation: typing 3s steps(20) 0.5s forwards, blink 1s step-end infinite;
// //           opacity: 0;
// //         }

// //         @keyframes typing {
// //           0% {
// //             width: 0;
// //             opacity: 1;
// //           }
// //           100% {
// //             width: 100%;
// //             opacity: 1;
// //           }
// //         }

// //         @keyframes blink {
// //           0%, 100% { opacity: 1; }
// //           50% { opacity: 0; }
// //         }

// //         .cursor {
// //           color: #667eea;
// //           font-weight: 600;
// //           animation: cursorBlink 1s step-end infinite;
// //         }

// //         @keyframes cursorBlink {
// //           0%, 100% { opacity: 1; }
// //           50% { opacity: 0; }
// //         }

// //         /* Features */
// //         .features {
// //           display: flex;
// //           gap: 30px;
// //           margin-bottom: 50px;
// //           flex-wrap: wrap;
// //           justify-content: center;
// //         }

// //         .feature-item {
// //           display: flex;
// //           align-items: center;
// //           gap: 8px;
// //           font-size: 0.875rem;
// //           font-weight: 500;
// //           opacity: 0;
// //           animation: fadeInUp 0.6s ease forwards;
// //         }

// //         .feature-item:nth-child(1) { animation-delay: 1s; }
// //         .feature-item:nth-child(2) { animation-delay: 1.2s; }
// //         .feature-item:nth-child(3) { animation-delay: 1.4s; }

// //         @keyframes fadeInUp {
// //           0% {
// //             opacity: 0;
// //             transform: translateY(20px);
// //           }
// //           100% {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }

// //         .feature-icon {
// //           font-size: 1rem;
// //           background: linear-gradient(135deg, #667eea, #764ba2);
// //           -webkit-background-clip: text;
// //           -webkit-text-fill-color: transparent;
// //           background-clip: text;
// //           animation: rotate 4s linear infinite;
// //           display: inline-block;
// //         }

// //         @keyframes rotate {
// //           0% { transform: rotate(0deg); }
// //           100% { transform: rotate(360deg); }
// //         }

// //         /* CTA Button */
// //         .cta-wrapper {
// //           opacity: 0;
// //           animation: fadeInUp 0.8s ease 1.6s forwards;
// //         }

// //         .cta-button {
// //           position: relative;
// //           padding: 14px 32px;
// //           background: transparent;
// //           border: 2px solid;
// //           border-color: rgba(102, 126, 234, 0.5);
// //           border-radius: 50px;
// //           font-size: 0.875rem;
// //           font-weight: 600;
// //           font-family: inherit;
// //           cursor: pointer;
// //           overflow: hidden;
// //           transition: all 0.3s ease;
// //           display: flex;
// //           align-items: center;
// //           gap: 10px;
// //           color: inherit;
// //         }

// //         .cta-button::before {
// //           content: '';
// //           position: absolute;
// //           top: 0;
// //           left: -100%;
// //           width: 100%;
// //           height: 100%;
// //           background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.2), transparent);
// //           transition: left 0.5s ease;
// //         }

// //         .cta-button:hover::before {
// //           left: 100%;
// //         }

// //         .cta-button:hover {
// //           border-color: #667eea;
// //           transform: translateY(-2px);
// //           box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
// //         }

// //         .button-arrow {
// //           transition: transform 0.3s ease;
// //           display: inline-block;
// //         }

// //         .cta-button:hover .button-arrow {
// //           transform: translateX(4px);
// //         }

// //         /* Theme Toggle */
// //         .theme-toggle {
// //           position: fixed;
// //           top: 20px;
// //           right: 20px;
// //           z-index: 100;
// //           padding: 10px 16px;
// //           background: rgba(102, 126, 234, 0.1);
// //           border: 1px solid rgba(102, 126, 234, 0.2);
// //           border-radius: 50px;
// //           font-size: 0.75rem;
// //           font-weight: 600;
// //           cursor: pointer;
// //           transition: all 0.3s ease;
// //           color: inherit;
// //         }

// //         .theme-toggle:hover {
// //           background: rgba(102, 126, 234, 0.2);
// //           transform: scale(1.05);
// //         }
// //       </style>

// //       <script>
// //         // Theme toggle functionality
// //         const container = document.querySelector('.container');
// //         const themeToggle = document.createElement('button');
// //         themeToggle.className = 'theme-toggle';
// //         themeToggle.textContent = '◐ Theme';
// //         themeToggle.onclick = () => {
// //           container.classList.toggle('dark');
// //         };
// //         document.body.appendChild(themeToggle);

// //         // Auto-toggle theme based on system preference
// //         if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
// //           container.classList.add('dark');
// //         }
// //       </script>
// //       `;

// //     return `
// //       <!DOCTYPE html>
// //       <html>
// //         <head>
// //           <style>
// //             * { box-sizing: border-box; }
// //             body {
// //               margin: 0;
// //               font-family: system-ui, sans-serif;
// //             }
// //             ${globalCss}
// //           </style>
// //         </head>
// //         <body>
// //           ${page}
// //         </body>
// //       </html>
// //     `;
// //   }, [files, globalCss]);

// //   return (
// //     <iframe
// //       srcDoc={html}
// //       title="Live Preview"
// //       className="w-full h-full border-0"
// //       sandbox="allow-scripts allow-same-origin"
// //     />
// //   );
// // }