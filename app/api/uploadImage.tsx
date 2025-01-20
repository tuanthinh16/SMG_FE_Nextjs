import { URL_BASE, URL_PORT } from "../config";

export const uploadImage = async (file: File, type: string) => {
    const formData = new FormData();
    formData.append("file", file); // File ảnh
    formData.append("type", type); // Loại ảnh (VD: "CLOTHES")

    try {
        const response = await fetch(`http://${URL_BASE}:${URL_PORT}/api/v1/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Uploaded Image URL:", data.url);
            return data.url;
        } else {
            console.error("Upload error:", data.error);
        }
    } catch (error) {
        console.error("Unexpected error:", error);
    }
};
export const uploadMultipleImages = async (files: FileList, type: string) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file)); // Thêm từng file vào FormData
    formData.append("type", type); // Gửi type

    try {
        const response = await fetch(`http://${URL_BASE}:${URL_PORT}/api/v1/upload-multiple`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Uploaded Image URLs:", data.urls); // Danh sách URL trả về
            return data.urls;
        } else {
            console.error("Upload error:", data.error);
        }
    } catch (error) {
        console.error("Unexpected error:", error);
    }
};


