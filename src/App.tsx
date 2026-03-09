import { observer } from 'mobx-react-lite';
import { useStores } from './hooks/useStores';
import { useTranslation } from 'react-i18next';

// 1. React/core
import { useCallback, useState, useEffect } from 'react';

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
  Button,
  Link
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';

const App = observer((): React.JSX.Element => {
  const { appStore } = useStores();
  const { t } = useTranslation();
  const [cookieConsent, setCookieConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent) {
      setCookieConsent(true);
    }
  }, []);

  const handleAcceptCookies = useCallback(() => {
    localStorage.setItem('cookieConsent', 'accepted');
    setCookieConsent(true);
  }, []);

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

  const getTitle = () => {
    if (appStore.format === 'diff') return t('nav.diff');
    return appStore.mode === 'edit' ? t('editor') : t('preview');
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {!cookieConsent && (
        <Paper
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 9999,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider'
          }}
          elevation={3}
        >
          <Typography variant="body2" color="text.secondary">
            This website uses cookies and Google AdSense to deliver a better user experience. By continuing to use this site, you agree to our use of cookies. 
            <Link href="/privacy-policy.html" sx={{ ml: 1 }}>Learn more</Link>
          </Typography>
          <Button variant="contained" size="small" onClick={handleAcceptCookies} sx={{ ml: 2 }}>
            Got it
          </Button>
        </Paper>
      )}
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
              {getTitle()}
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
                    {appStore.mode === 'edit' ? t('preview') : t('editor')}
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
                  {t('clear')}
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

          <Box
            component="footer"
            sx={{
              mt: 6,
              pt: 3,
              pb: 2,
              borderTop: 1,
              borderColor: 'divider',
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <Link href="/about.html" sx={{ mr: 2 }}>About</Link>
              <Link href="/contact.html" sx={{ mr: 2 }}>Contact</Link>
              <Link href="/privacy-policy.html">Privacy Policy</Link>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              © 2026. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
});

export default App;
