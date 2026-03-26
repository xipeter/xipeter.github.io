import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks/useStores';
import { useTranslation } from 'react-i18next';
import { useCallback, useState, useEffect, useRef } from 'react';
import { MarkdownPreview, JsonPreview, XmlPreview, DiffViewer } from '../preview';
import type { FormatType } from '../../stores/AppStore';
import { 
  Box, 
  Container, 
  Typography, 
  Paper,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import DifferenceIcon from '@mui/icons-material/Difference';

export const ToolWorkspace = observer((): React.JSX.Element => {
  const { appStore } = useStores();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(appStore.content);
      setCopied(true);
      copyTimeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [appStore.content]);

  const handleClear = useCallback(() => {
    appStore.setContent('');
  }, [appStore]);

  const handleFormatChange = useCallback((_event: React.MouseEvent<HTMLElement>, newFormat: string | null) => {
    if (newFormat) {
      appStore.setFormat(newFormat as FormatType);
    }
  }, [appStore]);

  const handleModeChange = useCallback(() => {
    appStore.setMode(appStore.mode === 'edit' ? 'preview' : 'edit');
  }, [appStore]);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    appStore.setContent(e.target.value);
  }, [appStore]);

  const renderPreview = () => {
    switch (appStore.format) {
      case 'markdown':
        return <MarkdownPreview content={appStore.content} />;
      case 'json':
        return <JsonPreview content={appStore.content} />;
      case 'xml':
        return <XmlPreview content={appStore.content} />;
      case 'diff':
        return <DiffViewer content={appStore.content} />;
      default:
        return <MarkdownPreview content={appStore.content} />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3 }}>
      <Container maxWidth="xl">
        <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Content Previewer
            </Typography>
            <ToggleButtonGroup
              value={appStore.format}
              exclusive
              onChange={handleFormatChange}
              size="small"
            >
              <ToggleButton value="markdown">
                <DescriptionIcon sx={{ mr: 0.5, fontSize: 18 }} /> Markdown
              </ToggleButton>
              <ToggleButton value="json">
                <DataObjectIcon sx={{ mr: 0.5, fontSize: 18 }} /> JSON
              </ToggleButton>
              <ToggleButton value="xml">
                <CodeIcon sx={{ mr: 0.5, fontSize: 18 }} /> XML
              </ToggleButton>
              <ToggleButton value="diff">
                <DifferenceIcon sx={{ mr: 0.5, fontSize: 18 }} /> Diff
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: appStore.format === 'diff' ? 'column' : 'row' } }}>
          {appStore.format !== 'diff' && (
            <Paper elevation={0} sx={{ flex: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider', p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Editor
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopy}
                    color={copied ? 'success' : 'inherit'}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                minRows={15}
                maxRows={25}
                placeholder="Enter your content here..."
                value={appStore.content}
                onChange={handleContentChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'SF Mono, Consolas, monospace',
                    fontSize: '14px',
                  },
                }}
              />
            </Paper>
          )}

          {((appStore.format !== 'diff' && appStore.mode === 'preview') || appStore.format === 'diff') && (
            <Paper elevation={0} sx={{ flex: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider', p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {appStore.format === 'diff' ? 'Diff Comparison' : 'Preview'}
                </Typography>
                {appStore.format !== 'diff' && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={appStore.mode === 'edit' ? <PreviewIcon /> : <EditIcon />}
                    onClick={handleModeChange}
                  >
                    {appStore.mode === 'edit' ? 'Preview' : 'Edit'}
                  </Button>
                )}
              </Box>
              {renderPreview()}
            </Paper>
          )}

          {appStore.format !== 'diff' && appStore.mode === 'edit' && (
            <Paper elevation={0} sx={{ flex: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  Switch to Preview mode to see the result
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PreviewIcon />}
                  onClick={handleModeChange}
                >
                  Show Preview
                </Button>
              </Box>
            </Paper>
          )}
        </Box>
      </Container>
    </Box>
  );
});