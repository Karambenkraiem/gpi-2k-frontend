import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link as RouterLink } from 'react-router-dom';
import { Link, Outlet } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { HomeOutlined, PeopleOutline, ExpandLess, ExpandMore } from "@mui/icons-material";
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import MultipleStopIcon from '@mui/icons-material/MultipleStop';
import TextRotationNoneIcon from '@mui/icons-material/TextRotationNone';
import RoomPreferencesIcon from '@mui/icons-material/RoomPreferences';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import InventoryIcon from '@mui/icons-material/Inventory';
import AppsIcon from '@mui/icons-material/Apps';
import BusinessIcon from '@mui/icons-material/Business';
import ComputerIcon from '@mui/icons-material/Computer';

const drawerWidth = 300;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
// @ts-ignore
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})
// @ts-ignore
(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const initialNavItems = [
  { label: "Accueil", path: "/", icon: <HomeOutlined /> },
  {
    label: "Gestion des utilisateurs",
    icon: <RoomPreferencesIcon />,
    items: [
      { label: "Utilisateurs", path: "/utilisateurs", icon: <PeopleOutline /> },
      { label: "Départements", path: "/departement", icon: <DomainAddIcon /> },
      { label: "Spécialités", path: "/specialite", icon: <ListAltIcon /> },
    ]
  },
  {
    label: "Ressources materielles",
    icon: <ComputerIcon />,
    items: [
      { label: "Materiels", path: "/materiel", icon: <DesktopWindowsIcon /> },
      { label: "Affectation", path: "/affectation", icon: <TextRotationNoneIcon /> },
      { label: "Emprunt", path: "/emprunt", icon: <MultipleStopIcon /> },
    ]
  },
  {label: "Gestion du stock", path:"/stocks", icon:<InventoryIcon/>},
  {label: "Ressources logicielles", path:"/logiciels", icon:<AppsIcon/>},
  {label: "Societés et Fournisseurs", path:"/societes", icon:<BusinessIcon/>},
];

export default function Main() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [submenuOpen, setSubmenuOpen] = React.useState({});

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSubmenuToggle = (label) => {
    setSubmenuOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" 
// @ts-ignore
      open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            <Link 
// @ts-ignore
            component={RouterLink} to="/" underline="none" style={{ color: 'hsl(150, 100%, 50%)' }}>
              GPI-2K-IsetRades-TECI
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {initialNavItems.map((elem) => (
            <React.Fragment key={elem.label}>
              {elem.path ? (
                <Nav.Link as={Link} to={elem.path}>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {elem.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={elem.label}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Nav.Link>
              ) : (
                <>
                  <ListItem disablePadding sx={{ display: "block" }} onClick={() => handleSubmenuToggle(elem.label)}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        {elem.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={elem.label}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {submenuOpen[elem.label] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  {submenuOpen[elem.label] && elem.items && elem.items.map((subItem) => (
                    <Nav.Link as={Link} to={subItem.path} key={subItem.label}>
                      <ListItem disablePadding sx={{ display: "block", pl: 4 }}>
                        <ListItemButton
                          sx={{
                            minHeight: 48,
                            justifyContent: open ? "initial" : "center",
                            px: 2.5,
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 3 : "auto",
                              justifyContent: "center",
                            }}
                          >
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.label}
                            sx={{ opacity: open ? 1 : 0 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </Nav.Link>
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}