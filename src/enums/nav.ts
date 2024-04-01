import { RouterName } from "./router-name";

export const enum NavName {
  Home = "Home page",
  SongSheet = "song sheet",
  Singer = "singer",
  Personal = "Personal homepage",
  Setting = "setting",
  SignIn = "log on",
  SignUp = "register",
  SignOut = "exit",
}

// Left navigation bar
export const HEADERNAVLIST = [
  {
    name: NavName.Home,
    path: RouterName.Home,
  },
  {
    name: NavName.SongSheet,
    path: RouterName.SongSheet,
  },
  {
    name: NavName.Singer,
    path: RouterName.Singer,
  },
];

// Right navigation bar
export const SIGNLIST = [
  {
    name: NavName.SignIn,
    path: RouterName.SignIn,
  },
  {
    name: NavName.SignUp,
    path: RouterName.SignUp,
  },
];

// User dropdown menu items
export const MENULIST = [
  {
    name: NavName.Personal,
    path: RouterName.Personal,
  },
  {
    name: NavName.Setting,
    path: RouterName.Setting,
  },
  {
    name: NavName.SignOut,
    path: RouterName.SignOut,
  },
];
