// 1. React/core (none needed)

// 2. MobX (none needed)

// 3. External libraries
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 4. Internal modules (none needed)

// MUI
import { Paper } from '@mui/material';

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
        bgcolor: '#fafafa',
        color: '#1d1d1f',
        minHeight: '400px',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'auto'
      }}
    >
      <SyntaxHighlighter
        style={oneLight}
        language="xml"
        PreTag="div"
        customStyle={{ margin: 0, background: 'transparent' }}
      >
        {formattedXml}
      </SyntaxHighlighter>
    </Paper>
  );
};
