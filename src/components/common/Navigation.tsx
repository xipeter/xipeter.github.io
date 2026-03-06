import { useState } from 'react';

// 1. React/core
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

// 2. MobX (none needed)

// 3. External libraries (none needed)

// 4. Internal modules (none needed)

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DifferenceIcon from '@mui/icons-material/Difference';

const drawerWidth = 240;

interface NavigationProps {
  currentFormat: string;
  onFormatChange: (format: string) => void;
}

const formats = [
  { id: 'markdown', label: 'Markdown', icon: <DescriptionIcon /> },
  { id: 'json', label: 'JSON', icon: <DataObjectIcon /> },
  { id: 'xml', label: 'XML', icon: <CodeIcon /> },
  { id: 'diff', label: 'Diff', icon: <DifferenceIcon /> },
];

export const Navigation = ({ currentFormat, onFormatChange }: NavigationProps): React.JSX.Element => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100%' }}>
      <Toolbar>
        <MarkEmailReadIcon sx={{ mr: 1, color: 'primary.main' }} />
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
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: currentFormat === format.id ? 'inherit' : 'text.secondary' }}>
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
