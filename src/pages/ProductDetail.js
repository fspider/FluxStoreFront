import { connect } from "react-redux";
import { insertToCart, fetchProductDetail, fetchProductVariants, setProductDetail } from "../actions";
import React, { Component } from "react";
import ProductList from '../components/ProductList';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import ShareIcon from '@material-ui/icons/Share';
import Button from '@material-ui/core/Button';
import PropTypes from "prop-types";
import StoreHolder from '../images/storeholder.png'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Box from '@material-ui/core/Box';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import FacebookIcon from '@material-ui/icons/Facebook';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";
import { withRouter } from "react-router";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

const myStyles = theme => ({
  root: {
    maxWidth: 600,
    margin: "auto",
  },  
  salePrice: {
    fontSize: "1.25rem",
    fontWeight: "bold"
  },
  regularPrice: {
    color: "#9e9e9e",
    fontSize: "16px",
    textDecoration: "line-through"
  },
  priceWrapper: {
    float: "left",
  },
  controls: {
    display: "flex",
    justifyContent: "flex-end",
  },
  variants: {
    marginTop: 10,
    display: "table",
    clear: "both",
  },
  vbutton: {
    margin: theme.spacing(1),
  },
})
const theme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
  },
});
const defaultProps = {
  bgcolor: 'background.paper',
  m: 1,
  border: 1,
  style: { width: '3rem', height: '29px', fontSize:"20px", textAlign: "center" },
};
class ProductDetail extends React.Component {  
  constructor(props) {
    super(props);
    const id = props.match.params.id;
    props.fetchProductDetail(id);
    this.state = {
      count: 0,
      productID: id,
      selectedVariant: null,
      isOpenDialog: false,
    }
  }
  componentDidMount() {

  }

  componentDidUpdate(prevProps) {    
    if (this.props.selectedProduct !== prevProps.selectedProduct)
    {
      this.setState({
        count: 0,
        selectedVariant: null,
      });
      this.props.fetchProductVariants(this.state.productID);
    }    
  }
  increase = () => {
    this.setState({
      count: this.state.count + 1
    });
  }

  decrease = () => {
    if (this.state.count <= 0)
      return;
    this.setState({
      count: this.state.count - 1
    });
  }

  changeProduct = (item) => {
    this.setState({
      selectedVariant: item
    })
  }

  renderVairants = () => {
    const classes = this.props.classes
    const { selectedProduct, selectedVariants } = this.props;
    if (!selectedVariants)
    {
      if (selectedProduct && selectedProduct.variations.length)
      {
        return (
          <div className={classes.variants}>
            {
              selectedProduct.variations.map((id) => { return (
                <Button key={id} variant={"outlined"} size="small" color="primary" className={classes.vbutton} disabled>
                  Loading...
                </Button>
                );
              })
            }
          </div>
        ) 
      }
      return null;
    }
    return (
      <div className={classes.variants}>
        {
          selectedVariants.map((item) => { return (
            <Button key={item.id} variant={this.state.selectedVariant && item.id == this.state.selectedVariant.id ? "contained" : "outlined"} size="small" color="primary" className={classes.vbutton} onClick={() => {this.changeProduct(item)}}>
              {item.attributes.map((attr) => attr.option + " ")}
            </Button>
            );
          })
        }
      </div>
    );
  }

  getVariantName = () => {
    const variant = this.state.selectedVariant;
    return variant.attributes.map((attr) => attr.option);
  }

  isAddCartButtonEnable = () => {
    const { selectedProduct, selectedVariants} = this.props;
    if (this.state.count <= 0)
      return true;
    if (selectedVariants && selectedVariants.length != 0 && !this.state.selectedVariant)
      return true;
    return false;
  }

  addToCart = () => {
    const { selectedProduct, selectedVariants} = this.props;
    if (this.isAddCartButtonEnable())
      return;
    if (this.state.selectedVariant)
    {
      const variant = this.state.selectedVariant;
      variant.name = selectedProduct.name;
      variant.parentid = selectedProduct.id;
      variant.images = selectedProduct.images;
      this.props.insertToCart(variant, this.state.count);
    }
    else
      this.props.insertToCart(selectedProduct, this.state.count);
    this.setState({
      isOpenDialog: true
    });
  }

  buyNow = () => {
    this.addToCart();
    this.props.history.push("/cart");
  }

  viewCart = () => {    
    this.props.history.push("/cart");
  }

