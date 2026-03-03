import { Box, Paper } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview = ({ content }: MarkdownPreviewProps): React.JSX.Element => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 3, 
        bgcolor: '#1e1e1e', 
        color: '#d4d4d4',
        minHeight: '400px',
        borderRadius: 2
      }}
    >
      <Box 
        component="div"
        sx={{ 
          '& pre': { margin: 0 },
          '& code': { fontFamily: 'Consolas, monospace' }
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
                    backgroundColor: '#2d2d2d', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontFamily: 'Consolas, monospace'
                  }}
                >
                  {children}
                </code>
              ) : (
                <SyntaxHighlighter
                  style={oneDark}
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
