import axiosInstance from "@/utils/axiosConfig";

export const pdfService = {
  uploadPDF: async (pdfData: FormData, userId: string) => {
      const response = await axiosInstance.post("/user/upload", pdfData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { userId } 
      });
      return response;
  },

  extractPDF: async (fileUrl: string | null, pages: number[]) => {
    const response = await axiosInstance.post("/user/extract",{
        fileUrl,
        pages
    },{
        responseType: 'arraybuffer'
    });
    return response
  },

  getAllFiles: async (userId: string) => {
    const response = await axiosInstance.get('/user/all_files',{
      params: {userId},
    });

    return response
  },


  getSelectedFile: async (fileName: string) => {
    const response = await axiosInstance.get("/user/selected_file", {
      params: { fileName },
      responseType: 'arraybuffer',
    });
    return response;
  },

  deleteFile: async (fileName: string, userId: string) => {
    const response = await axiosInstance.delete("/user/delete_file", {
      params:{fileName, userId}
    });

    return response;
  }
};