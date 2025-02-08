import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const uploadFileChunk = async (chunk, chunkIndex, totalChunks, filename, onUploadProgress) => {
    const formData = new FormData();
    formData.append('chunk', chunk);
    formData.append('chunk_index', chunkIndex);
    formData.append('total_chunks', totalChunks);
    formData.append('filename', filename);

    const response = await axios.post(`${API_URL}/files/upload-chunk/`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
    });
    return response.data;
};

export const getFilesList = async () => {
    const response = await axios.get(`${API_URL}/files/`);
    return response.data;
};

export const deleteFile = async (fileId) => {
    const response = await axios.delete(`${API_URL}/files/${fileId}/`);
    return response.data;
};