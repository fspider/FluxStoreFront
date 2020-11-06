import { connect } from 'react-redux'
import {
  insertToCart,
  updateCartItem,
  removeCartItem,
  fetchProductDetail,
  fetchProductVariants
} from '../actions'
import React, { Component } from 'react'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'

import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import StoreHolder from '../images/storeholder.png'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import Box from '@material-ui/core/Box'
import WhatsAppIcon from '@material-ui/icons/WhatsApp'
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';

import { Redirect } from 'react-router-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/styles'
import { withRouter } from 'react-router'

const myStyles = theme => ({
  root: {
    maxWidth: 600,
    margin: 'auto'
  },
  price: {
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  regularPrice: {
    color: '#9e9e9e',
    fontSize: '16px',
    textDecoration: 'line-through'
  },
  deleteButton: {
    float: 'left',
    marginTop: 10,
  },
  controls: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  variants: {
    marginTop: 10,
    display: 'table',
    clear: 'both'
  },
  vbutton: {
    margin: theme.spacing(1)
  },
  totalPrice: {
    fontSize: 20,
    textAlign: "right",
    marginTop: "20px",
  }
})
const theme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
  }
})
const defaultProps = {
  bgcolor: 'background.paper',
  m: 1,
  border: 1,
  style: {
    width: '3rem',
    height: '29px',
    fontSize: '20px',
    textAlign: 'center'
  }
}
class Cart extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      redirect: null,
      count: {},
      selectedVariant: null
    }
  }
  componentDidMount () {}

  setRedirect = to => {
    this.setState({
      redirect: to
    })
  }

  renderRedirect = () => {
    if (this.state.redirect != null) {
      this.setState({
        redirect: null
      });
      return <Redirect push={true} to={`/${this.state.redirect}`} />
    }
  }

  increase = (item) => {
    this.props.updateCartItem(item.item.id, item.count + 1);
  }

  decrease = (item) => {
    if (item.count <= 0) return
    
    this.props.updateCartItem(item.item.id, item.count - 1);
  }

  removeItem = (item) => {
    this.props.removeCartItem(item.item.id);
  }

  checkout = () => {
    this.props.history.push("/checkout");
  }

  renderCartItem = (item) => {
    const classes = this.props.classes
    let attributeName = "";

    for(var i = 0; i < item.item.attributes.length; i ++) {
      if (i == 0)
        attributeName = "(";
      attributeName += item.item.attributes[i].name + ":" + item.item.attributes[i].option;
      if (i == item.item.attributes.length - 1)      
        attributeName += ")";
      else 
        attributeName += ", ";
    }

    return (
        <div key={item.item.name} >
          <ListItem alignItems='flex-start'>
            <ListItemAvatar>
              <Avatar alt='Remy Sharp' src={item.item.images ? item.item.images[0].src: '/static/images/avatar/1.jpg'} />
            </ListItemAvatar>
            <ListItemText
              primary={item.item.name +  " " + attributeName}
              secondary={
                <React.Fragment>
                  <Typography
                    component='span'
                    variant='body2'
                    className={classes.price}
                    color='textPrimary'
                  >
                    RM {item.item.price}
                  </Typography>
                  <div>
                      <Button size="small" variant="outlined" color="secondary"className={classes.deleteButton} onClick={() => this.removeItem(item)}>
                          Delete
                      </Button>
                      <div className={classes.controls}>
                          <IconButton aria-label="Remove" onClick={() => this.decrease(item)} disabled={item.count <= 0}>
                            <RemoveIcon/>
                          </IconButton>
                          <Box borderColor="error.main" {...defaultProps} >{item.count}</Box>
                          <IconButton aria-label="Add" onClick={() => this.increase(item)}>
                            <AddIcon/>
                          </IconButton>
                      </div>      
                  </div>                  
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant='inset' component='li' />
        </div>
    )
  }

  goBackPage = () => {
    this.props.history.goBack();
  }

  renderEmptyPage () {
    return (
      <div>
        <div style={{textAlign: "center"}}>
          <RemoveShoppingCartIcon style={{fontSize: 40}}/>
        </div>
        <div style={{textAlign: "center", marginTop: 10}}>
          Cart is empty
        </div>
      </div>
    )
  }

  render () {
    const classes = this.props.classes
    const cart = this.props.cart;
    return (
      <div>        
        <div>          
          <IconButton aria-label="settings" onClick={this.goBackPage}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        {!cart || cart.itemCount == 0 ? this.renderEmptyPage() : 
        <div>
          <List className={classes.root}>
            {cart && Object.keys(cart.cartitems).map((elt) => this.renderCartItem(cart.cartitems[elt]))}        
          </List>
          <div className={classes.totalPrice}>
            Total: RM {cart && cart.totalPrice()}
          </div>
          <Button fullWidth variant="contained" color="secondary" className={classes.deleteButton} onClick={() => this.checkout()}>
              Proceed to Checkout
          </Button>
        </div>}
      </div>
    )
  }
}

Cart.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  mystore: state.mystore,
  cart: state.cart
})

export default withRouter(
  withStyles(myStyles(theme))(
    connect(mapStateToProps, {
      fetchProductDetail,
      fetchProductVariants,
      insertToCart,
      updateCartItem,
      removeCartItem,
    })(Cart)
  )
)
