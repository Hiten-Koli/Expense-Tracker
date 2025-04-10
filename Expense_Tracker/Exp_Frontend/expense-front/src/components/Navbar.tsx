import { AppBar, Toolbar, Typography, Button, Box, IconButton,} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { logout } from "../redux/slice/authSlice";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; 
  
const Navbar = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { token } = useAppSelector((state) => state.auth);
  
    const handleLogout = () => {
      dispatch(logout());
      navigate("/login");
    };
  
    return (
      <AppBar position="static" color="primary">
        <Toolbar>
          <IconButton edge="start" color="inherit" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component={RouterLink} to="/" color="inherit" sx={{ textDecoration: 'none', flexGrow: 1 }}>
            Expense Tracker
          </Typography>
  
          {token ? (
            <>
              <Button color="inherit" component={RouterLink} to="/incomes">
                Incomes
              </Button>
              <Button color="inherit" component={RouterLink} to="/expenses">
                Expenses
              </Button>
              <Button color="inherit" component={RouterLink} to="/budgets">
                Budgets
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    );
};
  
export default Navbar;
  