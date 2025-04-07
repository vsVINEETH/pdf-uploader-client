'use client';
import { useEffect, useState } from 'react';
import { pdfService } from '@/services/pdfServices';
import { useAtom } from 'jotai';
import { userAtom } from '@/store/userAtom';
interface SidebarProps {
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    newFile: string | null;
  }

  interface FileItem {
    fileName: string;
    s3Url?: string,
    _id?: string,
    updatedAt?: string,
  }
export function DataSidebar({setFile, newFile}: SidebarProps) {
  const { getAllFiles } = pdfService;
  const [files, setFiles] = useState<FileItem[]>([]);
  const {getSelectedFile, deleteFile} = pdfService
  const [user] = useAtom(userAtom);

  useEffect(() => {
    if (user?.userId) {
      fetchFiles();
    }
  }, [user?.userId]);
  
  useEffect(() => {
    if(newFile){
     setFiles(prev => [{fileName: newFile}, ...prev]);
    }
  },[newFile])

  const fetchFiles = async () => {
    try {
      const response = await getAllFiles(user?.userId as string);
      const data = Array.isArray(response.data) ? response.data : [];
      setFiles(data);
    } catch (error) {
      console.error('Failed to fetch PDF files:', error);
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
        const confirmation = confirm('Do you want delete this file ?')
        if(!confirmation){ return };
        const response = await deleteFile(fileName, user?.userId as string);

        if (response.status === 200) {
            setFiles(prev => prev.filter(file => file.fileName !== fileName));
            if(fileName === newFile){
               setFile(null);
            }
        };
     
    } catch (error) {
        console.log('something happend', error);
    }
  }

  const fetchSelectedFile = async (fileName: string) => {
    try {
      const response = await getSelectedFile(fileName);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const file = new File([blob], fileName, { type: 'application/pdf' });
      setFile(file);
    } catch (error) {
      console.log('Failed to fetch file', error)  
    }
  }

  return (
    <aside className="w-64 h-screen overflow-y-auto border-r border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Your PDFs</h2>
      <ul className="space-y-2">
        {files.length === 0 ? (
          <li className="text-sm text-gray-500">No files found</li>
        ) : (
          files instanceof Array && files.map((file, index) => (
            <li key={index}>
            <div className="flex justify-between items-center px-2 py-1 rounded hover:bg-gray-100">
                <button
                className="text-left text-gray-800 truncate w-full"
                onClick={() => fetchSelectedFile(file.fileName)}
                >
                📄 {file?.fileName.split('-')[1] || file.fileName}
                </button>
                <button
                onClick={() => handleDelete(file?.fileName)}
                className="ml-2 text-red-500 hover:text-red-700"
                title="Delete file"
                >
                ❌
                </button>
            </div>
            </li>

          ))
        )}
      </ul>
    </aside>
  );
}
