'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

interface PDFViewerProps {
  file: File | string;
  onDocumentLoad: ({ numPages }: { numPages: number }) => void;
  selectedPages: number[];
  onSelectPage: (pageNum: number) => void;
}

export default function PDFViewer({
  file,
  onDocumentLoad,
  selectedPages,
  onSelectPage,
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);

  useEffect(() => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      setFileURL(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else if (typeof file === 'string') {
      setFileURL(file);
    }
  }, [file]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    onDocumentLoad({ numPages });
  }

  if (!fileURL) {
    return <div className="text-center py-10">Preparing PDF...</div>;
  }

  return (
    <div className="pdf-viewer mb-8">
      <Document
        file={fileURL}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div className="text-center py-10">Loading PDF...</div>}
        error={
          <div className="text-center py-10 text-red-500">
            Error loading PDF! Please check console for details.
          </div>
        }
        onLoadError={(error) => console.error('PDF Load Error:', error)}
      >
        {numPages && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: numPages }, (_, index) => {
              const pageNum = index + 1;
              const isSelected = selectedPages.includes(pageNum);

              return (
                <div
                  key={`page_${pageNum}`}
                  onClick={() => onSelectPage(pageNum)}
                  className={`cursor-pointer transition-all duration-200 ease-in-out border rounded overflow-hidden shadow-sm
                    ${isSelected
                      ? 'border-4 border-indigo-500 scale-105 ring-2 ring-indigo-300 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                    }`}
                >
                  <Page
                    pageNumber={pageNum}
                    width={300}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={
                      <div className="h-64 flex items-center justify-center">
                        Loading page {pageNum}...
                      </div>
                    }
                    error={
                      <div className="h-64 flex items-center justify-center text-red-500">
                        Error loading page {pageNum}
                      </div>
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </Document>
    </div>
  );
}
