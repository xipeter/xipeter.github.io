// 1. React/core
import { useCallback } from 'react';

// 2. MobX (none needed)

// 3. External libraries (none needed)

// 4. Internal modules
import { useStores } from '../../hooks/useStores';
import type { FormatType } from '../../stores/AppStore';

// MUI
import { Box, TextField, ToggleButton, ToggleButtonGroup, Paper } from '@mui/material';

interface ContentInputProps {
  onContentChange: (content: string, type: string) => void;
}

export const ContentInput = ({ onContentChange }: ContentInputProps): React.JSX.Element => {
  const { appStore } = useStores();

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    appStore.setContent(value);
    onContentChange(value, appStore.format);
  }, [appStore, onContentChange]);

  const handleFormatChange = useCallback((_event: React.MouseEvent<HTMLElement>, newFormat: string | null) => {
    if (newFormat) {
      appStore.setFormat(newFormat as FormatType);
      onContentChange(appStore.content, newFormat);
    }
  }, [appStore, onContentChange]);

  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ToggleButtonGroup
          value={appStore.format}
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
          placeholder={`Paste your ${appStore.format} content here...`}
          value={appStore.content}
          onChange={handleContentChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'SF Mono, Consolas, monospace',
              fontSize: '14px',
              bgcolor: '#fafafa',
            },
          }}
        />
      </Box>
    </Paper>
  );
};
