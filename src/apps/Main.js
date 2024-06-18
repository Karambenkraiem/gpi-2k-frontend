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
import { FaArrowsDownToPeople, FaArrowsTurnToDots, FaComputer } from "react-icons/fa6";
import { Link, Outlet } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { HomeOutlined, PeopleOutline, StorageOutlined, ExpandLess, ExpandMore } from "@mui/icons-material";
import { BsBuildingGear, BsBuildings, BsCardList } from "react-icons/bs";
import { SiNginxproxymanager } from "react-icons/si";

const drawerWidth = 280;

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
})(({ theme, open }) => ({
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
  { label: "Utilisateurs", path: "/utilisateurs", icon: <PeopleOutline /> },
  {
    label: "Ressources materielles",
    icon: <SiNginxproxymanager />,
    items: [
      { label: "Materiels", path: "/materiel", icon: <FaComputer /> },
      { label: "Affectation", path: "/affectation", icon: <FaArrowsDownToPeople /> },
      { label: "Emprunt", path: "/emprunt", icon: <FaArrowsTurnToDots /> },
    ]
  },
  {
    label: "Management",
    icon: <BsBuildingGear />,
    items: [
      { label: "Spécialités", path: "/specialite", icon: <BsCardList /> },
      { label: "Départements", path: "/departement", icon: <BsBuildings /> },
    ]
  }
];

export default function Main() {

  const theme = useTheme();
<<<<<<< HEAD
  const [open, setOpen] = React.useState(true); // changé en true Par Karam pour faire le side bar ouvert par defaut 
  const [managementOpen, setManagementOpen] = React.useState(false);
  const [operationsOpen, setOperationsOpen] = React.useState(false);
=======
  const [open, setOpen] = React.useState(false);
  const [submenuOpen, setSubmenuOpen] = React.useState({});
>>>>>>> 7489b1a4d275ad23128de5befd54a697dc5af86b

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleSubmenuToggle = (label) => {
    setSubmenuOpen((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleOperationsClick = () => {
    setOperationsOpen(!operationsOpen);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
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
            <Link component={RouterLink} to="/" underline="none" style={{ color: 'hsl(150, 100%, 50%)' }}>
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
                      sx={{minHeight: 48,justifyContent: open ? "initial" : "center", px: 2.5,
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
<<<<<<< HEAD
                  <ListItem disablePadding sx={{ display: "block" }} onClick={elem.label === "Management" ? handleManagementClick : handleOperationsClick}>
=======
                  <ListItem disablePadding sx={{ display: "block" }} onClick={() => handleSubmenuToggle(elem.label)}>
>>>>>>> 7489b1a4d275ad23128de5befd54a697dc5af86b
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
<<<<<<< HEAD
                      {elem.label === "Management" ? (managementOpen ? <ExpandLess /> : <ExpandMore />) : (operationsOpen ? <ExpandLess /> : <ExpandMore />)}
                    </ListItemButton>
                  </ListItem>
                  {(elem.label === "Management" && managementOpen && elem.items) || (elem.label === "Opérations" && operationsOpen && elem.items) ? elem.items.map((subItem) => (
=======
                      {submenuOpen[elem.label] ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  {submenuOpen[elem.label] && elem.items && elem.items.map((subItem) => (
>>>>>>> 7489b1a4d275ad23128de5befd54a697dc5af86b
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
                  )) : null}
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
