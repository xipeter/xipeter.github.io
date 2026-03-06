import { observer } from 'mobx-react-lite';
import { useStores } from './hooks/useStores';

// 1. React/core
import { useCallback } from 'react';

// 2. MobX (already imported above)

// 3. External libraries (none needed)

// 4. Internal modules
import { Navigation, drawerWidth } from './components/common/Navigation';
import { ContentInput } from './components/common/ContentInput';
import { MarkdownPreview, JsonPreview, XmlPreview, DiffViewer } from './components/preview';

// 5. Types
import type { FormatType } from './stores/AppStore';

// MUI
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

const App = observer((): React.JSX.Element => {
  const { appStore } = useStores();

  const handleContentChange = useCallback((newContent: string, newFormat: string) => {
    appStore.setContent(newContent);
    appStore.setFormat(newFormat as FormatType);
  }, [appStore]);

  const handleFormatChange = useCallback((newFormat: string) => {
    appStore.setFormat(newFormat as FormatType);
    if (appStore.content) {
      handleContentChange(appStore.content, newFormat);
    }
  }, [appStore, handleContentChange]);

  const handleClear = useCallback(() => {
    appStore.clear();
  }, [appStore]);

  const renderPreview = () => {
    // Diff mode has its own input UI
    if (appStore.format === 'diff') {
      return <DiffViewer />;
    }

    if (!appStore.content) return null;

    switch (appStore.format) {
      case 'markdown':
        return <MarkdownPreview content={appStore.content} />;
      case 'json':
        return <JsonPreview content={appStore.content} />;
      case 'xml':
        return <XmlPreview content={appStore.content} />;
      default:
        return (
          <Paper sx={{ p: 3 }}>
            <Typography>Unsupported format</Typography>
          </Paper>
        );
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navigation 
        currentFormat={appStore.format} 
        onFormatChange={handleFormatChange} 
      />
      
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
            <Typography variant="h5" color="text.primary">
              {appStore.format === 'diff' ? 'Diff Viewer' : appStore.mode === 'edit' ? 'Editor' : 'Preview'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                label={appStore.format.toUpperCase()} 
                color="primary"
                size="small"
                sx={{ mr: 1 }}
              />
              {appStore.hasContent && appStore.format !== 'diff' && (
                <>
                  <Button
                    variant="outlined"
                    startIcon={appStore.mode === 'edit' ? <PreviewIcon /> : <EditIcon />}
                    onClick={() => appStore.setMode(appStore.mode === 'edit' ? 'preview' : 'edit')}
                    size="small"
                  >
                    {appStore.mode === 'edit' ? 'Preview' : 'Edit'}
                  </Button>
                </>
              )}
              {(appStore.hasContent || appStore.format === 'diff') && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleClear}
                  size="small"
                >
                  Clear
                </Button>
              )}
            </Box>
          </Box>

          {appStore.format === 'diff' ? (
            <DiffViewer />
          ) : appStore.mode === 'edit' ? (
            <ContentInput onContentChange={handleContentChange} />
          ) : (
            renderPreview()
          )}
        </Container>
      </Box>
    </Box>
  );
});

export default App;
