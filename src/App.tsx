import { useState, useCallback } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Chip,
  Button
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import { Navigation, drawerWidth } from './components/common/Navigation';
import { ContentInput } from './components/common/ContentInput';
import { MarkdownPreview, JsonPreview, XmlPreview } from './components/preview';

const App = (): React.JSX.Element => {
  const [content, setContent] = useState('');
  const [format, setFormat] = useState<string>('markdown');
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  const handleContentChange = useCallback((newContent: string, newFormat: string) => {
    setContent(newContent);
    setFormat(newFormat);
  }, []);

  const handleFormatChange = useCallback((newFormat: string) => {
    setFormat(newFormat);
    if (content) {
      handleContentChange(content, newFormat);
    }
  }, [content, handleContentChange]);

  const handleClear = useCallback(() => {
    setContent('');
    setMode('edit');
  }, []);

  const renderPreview = () => {
    if (!content) return null;

    switch (format) {
      case 'markdown':
        return <MarkdownPreview content={content} />;
      case 'json':
        return <JsonPreview content={content} />;
      case 'xml':
        return <XmlPreview content={content} />;
      default:
        return (
          <Paper sx={{ p: 3, bgcolor: '#1e1e1e', color: '#d4d4d4' }}>
            <Typography>Unsupported format</Typography>
          </Paper>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#121212' }}>
      <Navigation currentFormat={format} onFormatChange={handleFormatChange} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          mt: '64px'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" color="white">
              {mode === 'edit' ? 'Editor' : 'Preview'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                label={format.toUpperCase()} 
                color="primary"
                size="small"
                sx={{ mr: 1 }}
              />
              {content && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={mode === 'edit' ? <PreviewIcon /> : <EditIcon />}
                    onClick={() => setMode(mode === 'edit' ? 'preview' : 'edit')}
                    size="small"
                  >
                    {mode === 'edit' ? 'Preview' : 'Edit'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={handleClear}
                    size="small"
                  >
                    Clear
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {mode === 'edit' ? (
            <ContentInput onContentChange={handleContentChange} />
          ) : (
            renderPreview()
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default App;
