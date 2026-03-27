import { observer } from 'mobx-react-lite';
import { useStores } from '../../hooks/useStores';
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

const uiStrings: Record<string, Record<string, string>> = {
  en: {
    title: 'Content Previewer',
    editor: 'Editor',
    preview: 'Preview',
    copy: 'Copy',
    copied: 'Copied!',
    clear: 'Clear',
    showPreview: 'Show Preview',
    switchToPreview: 'Switch to Preview mode to see the result',
    diffComparison: 'Diff Comparison',
    whatEachFormatDoes: 'What Each Format Does',
    markdownDesc: 'Preview rendered Markdown with syntax-highlighted code blocks. Great for documentation, notes, and README files.',
    jsonDesc: 'Validate and pretty-print JSON. Spot syntax errors instantly and explore nested data structures.',
    xmlDesc: 'Parse and validate XML documents. Check well-formedness and view hierarchical structure.',
    diffDesc: 'Compare two versions of text side-by-side. Highlight additions, deletions, and changes with color-coded diffs.',
    privacyNote: 'Privacy Note',
    privacyText: 'All processing happens locally in your browser. Your content is never sent to any server, stored, or logged. When you refresh the page, your data is cleared automatically.',
    tipsTitle: 'Tips for Effective Previewing',
    tip1: 'Use the format toggle to switch between Markdown, JSON, XML, and Diff modes',
    tip2: 'Click "Copy" to copy the raw content to your clipboard',
    tip3: 'Switch between Edit and Preview modes to see how your content will render',
    tip4: 'For large files, the preview updates in real-time as you type',
    placeholder: 'Enter your content here...',
  },
  zh: {
    title: '内容预览器',
    editor: '编辑器',
    preview: '预览',
    copy: '复制',
    copied: '已复制！',
    clear: '清除',
    showPreview: '显示预览',
    switchToPreview: '切换到预览模式查看结果',
    diffComparison: 'Diff 比较',
    whatEachFormatDoes: '各格式功能说明',
    markdownDesc: '预览渲染后的 Markdown，带语法高亮代码块。适合文档、笔记和 README 文件。',
    jsonDesc: '验证和美化 JSON。即时发现语法错误，浏览嵌套数据结构。',
    xmlDesc: '解析和验证 XML 文档。检查格式是否正确，查看层次结构。',
    diffDesc: '并排比较两个版本的文本。用颜色编码高亮显示添加、删除和更改。',
    privacyNote: '隐私声明',
    privacyText: '所有处理都在您的浏览器中本地进行。您的内容不会发送到任何服务器、存储或记录。刷新页面时数据自动清除。',
    tipsTitle: '有效预览的技巧',
    tip1: '使用格式切换在 Markdown、JSON、XML 和 Diff 模式之间切换',
    tip2: '点击"复制"将原始内容复制到剪贴板',
    tip3: '在编辑和预览模式之间切换，查看内容渲染效果',
    tip4: '对于大文件，预览会在您输入时实时更新',
    placeholder: '在此输入内容...',
  }
};

interface ToolWorkspaceProps {
  locale?: string;
}

export const ToolWorkspace = observer(({ locale = 'en' }: ToolWorkspaceProps): React.JSX.Element => {
  const { appStore } = useStores();
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);
  const s = uiStrings[locale] || uiStrings.en;

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
              {s.title}
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
                  {s.editor}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopy}
                    color={copied ? 'success' : 'inherit'}
                  >
                    {copied ? s.copied : s.copy}
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={handleClear}
                  >
                    {s.clear}
                  </Button>
                </Box>
              </Box>
              <TextField
                multiline
                fullWidth
                minRows={15}
                maxRows={25}
                placeholder={s.placeholder}
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
                  {appStore.format === 'diff' ? s.diffComparison : s.preview}
                </Typography>
                {appStore.format !== 'diff' && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={appStore.mode === 'edit' ? <PreviewIcon /> : <EditIcon />}
                    onClick={handleModeChange}
                  >
                    {appStore.mode === 'edit' ? s.preview : s.editor}
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
                  {s.switchToPreview}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<PreviewIcon />}
                  onClick={handleModeChange}
                >
                  {s.showPreview}
                </Button>
              </Box>
            </Paper>
          )}
        </Box>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            {s.whatEachFormatDoes}
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mb: 3 }}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Markdown</Typography>
              <Typography variant="body2" color="text.secondary">{s.markdownDesc}</Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>JSON</Typography>
              <Typography variant="body2" color="text.secondary">{s.jsonDesc}</Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>XML</Typography>
              <Typography variant="body2" color="text.secondary">{s.xmlDesc}</Typography>
            </Paper>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Diff</Typography>
              <Typography variant="body2" color="text.secondary">{s.diffDesc}</Typography>
            </Paper>
          </Box>

          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{s.privacyNote}</Typography>
            <Typography variant="body2" color="text.secondary">
              {s.privacyText}
            </Typography>
          </Paper>

          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{s.tipsTitle}</Typography>
            <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
              <li><Typography variant="body2">{s.tip1}</Typography></li>
              <li><Typography variant="body2">{s.tip2}</Typography></li>
              <li><Typography variant="body2">{s.tip3}</Typography></li>
              <li><Typography variant="body2">{s.tip4}</Typography></li>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
});
