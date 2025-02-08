import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteFile } from '../services/api';

const FileList = ({ files, onFileDelete }) => {
    const handleDelete = async (fileId) => {
        try {
            await deleteFile(fileId);
            onFileDelete(fileId);
        } catch (error) {
            alert('Error deleting file: ' + error.message);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <Box mt={3}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>File Name</TableCell>
                            <TableCell align="right">Size</TableCell>
                            <TableCell align="right">Upload Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {files.map((file) => (
                            <TableRow key={file.id}>
                                <TableCell component="th" scope="row">
                                    {file.name}
                                </TableCell>
                                <TableCell align="right">
                                    {formatBytes(file.size)}
                                </TableCell>
                                <TableCell align="right">
                                    {formatDate(file.upload_date)}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleDelete(file.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default FileList;