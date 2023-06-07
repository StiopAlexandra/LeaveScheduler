import React, { useState, memo } from 'react';
import { styled, Button, Container, Typography } from '@mui/material';
import {useTranslation} from 'react-i18next'

const StyledContainer = styled('div')(({theme}) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: '7px'
}))

const Label = styled('legend')(({theme}) => ({
    fontSize: '12px',
    padding: '0 5px',
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(0.875),
}))

const Fieldset = styled('fieldset')(({theme}) => ({
    margin: theme.spacing(0),
    padding: theme.spacing(0),
    borderRadius: '4px',
    border: theme.palette.mode === 'light' ? '1px solid #bfc0c1' : '1px solid #4c5057',
    overflow: 'hidden',
}))

const FileInput = styled('input')({
    display: 'none',
});

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            // Implement your file upload logic here
            console.log('Uploading file:', selectedFile);
        }
    };

    return (
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                File Upload
            </Typography>
            <label htmlFor="file-input">
                <FileInput
                    id="file-input"
                    type="file"
                    onChange={handleFileChange}
                    accept=".txt,.pdf,.doc,.docx"
                />
                <Button variant="contained" component="span">
                    Select File
                </Button>
            </label>
            {selectedFile && (
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    Selected File: {selectedFile.name}
                </Typography>
            )}
            <Button variant="contained" color="primary" onClick={handleUpload} sx={{ marginTop: 2 }}>
                Upload
            </Button>
        </Container>
    );
};



export default memo(FileUpload)