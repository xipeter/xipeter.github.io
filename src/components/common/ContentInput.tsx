import { useState, useCallback } from 'react';

// 1. React/core
// Already imported above

// 2. MobX (none needed)

// 3. External libraries (none needed)

// 4. Internal modules (none needed)

// MUI
import { Box, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

interface ContentInputProps {
  onContentChange: (content: string, type: string) => void;
}

export const ContentInput = ({ onContentChange }: ContentInputProps): React.JSX.Element => {
  const [content, setContent] = useState('');
  const [format, setFormat] = useState<string>('markdown');

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    onContentChange(value, format);
  }, [onContentChange, format]);

  const handleFormatChange = useCallback((_event: React.MouseEvent<HTMLElement>, newFormat: string | null) => {
    if (newFormat) {
      setFormat(newFormat);
      onContentChange(content, newFormat);
    }
  }, [content, onContentChange]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <ToggleButtonGroup
        value={format}
        exclusive
        onChange={handleFormatChange}
        aria-label="content format"
        size="small"
      >
        <ToggleButton value="markdown">Markdown</ToggleButton>
        <ToggleButton value="json">JSON</ToggleButton>
        <ToggleButton value="xml">XML</ToggleButton>
      </ToggleButtonGroup>

      <TextField
        multiline
        rows={15}
        fullWidth
        placeholder={`Paste your ${format} content here...`}
        value={content}
        onChange={handleContentChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            fontFamily: 'Consolas, monospace',
            fontSize: '14px',
          },
        }}
      />
    </Box>
  );
};
