import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { 
  Box, 
  Container, 
  Typography, 
  AppBar, 
  Toolbar, 
  Paper,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionIcon from '@mui/icons-material/Description';
import { useStores } from './hooks/useStores';
import { FileUploader } from './components/common/FileUploader';
import { MarkdownPreview, JsonPreview, XmlPreview } from './components/preview';

const App = observer(() => {
  const { fileStore } = useStores();

  const handleFileSelect = useCallback((content: string, fileName: string, mimeType: string) => {
    fileStore.setFile(content, fileName, mimeType);
  }, [fileStore]);

  const handleClear = useCallback(() => {
    fileStore.clearFile();
  }, [fileStore]);

  const renderPreview = () => {
    if (!fileStore.currentFile) return null;

    const { content, type } = fileStore.currentFile;

    switch (type) {
      case 'markdown':
        return <MarkdownPreview content={content} />;
      case 'json':
        return <JsonPreview content={content} />;
      case 'xml':
        return <XmlPreview content={content} />;
      default:
        return (
          <Paper sx={{ p: 3, bgcolor: '#1e1e1e', color: '#d4d4d4' }}>
            <Typography>Unsupported file type</Typography>
          </Paper>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#121212' }}>
      <AppBar position="static" sx={{ bgcolor: '#1e1e1e' }}>
        <Toolbar>
          <DescriptionIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            File Previewer
          </Typography>
          {fileStore.currentFile && (
            <Chip 
              label={fileStore.currentFile.name} 
              onDelete={handleClear}
              deleteIcon={<DeleteIcon />}
              color="primary"
              variant="outlined"
            />
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {!fileStore.currentFile ? (
          <FileUploader onFileSelect={handleFileSelect} />
        ) : (
          <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" color="white">
                {fileStore.currentFile.name}
              </Typography>
              <Chip 
                label={fileStore.currentFile.type.toUpperCase()} 
                color="secondary"
                size="small"
              />
            </Box>
            {renderPreview()}
          </Box>
        )}
      </Container>
    </Box>
  );
});

export default App;
