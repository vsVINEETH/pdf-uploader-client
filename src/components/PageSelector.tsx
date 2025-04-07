'use client'

// components/PageSelector.tsx
interface PageSelectorProps {
    numPages: number;
    selectedPages: number[];
    onSelectPage: (pageNum: number) => void;
  }
  
  export default function PageSelector({ numPages, selectedPages, onSelectPage }: PageSelectorProps) {
    return (
      <div className="mt-6 mb-8">
        <h3 className="text-lg font-medium mb-4 text-gray-500">Select Pages to Extract:</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
            <div key={`select_${pageNum}`} className="text-center">
              <label className="cursor-pointer inline-flex flex-col items-center">
                <input
                  type="checkbox"
                  checked={selectedPages.includes(pageNum)}
                  onChange={() => onSelectPage(pageNum)}
                  className="h-5 w-5"
                />
                <span className="mt-1 text-sm text-gray-600">{pageNum}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }