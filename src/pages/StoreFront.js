import { connect } from "react-redux";
import { fetchStoreProducts, fetchStoreInfo } from "../actions";
import React, { Component } from "react";
import ProductList from '../components/ProductList';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import ShareIcon from '@material-ui/icons/Share';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import StoreHolder from '../images/storeholder.png'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import FileCopyIcon from '@material-ui/icons/FileCopy';

const myStyles = theme => ({
  root: {
    maxWidth: 600,
    margin: "auto",
  },
  appWrapper: {
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
    position: "relative",
  },
  storeTitle: {
    display: "grid",
    right: "50%",
    transform: "translate(50%,0%)",
    position: "absolute",
  },
  storeName: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: 10,
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
    padding: theme.spacing(3),
  },
})
const theme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
  },
});

class StoreFont extends React.Component {  
  constructor() {
    super();
    this.state = {
      mobileOpen: false,
      keyword: "",
      serachResult: null,
      isBottomSheetOpen: false,
    }
  } 

  shareStore = () => {
    this.setState({isBottomSheetOpen: true})
  }

  onChangeKeyword = (e) => {
    this.setState({
      keyword: e.target.value
    });
    this.searchProduct(e.target.value);
  }

  searchProduct = (keyword) => {
    const products = this.props.products;
    let searchResult = [];
    if (keyword == "") {
      searchResult = null;
    } else {
      for(var item of products) {
        if (item.name && item.name.toLowerCase().indexOf(keyword.toLowerCase()) != -1)
          searchResult.push(item);
      }
    }
    this.setState({
      searchResult: searchResult
    });
  }

  shareWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?text=${window.location.href}`;
    window.location = url;
  }

  shareFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    window.location = url;
  }

  copyURL = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  render() {
    const classes = this.props.classes
    const products = this.props.products;
    const mystore = this.props.mystore;
    const searchResult = this.state.searchResult;
    return (
      <div className="App">
        <div className={classes.appWrapper}>
          <div className={classes.storeHeader}>
            <div className={classes.storeImage}></div>
            <div className={classes.storeTitle}>
              <div className={classes.storeName}>{(mystore && mystore.store_name) ?? "Loading..."}</div>
              <Button variant="contained" size="small" color="primary"
              onClick={this.shareStore}
              startIcon={<ShareIcon />}>
                Share
              </Button>
            </div>
          </div>          
          <TextField
            placeholder="Search products..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            className={classes.searchBar}
            value={this.state.keyword}
            onChange={this.onChangeKeyword}
          />
          <ProductList products={searchResult ? searchResult:products}></ProductList>
        </div>
        <React.Fragment key={"bottom"}>
          <Drawer anchor={"bottom"} open={this.state.isBottomSheetOpen} onClose={() => this.setState({isBottomSheetOpen: false})}>            
            <List>
              <ListSubheader>Share url by ( {window.location.href} )</ListSubheader>            
              <ListItem button onClick={this.shareWhatsapp}>
                <ListItemIcon>{<WhatsAppIcon style={{color: "green"}}/>}</ListItemIcon>
                <ListItemText primary="Whatsapp" />
              </ListItem>
              <ListItem button onClick={this.shareFacebook}>
                <ListItemIcon>{<FacebookIcon style={{color: "blue"}}/>}</ListItemIcon>
                <ListItemText primary="Facebook" />
              </ListItem>
              <ListItem button onClick={this.copyURL}>
                <ListItemIcon>{<FileCopyIcon/>}</ListItemIcon>
                <ListItemText primary="Copy Product Link" />
              </ListItem>
            </List>
          </Drawer>
        </React.Fragment>
      </div>
    );
  }
}

StoreFont.propTypes = {
  classes: PropTypes.object.isRequired,
};




const mapStateToProps = (state) => ({
  mystore: state.mystore,
  products: state.products,
  isLoadedStore: state.isLoadedStore,
  isLoadingData: state.isLoadingData,
});

export default withStyles(myStyles(theme))(
  connect(mapStateToProps, {
    fetchStoreInfo,
    fetchStoreProducts
  })(StoreFont)
);
