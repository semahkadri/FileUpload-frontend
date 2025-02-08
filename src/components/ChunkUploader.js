import React, { useState } from 'react';
import { Button, LinearProgress, Typography, Box } from '@mui/material';
import { uploadFileChunk } from '../services/api';

const CHUNK_SIZE = 1024 * 1024; 

const ChunkUploader = ({ onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);
        setError(null);

        try {
            console.log('Starting upload for file:', file.name);
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
            console.log('Total chunks to upload:', totalChunks);
            
            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
                const start = chunkIndex * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, file.size);
                const chunk = file.slice(start, end);
                
                console.log(`Uploading chunk ${chunkIndex + 1}/${totalChunks}`);
                
                await uploadFileChunk(chunk, chunkIndex, totalChunks, file.name);
                
                const newProgress = ((chunkIndex + 1) / totalChunks) * 100;
                setProgress(newProgress);
            }

            console.log('Upload completed successfully');
            onUploadComplete();
        } catch (error) {
            console.error('Upload failed:', error);
            setError(error.message);
        } finally {
            setUploading(false);
            event.target.value = null; 
        }
    };

    return (
        <Box my={3}>
            <input
                accept="*/*"
                style={{ display: 'none' }}
                id="contained-button-file"
                type="file"
                onChange={handleFileSelect}
                disabled={uploading}
            />
            <label htmlFor="contained-button-file">
                <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    disabled={uploading}
                >
                    Select File to Upload
                </Button>
            </label>

            {uploading && (
                <Box mt={2}>
                    <Typography variant="body2" color="textSecondary">
                        Uploading... {Math.round(progress)}%
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                </Box>
            )}

            {error && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                    Error: {error}
                </Typography>
            )}
        </Box>
    );
};

export default ChunkUploader;