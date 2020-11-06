import logo from './logo.svg';
import './App.css';
import { connect } from "react-redux";
import { fetchStoreProducts, fetchStoreInfo, loadCart } from "./actions";
import React, { Component } from "react";
import ProductList from './components/ProductList';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import ShareIcon from '@material-ui/icons/Share';
import Button from '@material-ui/core/Button';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from "prop-types";
import StoreHolder from './images/storeholder.png'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";
import { makeStyles } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import HomeIcon from '@material-ui/icons/Home';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StoreFront from './pages/StoreFront';
import ProductDetail from './pages/ProductDetail';
import ChatOption from './pages/ChatOption';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import ReviewOrder from './pages/ReviewOrder';
import PayOrder from './pages/PayOrder';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Badge from '@material-ui/core/Badge';
import { Redirect } from "react-router-dom";

const myStyles = theme => ({
  root: {
    maxWidth: 600,
    margin: "auto",
  },
  appBar: {
    display: "flex",
    alignItems: "center"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  storeHeader: {
    display: "flex",
    padding: "4px 10px",
    maxWidth: 600,
    marginBottom: 15,
  },
  storeTitle: {
    display: "grid"
  },
  storeImage: {
    width: 70,
    height: 70,    
    borderRadius: "50%",
    backgroundSize: "cover",
    backgroundImage: `url(${StoreHolder})`,
    backgroundPosition: "center center",
    marginRight: 20,
  },  
  searchBar: {
    width: "100%",
    maxWidth: 600
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
})
const theme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
  },
});

class App extends React.Component {  
  constructor() {
    super();
    this.state = {
      mobileOpen: false,
      redirectCart: false,
      redirectHome: false,
      redirectChat: false,
    }
  }
  componentDidMount() {
    if (this.props.isLoadedStore == false)
    {
      console.log("Start Fetching store");
      this.props.fetchStoreInfo();
    }    
    if (this.props.cart == null)
      this.props.loadCart();
  }

  componentDidUpdate(prevProps) {    
    if (this.props.mystore !== prevProps.mystore)
    {
      console.log("Start Fetching products", this.props.mystore);
      this.props.fetchStoreProducts(this.props.mystore.id);
    }    
  }

  handleDrawerToggle = () => {
    this.setState({
      mobileOpen: !this.state.mobileOpen
    });
  }

  drawer = (classes) => (
    <div>
      <div className={classes.toolbar} />
      <Divider />  
      <ListItem button key="Home" onClick={() => {this.setState({redirectHome: true})}}>
        <ListItemIcon><HomeIcon /></ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>    
      <ListItem button key="Contact Seller" onClick={() => {this.setState({redirectChat: true})}}>
        <ListItemIcon><WhatsAppIcon /></ListItemIcon>
        <ListItemText primary="Contact Seller" />
      </ListItem>    
    </div>
  )

  renderRedirectToCart = () => {
    if (this.state.redirectCart) {
      this.setState({redirectCart: false})
      return <Redirect to={`/cart`} push={true}/>
    }
  }

  renderRedirectToHome = () => {
    if (this.state.redirectHome) {
      this.setState({redirectHome: false})
      return <Redirect to={`/`} push={true}/>
    }
  }

  renderRedirectToChat = () => {
    if (this.state.redirectChat) {
      this.setState({redirectChat: false})
      return <Redirect to={`/chatoption`} push={true}/>
    }
  }

  render() {
    const classes = this.props.classes
    const isLoadingData = this.props.isLoadingData
    const { cart } = this.props;
    return (
      <div className={classes.root}> 
        <Backdrop className={classes.backdrop} open={isLoadingData}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar style={{width: "100%", maxWidth: 600}}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={this.handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap style={{flexGrow: 1}}>
              
            </Typography>
            <div className={classes.sectionDesktop}>
              <IconButton aria-label="show 4 new mails" color="inherit" aria-label="account of current user"
                aria-controls="menu-appbar">
                <Badge badgeContent={cart ? cart.itemCount : 0} color="secondary" onClick={() => {this.setState({redirectCart: true})}}>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>              
            </div>
          </Toolbar>
        </AppBar>
        <nav className={classes.drawer} aria-label="Navigation">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={theme.direction === 'rtl' ? 'right' : 'left'}
              open={this.state.mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {this.drawer(classes)}
            </Drawer>
          </Hidden>
        </nav>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Router>
            {this.renderRedirectToCart()}
            {this.renderRedirectToHome()}
            {this.renderRedirectToChat()}
            <div>             
              <Switch>
                <Route exact path="/">
                  <StoreFront></StoreFront>
                </Route>                
                <Route exact path="/cart">
                  <Cart></Cart>
                </Route>
                <Route path="/product/:id" children={<ProductDetail />} />
                <Route path="/chatoption" children={<ChatOption />} />
                <Route path="/checkout" children={<Checkout />} />
                <Route path="/review" children={<ReviewOrder />} />
                <Route path="/pay" children={<PayOrder />} />
              </Switch>
            </div>
          </Router>
        </main>       
      </div>
    );
  }
}


App.propTypes = {
  classes: PropTypes.object.isRequired,
};




const mapStateToProps = (state) => ({
  mystore: state.mystore,
  products: state.products,
  isLoadingData: state.isLoadingData,
  isLoadedStore: state.isLoadedStore,
  cart: state.cart,
});

export default withStyles(myStyles(theme))(
  connect(mapStateToProps, {
    fetchStoreInfo,
    fetchStoreProducts,
    loadCart,
  })(App)
);