  chatWithSeller = () => {
    const location = {
      pathname: '/chatoption',
      state: { fromDashboard: true }
    }
    this.props.history.push(location);
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

  handleCloseDialog = () => {
    this.setState({
      isOpenDialog: false
    });
  }

  goBack = () => {
    this.props.setProductDetail(null);
    this.props.history.goBack();
  }

  render() {
    const classes = this.props.classes
    const { selectedProduct, } = this.props;
    let displayProduct = {
      image: StoreHolder,
      title: "Loading ...",
      desc: "Loading...",
      sale_price: 0,
      regular_price: 0,
    };
    if (selectedProduct) {
      displayProduct.image = selectedProduct.images[0].src;
      displayProduct.title = selectedProduct.name;
      displayProduct.desc = selectedProduct.short_description;
      displayProduct.sale_price = this.state.selectedVariant ? this.state.selectedVariant.sale_price : selectedProduct.sale_price;
      displayProduct.regular_price = this.state.selectedVariant ? this.state.selectedVariant.regular_price : selectedProduct.regular_price;
      if (!displayProduct.sale_price) {
        displayProduct.sale_price = this.state.selectedVariant ? this.state.selectedVariant.price : selectedProduct.price;
        displayProduct.regular_price = "";
      }
      else if (!displayProduct.sale_price)
        displayProduct.sale_price = "?";
      else if (!displayProduct.regular_price)
        displayProduct.regular_price = "?";
    }
    return (
      <Card className={classes.root}>
          <CardHeader
            avatar={
              <IconButton aria-label="settings" onClick={this.goBack}>
                <ArrowBackIcon />
              </IconButton>
            }
            title={""}
            action={              
              <IconButton aria-label="share" onClick={() => {this.setState({isOpen: true})}}>
                <ShareIcon />
              </IconButton>
            }
          />
          <CardMedia
            component="img"
            alt={displayProduct.title}
            height="300px"
            image={displayProduct.image}
            title={displayProduct.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {displayProduct.title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              <div
              dangerouslySetInnerHTML={{
                __html: displayProduct.desc
              }}></div>
            </Typography>
            <hr/>
            <div>
              <div className={classes.priceWrapper}>
                {displayProduct.regular_price && <div className={classes.regularPrice}>RM {displayProduct.regular_price}</div>}
                <div className={classes.salePrice}>RM {displayProduct.sale_price}</div>
              </div>
              <div className={classes.controls}>
                <IconButton aria-label="Remove" onClick={this.decrease} disabled={this.state.count <= 0}>
                  <RemoveIcon/>
                </IconButton>
                <Box borderColor="error.main" {...defaultProps} >{this.state.count}</Box>
                <IconButton aria-label="Add" onClick={this.increase}>
                  <AddIcon/>
                </IconButton>
              </div>
            </div>
            {
              this.renderVairants()
            }
          </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            onClick={this.chatWithSeller}
            className={classes.button}
            startIcon={<WhatsAppIcon />}
          >
            Chat with seller
          </Button>
          <Button size="small" variant="outlined" color="secondary" disabled={this.isAddCartButtonEnable()} onClick={this.addToCart}>
            Add to Cart
          </Button>
          <Button size="small" variant="contained" color="secondary" disabled={this.isAddCartButtonEnable()} onClick={this.buyNow}>
            Buy Now
          </Button>
        </CardActions>
        <React.Fragment key={"bottom"}>
          <Drawer anchor={"bottom"} open={this.state.isOpen} onClose={() => this.setState({isOpen: false})}>            
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
        <Dialog
          fullWidth
          maxWidth="sm"
          open={this.state.isOpenDialog}
          onClose={this.handleCloseDialog}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogContent>
            <div style={{alignItems: "center", justifyContent: "center", display: "flex", marginBottom: 15}}>
              <AddShoppingCartIcon color="secondary" style={{ fontSize: 40 }} />
            </div>
            <DialogContentText align="center" variant="h5" style={{color: "black"}}>
            {this.state.count} x {displayProduct.title} {this.state.selectedVariant && `(${this.getVariantName()})`}
            </DialogContentText>
            <DialogContentText align="center">
              has been added to your cart
            </DialogContentText>

          </DialogContent>
          <DialogActions>
            <Button size="small" variant="contained" color="primary" onClick={this.handleCloseDialog}>
              Keep shopping
            </Button>
            <Button size="small" variant="outlined" color="primary" onClick={this.viewCart}>
              View Cart
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  }
}

ProductDetail.propTypes = {
  classes: PropTypes.object.isRequired
};




const mapStateToProps = (state) => ({
  mystore: state.mystore,
  selectedProduct: state.selectedProduct,
  selectedVariants: state.selectedVariants,
});

export default withRouter(withStyles(myStyles(theme))(
  connect(mapStateToProps, {
    fetchProductDetail,
    fetchProductVariants,
    insertToCart,
    setProductDetail,
  })(ProductDetail)
));