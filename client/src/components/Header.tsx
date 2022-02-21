import { Link } from "react-router-dom";
import "./Header.scss"
import React, { useEffect, useState } from "react";
import { config } from "../config"
import { useSelector, useDispatch } from "react-redux";
import { UPDATE_PROFILE, AUTH_SIGN_OUT, AUTH_ERROR } from '../redux/reducers/types'
import { ExitToApp, ThreeDRotation } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import Sidebar from "./SideBar/SideBar"

import {
  Collapse,
  Navbar,
  Button,
  Nav,
  UncontrolledPopover, PopoverHeader, PopoverBody
} from 'reactstrap'
import { withTranslation } from "react-i18next";
import "../services/i18n";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Avatar from '@material-ui/core/Avatar';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);



const PopoverContent = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <PopoverHeader>NOKIA {config.AppName} WEB APPLICATION {config.appVersion}</PopoverHeader>
      <PopoverBody>
        LATEST UPDATES:
      </PopoverBody>
    </>
  );
}

export const Header = () => {
  const user = useSelector((state) => ({ auth: state.auth }));
  const [auth, setAuth] = React.useState(true);
  const classes = useStyles();
  const [state, setState] = useState();
  // const [token, setToken] = useState(null);
  const [pic, setPic] = useState();

  const { t, i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorElMenu(null);
  };


  const handleClickMenu = (event) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };

  const StyledMenu = withStyles({
    paper: {
      border: '1px solid #d3d4d5',
    },
  })((props) => (
    <Menu
      elevation={0}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      {...props}
    />
  ));

  const StyledMenuItem = withStyles((theme) => ({
    root: {
      '&:focus': {
        backgroundColor: theme.palette.primary.main,
        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
          color: theme.palette.common.white,
        },
      },
    },
  }))(MenuItem);


  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const dispatch = useDispatch()

  useEffect(() => {
    login ()
  }, [])

   // gets login details
   function login() {
    fetch(config.baseURL + config.baseLOCATION + "/auth/login/success/", {
      method: "GET",
      // body: JSON.stringify({ start: performance.now() }),
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": true,
        // "Access-Control-Allow-Origin":true
      }
    })
      .then(response => {
        if (response.status) return response.json();
        // if (response.status === 401) return response.json()
    })
      .then(responseJson => {
        console.log('here',responseJson);
        if(responseJson.success === true) {
          getIcon(responseJson.user.token)
        sessionStorage.setItem('exp', responseJson.user.exp);
        sessionStorage.setItem('token_refresh', responseJson.user.token_refresh);
        sessionStorage.setItem('userEmail', responseJson.user.email);
        sessionStorage.setItem('upalu', responseJson.user.upalu);
        sessionStorage.setItem('userName', responseJson.user.userName);
        sessionStorage.setItem('name', responseJson.user.first_name);
        sessionStorage.setItem('token', responseJson.user.token);
        sessionStorage.setItem('roles', responseJson.user.roles);

        dispatch({
          type: UPDATE_PROFILE,
          payload: {
            role: responseJson.user.roles,
            userName: responseJson.user.userName,
            name: responseJson.user.first_name,
            email: responseJson.user.email,
            upalu: responseJson.user.upalu,
            token: responseJson.user.token
          }
      }
      );
      setState({
        authenticated: true,
        user: responseJson.user
      });
    }
    else 
    {
      setState({
        authenticated: false,
        error: "Failed to authenticate user"
      });
    }
  }
    
      )
      .catch(err => {
        setState({
          authenticated: false,
          error: "Failed to authenticate user"
        });
        console.log(err);
        _handleLogoutClick();
      });
  }

  const getIcon = (token) => {
    console.log(token)
    fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
      method: "GET",
      // credentials: "include",
      headers: {
        Authorization: token,
      }
    })
      .then(response => {
        if (response.status === 200) return response;
        throw new Error("failed to retrieve user pic");
      })
      .then(response => response.blob())
      .then(blob => setPic(URL.createObjectURL(blob)))
      .catch(error => {
        // setState({
        //   // authenticated: false,
        //   error: "Failed to authenticate user"
        // });
        console.log(error)
      });
  }

  const _handleSignInClick = () => {
    // Authenticate using via passport api in the backend
    // Open Twitter login page
    // Upon successful login, a cookie session will be stored in the client
    window.open(config.baseURL + config.baseLOCATION + "/auth/azure", "_self");
  };

  const _handleLogoutClick = () => {
    // Logout using Twitter passport api
    // Set authenticated state to false in the HomePage
    window.open(config.baseURL + config.baseLOCATION + "/auth/logout", "_self");
    sessionStorage.removeItem('exp')
    sessionStorage.removeItem('userEmail')
    sessionStorage.removeItem('name')
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('roles')
    // props.handleNotAuthenticated();
  };
  const _handleNotAuthenticated = () => {
    setState({ authenticated: false });
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
    
        <Toolbar>
        <Sidebar />
          <Typography variant="h6" className={classes.title}>
            <Link className="navbar-brand text-white" to={config.baseLOCATION + "/"}>
              <b>NOKIA</b> {config.AppName} {user.auth.type === 'student' ? <div className="header-title"> {t("navbar.students")} </div> : null}
            </Link >
          </Typography>
          {(state && state.authenticated) ? (
            <div className="avatar">
              {/* {pic ? */}
                <div className='icon'>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    className="icon"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <Avatar alt="avatar Sharp"
                      // className={classes.small}
                      src={pic} /> <div className='avatar-name'>{state.user.first_name}</div>
                  </IconButton>
                </div>
                {/* : <div> <Avatar alt="avatar Sharp"
                // className={classes.small}
                src={pic} /></div>} */}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={_handleLogoutClick}><span title="log out"><ExitToApp /> Log out</span></MenuItem>
              </Menu>

            </div>
          ) : (<div><Button variant="contained" color="primary" onClick={_handleSignInClick}><span title="log in">Login</span></Button></div>)}
        </Toolbar>
      </AppBar>
    </div>

  );
}
