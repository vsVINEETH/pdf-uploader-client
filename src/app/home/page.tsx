'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { DataSidebar } from '@/components/Sidebar';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/userAtom';
const PDFPreviewer = dynamic(() => import('../../components/PDFViewer'), { ssr: false });

import UploadForm from '../../components/UploadForm';
import PageSelector from '../../components/PageSelector';
import { ToastContainer, toast } from 'react-toastify';
import { pdfService } from '@/services/pdfServices';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newFile, setNewFile] = useState<string | null>(null);
  const { uploadPDF, extractPDF} = pdfService;
  const [user] = useAtom(userAtom);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setUploadedFile(file);
    setDownloadUrl(null);
    
    const formData = new FormData();
    formData.append('pdf', file);
    try {
      const response = await uploadPDF(formData, user?.userId as string);
      console.log(response);
      setFileUrl(response.data.data.signedUrl);
      setNewFile(response.data.data.fileName);
      toast.success('PDF uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
      setUploadedFile(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDocumentLoad = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    // Initially select all pages
    setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
  };
  
  const handleSelectPage = (pageNum: number) => {
    setSelectedPages(prev => {
      if (prev.includes(pageNum)) {
        return prev.filter(p => p !== pageNum);
      } else {
        return [...prev, pageNum].sort((a, b) => a - b);
      }
    });
  };
  
  const handleSelectAll = () => {
    setSelectedPages(Array.from({ length: numPages }, (_, i) => i + 1));
  };
  
  const handleSelectNone = () => {
    setSelectedPages([]);
  };
  
  const handleCreatePDF = async () => {
    if (selectedPages.length === 0) {
      toast.warning('Please select at least one page');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await extractPDF(fileUrl, selectedPages);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success('New PDF created successfully');
    } catch (error) {
      console.error('Error creating PDF:', error);
      toast.error('Error creating PDF');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
  <>
   <Header/>

   <main className="pt-16 bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen pb-12 mt-20">

      <div className="w-full flex justify-center">
      <DataSidebar
       setFile={setUploadedFile}
       newFile={newFile}
      />
        <div className="w-full max-w-5xl px-4">
          <UploadForm onFileUpload={handleFileUpload} isLoading={isLoading} />

          {downloadUrl && (
                <div className="mt-8 p-6 bg-green-100 border border-green-300 rounded-md shadow">
                  <p className="mb-3 font-medium text-green-700">Your new PDF is ready!</p>
                  <a 
                    href={downloadUrl} 
                    download="extracted.pdf"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
                  >
                    Download PDF
                  </a>
                </div>
          )};

          {uploadedFile && (
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-blue-500 mb-6">
                Preview & Select Pages
              </h2>

              <div className="flex flex-wrap gap-4 mb-6">
                <button 
                  onClick={handleSelectAll}
                  className="bg-blue-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded transition"
                >
                  Select All
                </button>
                <button 
                  onClick={handleSelectNone}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition"
                >
                  Deselect All
                </button>
                <button 
                  onClick={handleCreatePDF}
                  disabled={selectedPages.length === 0 || isLoading}
                  className={`ml-auto text-white font-medium py-2 px-4 rounded transition ${
                    selectedPages.length === 0 || isLoading
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isLoading ? 'Creating...' : 'Create New PDF'}
                </button>
              </div>

              <p className="text-gray-700 mb-4">
                {selectedPages.length} of {numPages} pages selected
              </p>

              <div className="mb-10">
                <PDFPreviewer 
                  file={uploadedFile} 
                  onDocumentLoad={handleDocumentLoad}
                  selectedPages={selectedPages}
                  onSelectPage={handleSelectPage} 
                />
              </div>

              <PageSelector 
                numPages={numPages} 
                selectedPages={selectedPages} 
                onSelectPage={handleSelectPage} 
              />

            </div>
          )}
        </div>
      </div>

      <ToastContainer position="bottom-right" />
    </main>
  </>
  );
}