import React, { useState } from 'react';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import { uploadFileChunk } from '../services/api';

const CHUNK_SIZE = 1024 * 1024; 

const ChunkUploader = ({ onUploadComplete }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        setProgress(0);

        const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
        let chunkIndex = 0;

        for (let start = 0; start < file.size; start += CHUNK_SIZE) {
            const chunk = file.slice(start, start + CHUNK_SIZE);
            const currentChunkIndex = chunkIndex; 
            try {
                await uploadFileChunk(chunk, currentChunkIndex, totalChunks, file.name, (event) => {
                    setProgress(((currentChunkIndex + 1) / totalChunks) * 100);
                });
                chunkIndex++;
            } catch (error) {
                console.error('Error uploading chunk:', error);
                alert('Error uploading chunk: ' + error.message);
                setUploading(false);
                return;
            }
        }

        onUploadComplete();
        setProgress(100); 
        setUploading(false);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
            <input
                accept="*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
                <Button variant="contained" color="primary" component="span">
                    Upload File
                </Button>
            </label>
            {uploading && (
                <Box width="100%" mt={2}>
                    <LinearProgress variant="determinate" value={progress} />
                    <Typography variant="body2" color="textSecondary" align="center">
                        {Math.round(progress)}%
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ChunkUploader;