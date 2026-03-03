import { Paper } from '@mui/material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface JsonPreviewProps {
  content: string;
}

export const JsonPreview = ({ content }: JsonPreviewProps): React.JSX.Element => {
  let formattedJson = content;

  try {
    const parsed = JSON.parse(content);
    formattedJson = JSON.stringify(parsed, null, 2);
  } catch {
    // If parsing fails, show raw content
  }

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
        language="json"
        PreTag="div"
        customStyle={{ margin: 0, background: 'transparent' }}
      >
        {formattedJson}
      </SyntaxHighlighter>
    </Paper>
  );
};
