// 1. React/core (none needed)

// 2. MobX (none needed)

// 3. External libraries
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 4. Internal modules (none needed)

// MUI
import { Paper } from '@mui/material';

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
        language="json"
        PreTag="div"
        customStyle={{ margin: 0, background: 'transparent' }}
      >
        {formattedJson}
      </SyntaxHighlighter>
    </Paper>
  );
};
