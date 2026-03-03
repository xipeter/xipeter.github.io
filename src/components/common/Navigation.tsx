import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const drawerWidth = 240;

interface NavigationProps {
  currentFormat: string;
  onFormatChange: (format: string) => void;
}

const formats = [
  { id: 'markdown', label: 'Markdown', icon: <DescriptionIcon /> },
  { id: 'json', label: 'JSON', icon: <DataObjectIcon /> },
  { id: 'xml', label: 'XML', icon: <CodeIcon /> },
];

export const Navigation = ({ currentFormat, onFormatChange }: NavigationProps): React.JSX.Element => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ bgcolor: '#1e1e1e', minHeight: '100%' }}>
      <Toolbar>
        <MarkEmailReadIcon sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap>
          Previewer
        </Typography>
      </Toolbar>
      <List>
        {formats.map((format) => (
          <ListItem key={format.id} disablePadding>
            <ListItemButton
              selected={currentFormat === format.id}
              onClick={() => {
                onFormatChange(format.id);
                if (isMobile) setMobileOpen(false);
              }}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(144, 202, 249, 0.16)',
                  '&:hover': {
                    bgcolor: 'rgba(144, 202, 249, 0.24)',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: currentFormat === format.id ? '#90caf9' : 'inherit' }}>
                {format.icon}
              </ListItemIcon>
              <ListItemText primary={format.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: '#1e1e1e',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Content Previewer
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid rgba(255,255,255,0.12)',
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export { drawerWidth };
