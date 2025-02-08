import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const uploadFileChunk = async (chunk, chunkIndex, totalChunks, fileName) => {
    const formData = new FormData();
    // Create a file object from the chunk
    const chunkFile = new Blob([chunk], { type: 'application/octet-stream' });
    formData.append('chunk', chunkFile, 'chunk');
    formData.append('chunk_index', chunkIndex);
    formData.append('total_chunks', totalChunks);
    formData.append('filename', fileName);

    try {
        const response = await axios.post(`${API_URL}/files/upload-chunk/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Upload error details:', error.response || error);
        throw new Error(error.response?.data?.error || error.message);
    }
};

export const getFilesList = async () => {
    try {
        const response = await api.get('/files/');
        return response.data;
    } catch (error) {
        console.error('Fetch error details:', error.response || error);
        throw new Error('Error fetching files: ' + error.message);
    }
};

export const deleteFile = async (fileId) => {
    try {
        await api.delete(`/files/${fileId}/`);
    } catch (error) {
        console.error('Delete error details:', error.response || error);
        throw new Error('Error deleting file: ' + error.message);
    }
};