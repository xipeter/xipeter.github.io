import { useCallback } from 'react';
import { useStores } from '../../hooks/useStores';
import * as Diff from 'diff';

// MUI
import { Box, TextField, Paper, Typography, Chip } from '@mui/material';

export const DiffViewer = (): React.JSX.Element => {
  const { appStore } = useStores();

  const handleOriginalChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    appStore.setContent(e.target.value);
  }, [appStore]);

  const handleModifiedChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    appStore.setDiffContent(e.target.value);
  }, [appStore]);

  const renderDiff = () => {
    if (!appStore.content && !appStore.diffContent) {
      return (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Enter content in both boxes to see the differences
        </Typography>
      );
    }

    const diff = Diff.diffLines(appStore.content, appStore.diffContent);

    return (
      <Box
        sx={{
          fontFamily: 'SF Mono, Consolas, monospace',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          bgcolor: '#1e1e1e',
          color: '#d4d4d4',
          p: 2,
          borderRadius: 1,
          minHeight: '300px',
        }}
      >
        {diff.map((part, index) => {
          const color = part.added ? '#4ec94e' : part.removed ? '#f14c4c' : '#d4d4d4';
          const bgcolor = part.added ? 'rgba(78, 201, 78, 0.15)' : part.removed ? 'rgba(241, 76, 76, 0.15)' : 'transparent';
          
          if (part.added) {
            return (
              <Box key={index} sx={{ bgcolor, display: 'flex' }}>
                <Chip label="+" size="small" sx={{ mr: 1, minWidth: 20, bgcolor: '#4ec94e', color: '#fff' }} />
                <span style={{ color }}>{part.value}</span>
              </Box>
            );
          }
          if (part.removed) {
            return (
              <Box key={index} sx={{ bgcolor, display: 'flex' }}>
                <Chip label="-" size="small" sx={{ mr: 1, minWidth: 20, bgcolor: '#f14c4c', color: '#fff' }} />
                <span style={{ color }}>{part.value}</span>
              </Box>
            );
          }
          return <span key={index} style={{ color }}>{part.value}</span>;
        })}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Input Section */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Original Content
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          placeholder="Paste original content here..."
          value={appStore.content}
          onChange={handleOriginalChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'SF Mono, Consolas, monospace',
              fontSize: '13px',
            },
          }}
        />
      </Paper>

      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Modified Content
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          placeholder="Paste modified content here..."
          value={appStore.diffContent}
          onChange={handleModifiedChange}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: 'SF Mono, Consolas, monospace',
              fontSize: '13px',
            },
          }}
        />
      </Paper>

      {/* Diff Result */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Differences
        </Typography>
        {renderDiff()}
      </Paper>
    </Box>
  );
};
