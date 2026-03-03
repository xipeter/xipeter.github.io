// 1. React/core
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

// 2. MobX (none needed)

// 3. External libraries (none needed)

// 4. Internal modules (none needed)

// MUI
import { Paper, Box } from '@mui/material';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview = ({ content }: MarkdownPreviewProps): React.JSX.Element => {
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
      }}
    >
      <Box 
        component="div"
        sx={{ 
          '& pre': { margin: 0 },
          '& code': { fontFamily: 'SF Mono, Consolas, monospace' }
        }}
      >
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match;
              return isInline ? (
                <code 
                  {...props} 
                  style={{ 
                    backgroundColor: '#f0f0f0', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontFamily: 'SF Mono, Consolas, monospace',
                    fontSize: '0.9em',
                  }}
                >
                  {children}
                </code>
              ) : (
                <SyntaxHighlighter
                  style={oneLight}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </Box>
    </Paper>
  );
};
