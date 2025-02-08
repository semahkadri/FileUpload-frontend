import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CssBaseline, ThemeProvider, createTheme, IconButton, Snackbar, Button } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import ChunkUploader from './components/ChunkUploader';
import FileList from './components/FileList';
import { getFilesList } from './services/api';

const App = () => {
    const [mode, setMode] = useState('dark');
    const [files, setFiles] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const theme = createTheme({
        palette: {
            mode,
            primary: {
                main: '#00e676',
            },
            background: {
                default: mode === 'dark' ? '#121212' : '#ffffff',
                paper: mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
            },
            text: {
                primary: mode === 'dark' ? '#ffffff' : '#000000',
            },
        },
        typography: {
            fontFamily: 'Roboto, sans-serif',
            h4: {
                fontWeight: 700,
                letterSpacing: '0.1em',
            },
        },
        components: {
            MuiContainer: {
                styleOverrides: {
                    root: {
                        padding: '2rem',
                        borderRadius: '8px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            transform: 'scale(1.1)',
                        },
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    root: {
                        '&:hover': {
                            color: 'red',
                        },
                    },
                },
            },
        },
    });

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
        setSnackbarMessage('File deleted successfully');
        setSnackbarOpen(true);
    };

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'dark' ? 'light' : 'dark'));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="md">
                <Box my={4} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4" component="h1" gutterBottom>
                        File Upload System
                    </Typography>
                    <IconButton onClick={toggleTheme} color="inherit" style={{ transition: 'transform 0.3s ease' }}>
                        {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Box>
                
                <ChunkUploader onUploadComplete={() => {
                    fetchFiles();
                    setSnackbarMessage('File uploaded successfully');
                    setSnackbarOpen(true);
                }} />
                
                <FileList 
                    files={files}
                    onFileDelete={handleFileDelete}
                />
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                action={
                    <Button color="secondary" size="small" onClick={handleSnackbarClose}>
                        Close
                    </Button>
                }
            />
        </ThemeProvider>
    );
};

export default App;