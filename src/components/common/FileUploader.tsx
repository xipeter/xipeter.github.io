import { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface FileUploaderProps {
  onFileSelect: (content: string, fileName: string, type: string) => void;
}

export const FileUploader = ({ onFileSelect }: FileUploaderProps): React.JSX.Element => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileSelect(content, file.name, file.type);
    };
    reader.readAsText(file);
  }, [onFileSelect]);

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: 'grey.400',
        borderRadius: 2,
        p: 4,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          bgcolor: 'action.hover'
        }
      }}
      component="label"
    >
      <input
        type="file"
        hidden
        accept=".md,.markdown,.json,.xml,.txt"
        onChange={handleFileChange}
      />
      <CloudUploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
      <Typography variant="h6" color="text.secondary">
        Click to upload a file
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Supports .md, .json, .xml
      </Typography>
    </Box>
  );
};
