import { connect } from "react-redux";
import { insertToCart, fetchProductDetail, fetchProductVariants } from "../actions";
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
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { Redirect } from "react-router-dom";
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
import { green } from '@material-ui/core/colors';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

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
  whatsappbutton: {
    color: "white",
    background: "#00c853",
    fontSize: 10,
    padding: "2px 5px",
    '&:hover': {
      backgroundColor: '#00c853',
    },
  },
  tableProducts: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableSummaryWrapper: {
    marginTop: 10,
    marginBottom: 10,
    //display: "flex",
    //justifyContent: "flex-end",
  },
  tableSummary: {
    width: "100%",
  },
  billTo: {
    fontWeight: "bold",
    marginTop: 15,
  },
  shopName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  couponLink: {    
    textTransform: "none",
    fontSize: 12,
  },
  tableCell: {
    fontSize:12,
    padding: 10
  },  
  tableCellS: {
    fontSize:14,
    padding: 10
  },
  shoppingButton: {
    padding: "5px 8px",
    fontSize: 12,
  }
})

const theme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
  },
});

class ReviewOrder extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      isOpenDialog: false,
      coupon: "",
      appliedcoupon: "",
    }
  }
  componentDidMount() {

  }

  continueShopping = () => {
    this.props.history.push("/");
  }

  chatWithSeller = () => {
    const { mystore } = this.props;
    const url = `https://api.whatsapp.com/send?phone=${mystore.phone}`;
    window.location = url;
  }

  payNow = () => {
    this.props.history.push("/pay");
  }

  applyCoupon = () => {
    this.setState({
      appliedcoupon: this.state.coupon,
      isOpenDialog: false
    });
  }

  handleCloseDialog = () => {
    this.setState({
      isOpenDialog: false
    });
  }

  handleOpenDialog = () => {
    this.setState({
      isOpenDialog: true
    });
  }

  handleInputField = (e) => {
    const inputVal = e.target.value;

    this.setState({
      ...this.state,
      [e.target.name]: inputVal,
    })
  }

  render() {
    const classes = this.props.classes
    const { mystore, customer } = this.props;
    const { cart } = this.props;

    let shopitems = [];
    let subtotal = 0;
    let tax = 0;
    let total = 0;
    let amountpaid = 0;

    if (cart) {
      for (let id in cart.cartitems) {
        let item = cart.cartitems[id].item;
        let price = item.sale_price ? item.sale_price : item.price;
        let attributeName = "";

        for(var i = 0; i < item.attributes.length; i ++) {
          if (i == 0)
            attributeName = "(";
          attributeName += item.attributes[i].name + ":" + item.attributes[i].option;
          if (i == item.attributes.length - 1)      
            attributeName += ")";
          else 
            attributeName += ", ";
        }
        shopitems.push({
          desc: `${item.name} ${attributeName} x ${cart.cartitems[id].count}`,
          price: price,
          total: parseFloat(price * cart.cartitems[id].count).toFixed(2)
        })
        subtotal += price * cart.cartitems[id].count;
      }
    }
    subtotal = parseFloat(subtotal).toFixed(2);
    total = parseFloat(subtotal + (subtotal * tax / 100)).toFixed(2);

    return (
      <Card className={classes.root}>
          <CardHeader
            avatar={
              <IconButton aria-label="settings" onClick={() => {this.props.history.goBack()}}>
                <ArrowBackIcon />
              </IconButton>
            }
            title={"Order Form #0"}
          />
          <CardContent>
            <div style={{ display: "flex", justifyContent: "center", alignContent: "center", marginBottom:10}}>
              <CheckCircleIcon color="primary" style={{fontSize: 28}}/>
            </div>
            <Typography gutterBottom component="p" align="center">
              Dear {customer ? customer.name : "..."},
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" align="center">            
              This is your Order Details
            </Typography>            
            <hr/>
            <Typography className={classes.shopName}>
              {mystore ? mystore.store_name : "..."}
            </Typography>
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={this.chatWithSeller}
              className={classes.whatsappbutton}
              startIcon={<WhatsAppIcon />}
            >
              Whatsapp Us
            </Button>
            <Typography variant="body2" component="p" className={classes.billTo}>
              Bill to:
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" style={{fontSize: 12}}>
              {customer ? customer.name : "..."}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" style={{fontSize: 12}}>
              {customer ? customer.phone : "..."}
            </Typography>
            <TableContainer className={classes.tableProducts} component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{fontWeight: "bold"}}>Description</TableCell>
                    <TableCell style={{fontWeight: "bold"}} align="right">Price</TableCell>
                    <TableCell style={{fontWeight: "bold"}} align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shopitems.map((row) => (
                    <TableRow key={row.desc}>
                      <TableCell className={classes.tableCell} component="th" scope="row">
                        {row.desc}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="right">{row.price}</TableCell>
                      <TableCell className={classes.tableCell} align="right">{row.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div style={{ display: "flex", justifyContent: "center", alignContent: "center", marginBottom:10}}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.continueShopping}
                className={classes.shoppingButton}
                endIcon={<ArrowForwardIcon/>}
              >
              Continue shopping
              </Button>
            </div>
            <div className={classes.tableSummaryWrapper}>
              <TableContainer className={classes.tableSummary} component={Paper}>
                <Table aria-label="customized table">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row" className={classes.tableCellS}>                       
                        Subtotal:
                      </TableCell>
                      <TableCell align="right" className={classes.tableCellS}>RM {subtotal}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" className={classes.tableCellS}>                       
                        Tax:
                      </TableCell>
                      <TableCell align="right" className={classes.tableCellS}>{tax}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" className={classes.tableCellS}  style={{fontWeight: "bold"}}>                       
                        Total:
                      </TableCell>
                      <TableCell align="right" className={classes.tableCellS} style={{fontWeight: "bold"}}>RM {total}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" className={classes.tableCellS}>                       
                        Amount Paid:
                      </TableCell>
                      <TableCell align="right" className={classes.tableCellS}>RM {amountpaid}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" className={classes.tableCellS}>                       
                        Coupon code:
                      </TableCell>
                      <TableCell align="right" className={classes.tableCellS}>{this.state.appliedcoupon ? this.state.appliedcoupon : <Button color="primary" className={classes.couponLink} onClick={this.handleOpenDialog}>Select Coupon</Button>}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <Typography align="center" component="p" style={{fontSize: 12}}>
            Check all details before proceeding to Payment
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              className={classes.button}
              onClick={this.payNow}
            >
            Pay Now
            </Button>
          </CardContent>
        <Dialog
          fullWidth
          maxWidth="sm"
          open={this.state.isOpenDialog}
          onClose={this.handleCloseDialog}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Coupon Code</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Enter code"
              type="text"
              value={this.state.coupon}
              name="coupon"
              onChange={this.handleInputField}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button size="small" variant="contained" onClick={this.handleCloseDialog}>
              Close
            </Button>
            <Button size="small" variant="contained" color="secondary" disabled={this.state.coupon == ""} onClick={this.applyCoupon}>
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    );
  }
}

ReviewOrder.propTypes = {
  classes: PropTypes.object.isRequired
};




const mapStateToProps = (state) => ({
  mystore: state.mystore,
  cart: state.cart,
  customer: state.customer
});

export default withRouter(withStyles(myStyles(theme))(
  connect(mapStateToProps, {
  })(ReviewOrder)
));