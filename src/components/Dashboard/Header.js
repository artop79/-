import React, { useState } from 'react';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  InputBase,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#fff',
  border: '1px solid #E8ECF1',
  '&:hover': {
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: 400,
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#919EAB',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    fontSize: '0.875rem',
    [theme.breakpoints.up('md')]: {
      width: '30ch',
    },
  },
}));

const HeaderToolbar = styled(Toolbar)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleUserMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      color="transparent" 
      elevation={0}
      sx={{ 
        borderBottom: '1px solid #E8ECF1',
        backgroundColor: '#fff',
        zIndex: 1100,
        marginLeft: '220px',
        width: 'calc(100% - 220px)',
      }}
    >
      <HeaderToolbar>
        <Typography
          variant="subtitle1"
          component="div"
          sx={{ 
            display: { xs: 'none', sm: 'block' },
            fontWeight: 600,
            letterSpacing: '-0.025em',
            color: (theme) => theme.palette.text.primary
          }}
        >
          Raplle
        </Typography>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search here..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ marginRight: 1 }}>
            <IconButton color="inherit" size="small" sx={{ backgroundColor: '#F6F8FA', width: 40, height: 40 }}>
              <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
                <NotificationsIcon sx={{ fontSize: 20, color: '#637381' }} />
              </Badge>
            </IconButton>
          </Box>

          <Box sx={{ marginRight: 1 }}>
            <IconButton color="inherit" size="small" sx={{ backgroundColor: '#F6F8FA', width: 40, height: 40 }}>
              <SettingsIcon sx={{ fontSize: 20, color: '#637381' }} />
            </IconButton>
          </Box>
          
          <Divider orientation="vertical" flexItem sx={{ height: 24, mx: 1 }} />

          <Box
            onClick={handleUserMenuClick}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              p: 0.5,
              borderRadius: 1,
              '&:hover': { backgroundColor: '#F6F8FA' }
            }}
          >
            <Avatar
              sx={{ 
                width: 36, 
                height: 36, 
                backgroundColor: '#36B37E',
                fontSize: '0.9rem',
                fontWeight: 500
              }}
            >
              J
            </Avatar>
            <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.2 }}>
                John Doe
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
                Admin
              </Typography>
            </Box>
            <ExpandMoreIcon sx={{ ml: 0.5, color: 'text.secondary', fontSize: 18 }} />
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                mt: 1.5,
                borderRadius: 2,
                minWidth: 180,
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1,
                  fontSize: '0.875rem',
                },
              },
            }}
          >
            <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleUserMenuClose}>Account Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </HeaderToolbar>
    </AppBar>
  );
};

export default Header;
