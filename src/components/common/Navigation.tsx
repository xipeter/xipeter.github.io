import { useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  useTheme,
  Menu,
  MenuItem
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
import LanguageIcon from '@mui/icons-material/Language';

const drawerWidth = 240;

interface NavigationProps {
  currentFormat: string;
  onFormatChange: (format: string) => void;
}

const formats = [
  { id: 'markdown', labelKey: 'nav.markdown', icon: <DescriptionIcon /> },
  { id: 'json', labelKey: 'nav.json', icon: <DataObjectIcon /> },
  { id: 'xml', labelKey: 'nav.xml', icon: <CodeIcon /> },
  { id: 'diff', labelKey: 'nav.diff', icon: <DifferenceIcon /> },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
];

export const Navigation = ({ currentFormat, onFormatChange }: NavigationProps): React.JSX.Element => {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLangAnchor(null);
  };

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    handleLanguageClose();
  };

  const drawer = (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100%' }}>
      <Toolbar>
        <MarkEmailReadIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" noWrap>
          {t('app.title')}
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
              <ListItemText primary={t(format.labelKey)} />
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
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t('app.title')}
          </Typography>
          
          {/* Language Switcher */}
          <IconButton
            color="inherit"
            onClick={handleLanguageOpen}
            title={t('nav.language')}
          >
            <LanguageIcon />
          </IconButton>
          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={handleLanguageClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {languages.map((lang) => (
              <MenuItem
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                selected={i18n.language === lang.code}
              >
                <Typography variant="body2" sx={{ mr: 1 }}>{lang.flag}</Typography>
                {lang.name}
              </MenuItem>
            ))}
          </Menu>
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
