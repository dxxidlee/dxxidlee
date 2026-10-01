"use client";

import { useState, useTransition } from "react";

type Props = {
  /** id of the rendered dieline <svg> on the page */
  svgId: string;
  filename: string;
};

/** Exports the on-page dieline SVG to a true-size PDF. */
export function DownloadDielineButton({ svgId, filename }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function download() {
    setError(null);
    startTransition(async () => {
      const source = document.getElementById(svgId);
      if (!(source instanceof SVGSVGElement)) {
        setError("The dieline could not be found.");
        return;
      }
      const [{ jsPDF }] = await Promise.all([import("jspdf"), import("svg2pdf.js")]);
      const [, , width, height] = source.getAttribute("viewBox")!.split(" ").map(Number);

      // PDF viewers lack the web font, so the PDF uses the built-in Helvetica.
      const svg = source.cloneNode(true) as SVGSVGElement;
      svg.setAttribute("font-family", "helvetica");
      svg.style.position = "absolute";
      svg.style.left = "-100000px";
      document.body.appendChild(svg);

      try {
        const pdf = new jsPDF({
          unit: "mm",
          format: [width, height],
          orientation: width > height ? "landscape" : "portrait",
        });
        await pdf.svg(svg, { x: 0, y: 0, width, height });
        pdf.save(filename);
      } catch {
        setError("The dieline could not be exported.");
      } finally {
        svg.remove();
      }
    });
  }

  return (
    <>
      <button type="button" className="chip" onClick={download} disabled={pending}>
        <span>{pending ? "Preparing PDF" : "Download dieline"}</span>
        <span>PDF</span>
      </button>
      {error ? <p aria-live="polite">{error}</p> : null}
    </>
  );
}
