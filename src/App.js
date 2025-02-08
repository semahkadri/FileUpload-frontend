import React, { useState, useEffect } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ChunkUploader from './components/ChunkUploader';
import FileList from './components/FileList';
import { getFilesList } from './services/api';

function App() {
    const [files, setFiles] = useState([]);

    const fetchFiles = async () => {
        try {
            const filesList = await getFilesList();
            setFiles(filesList);
        } catch (error) {
            console.error('Error fetching files:', error);
            alert('Error fetching files: ' + error.message);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileDelete = (fileId) => {
        setFiles(files.filter(file => file.id !== fileId));
    };

    return (
        <Container maxWidth="md">
            <Box my={4}>
                <Typography variant="h4" component="h1" gutterBottom>
                    File Upload System
                </Typography>
                
                <ChunkUploader onUploadComplete={fetchFiles} />
                
                <FileList 
                    files={files}
                    onFileDelete={handleFileDelete}
                />
            </Box>
        </Container>
    );
}

export default App;