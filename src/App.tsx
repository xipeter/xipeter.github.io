import { observer } from 'mobx-react-lite';
import { useStores } from './hooks/useStores';
import { useTranslation } from 'react-i18next';

// 1. React/core
import { useCallback, useState, useEffect, useRef } from 'react';

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
  Link,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const App = observer((): React.JSX.Element => {
  const { appStore } = useStores();
  const { t } = useTranslation();
  const [cookieConsent, setCookieConsent] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

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

  const handleCopy = useCallback(() => {
    if (appStore.content) {
      navigator.clipboard.writeText(appStore.content);
      setCopied(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [appStore.content]);

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

  const renderWelcome = () => (
    <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, mb: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        Content Previewer
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 800 }}>
        A free online tool to preview and validate Markdown, JSON, and XML content. 
        Compare differences between two versions with the built-in diff viewer. 
        Perfect for developers, technical writers, and anyone working with structured content.
      </Typography>
      
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>What you can do with this tool:</Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Markdown Preview</Typography>
              <Typography variant="body2" color="text.secondary">
                Preview Markdown with syntax highlighting for code blocks. See how headings, lists, links, and formatting will render in real-time.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>JSON Preview</Typography>
              <Typography variant="body2" color="text.secondary">
                Validate and format JSON with pretty printing. Quickly spot syntax errors and see the structure of your data.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>XML Preview</Typography>
              <Typography variant="body2" color="text.secondary">
                Parse and validate XML documents. Check well-formedness and view the hierarchical structure.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Diff Comparison</Typography>
              <Typography variant="body2" color="text.secondary">
                Compare two versions of text side-by-side. Highlight additions, deletions, and changes with color-coded diffs.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>How to use:</Typography>
      <Box component="ol" sx={{ pl: 2, color: 'text.secondary' }}>
        <li><Typography variant="body2" sx={{ mb: 1 }}>Select a format from the sidebar (Markdown, JSON, XML, or Diff)</Typography></li>
        <li><Typography variant="body2" sx={{ mb: 1 }}>Enter or paste your content in the editor</Typography></li>
        <li><Typography variant="body2" sx={{ mb: 1 }}>Click "Preview" to see how your content will render</Typography></li>
        <li><Typography variant="body2" sx={{ mb: 1 }}>Use "Copy" to copy the content to your clipboard</Typography></li>
        <li><Typography variant="body2">Use "Clear" to reset and start fresh</Typography></li>
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          <strong>Tip:</strong> Select a format from the sidebar to get started. The editor supports syntax highlighting and will validate your content as you type.
        </Typography>
      </Box>
    </Paper>
  );

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
          width: { md: `calc(100% - ${drawerWidth}px)` }
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
              <Button
                variant="outlined"
                startIcon={appStore.mode === 'edit' ? <PreviewIcon /> : <EditIcon />}
                onClick={() => appStore.setMode(appStore.mode === 'edit' ? 'preview' : 'edit')}
                size="small"
                disabled={!appStore.hasContent && appStore.format !== 'diff'}
              >
                {appStore.mode === 'edit' ? t('preview') : t('editor')}
              </Button>
              {appStore.mode === 'preview' && appStore.hasContent && (
                <Button
                  variant="outlined"
                  startIcon={copied ? null : <ContentCopyIcon />}
                  onClick={handleCopy}
                  size="small"
                  color={copied ? 'success' : 'primary'}
                >
                  {copied ? t('copied') || 'Copied!' : t('copy') || 'Copy'}
                </Button>
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
          ) : (
            <>
              {!appStore.hasContent && (
                <Box sx={{ mb: 3 }}>{renderWelcome()}</Box>
              )}
              {appStore.mode === 'edit' ? (
                <ContentInput onContentChange={handleContentChange} />
              ) : (
                renderPreview()
              )}
            </>
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
              <Link href="/faq.html" sx={{ mr: 2 }}>FAQ</Link>
              <Link href="/terms-of-service.html" sx={{ mr: 2 }}>Terms of Service</Link>
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
