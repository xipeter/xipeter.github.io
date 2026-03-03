import { Paper } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface XmlPreviewProps {
  content: string;
}

export const XmlPreview = ({ content }: XmlPreviewProps): React.JSX.Element => {
  // Simple XML formatting
  const formattedXml = content
    .replace(/></g, '>\n<')
    .replace(/^/gm, '  ')
    .trim();

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        bgcolor: '#1e1e1e', 
        color: '#d4d4d4',
        minHeight: '400px',
        borderRadius: 2,
        overflow: 'auto'
      }}
    >
      <SyntaxHighlighter
        style={oneDark}
        language="xml"
        PreTag="div"
        customStyle={{ margin: 0, background: 'transparent' }}
      >
        {formattedXml}
      </SyntaxHighlighter>
    </Paper>
  );
};
