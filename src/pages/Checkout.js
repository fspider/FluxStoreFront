import { connect } from 'react-redux'
import {
  insertToCart,
  updateCartItem,
  removeCartItem,
  fetchProductDetail,
  fetchProductVariants,
  setCustomerData,
} from '../actions'
import React, { Component } from 'react'
import { green } from '@material-ui/core/colors'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import Divider from '@material-ui/core/Divider'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'

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


import { Redirect } from 'react-router-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/styles'
import { withRouter } from 'react-router-dom'

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
    marginTop: 10
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
    textAlign: 'right',
    marginTop: '20px'
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
class Checkout extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      redirect: null,
      name: "",
      phonenumber: "",
      productName: "",
      errorName: false,
      errorPhone: false,
    }
  }
  componentDidMount () {}

  setRedirect = to => {
    this.setState({
      redirect: to
    })
  }

  handleInputField = (e) => {
    const inputVal = e.target.value;
    if (e.target.name == "phonenumber")
    {
      if (inputVal && !inputVal.match(/^\d+$/))
        return;
    }
    this.setState({
      ...this.state,
      [e.target.name]: inputVal,
    })
  }

  renderRedirect = () => {
    if (this.state.redirect != null) {
      return <Redirect push={true} to={`/${this.state.redirect}`} />
    }
  }

  validate = () => {
    var v1 = true, v2 = true;
    if (this.state.name == "")
    {
      v1 = false;
    }
    if (this.state.phonenumber == "" || this.state.phonenumber.length < 11)
      v2 = false;
    this.setState({
      errorName: !v1,
      errorPhone: !v2
    });
    console.log(v1, v2);
    return v1 && v2;
  }

  checkout = () => {
    if ( !this.validate())
      return;
    this.props.setCustomerData(this.state.name, this.state.phonenumber);
    this.props.history.push("/review");
  }
  
  goBackPage = () => {
    this.props.history.goBack();
  }

  render () {
    const classes = this.props.classes
    const cart = this.props.cart
    return (
      <div>
        <div>          
          <IconButton aria-label="settings" onClick={this.goBackPage}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <WhatsAppIcon style={{ color: green[500], fontSize: 50 }} />
        </div>
        <Typography style={{ margin: 8, textAlign: 'center' }}>
          Checkout
        </Typography>
        <TextField
          error={this.state.errorName}
          helperText='This field is required'
          name='name'
          value={this.state.name}
          onChange={this.handleInputField}
          label='Name'
          variant='outlined'
          fullWidth
        />
        <TextField
          error={this.state.errorPhone}
          helperText='Phone Number is required'
          name='phonenumber'
          value={this.state.phonenumber}
          onChange={this.handleInputField}
          label='Phone number'
          variant='outlined'
          fullWidth
        />
        <Button
          variant='contained'
          color='secondary'
          fullWidth
          onClick={this.checkout}
        >
          Continue to payment
        </Button>
      </div>
    )
  }
}

Checkout.propTypes = {
  classes: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  mystore: state.mystore,
  selectedProduct: state.selectedProduct,
})

export default withRouter(
  withStyles(myStyles(theme))(connect(mapStateToProps, {setCustomerData})(Checkout))
)
