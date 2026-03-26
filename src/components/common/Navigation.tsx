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
  Typography,
  Toolbar,
  useMediaQuery,
  useTheme,
  Divider,
  Chip
} from '@mui/material';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DifferenceIcon from '@mui/icons-material/Difference';
import InfoIcon from '@mui/icons-material/Info';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PolicyIcon from '@mui/icons-material/Policy';

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawer = (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100%' }}>
      <Toolbar>
        <MarkEmailReadIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography 
          variant="h6" 
          noWrap 
          component="a" 
          href="/" 
          sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 700,
            '&:hover': { color: 'primary.main' }
          }}
        >
          TechHub
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton
            href="/about"
          >
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            href="/contact"
          >
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              <ContactPageIcon />
            </ListItemIcon>
            <ListItemText primary="Contact" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            href="/privacy-policy"
          >
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              <PrivacyTipIcon />
            </ListItemIcon>
            <ListItemText primary="Privacy Policy" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            href="/terms"
          >
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              <PolicyIcon />
            </ListItemIcon>
            <ListItemText primary="Terms" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          {t('nav.language')}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {languages.map((lang) => (
            <Chip
              key={lang.code}
              label={lang.flag}
              size="small"
              onClick={() => handleLanguageChange(lang.code)}
              variant={i18n.language === lang.code ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
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
