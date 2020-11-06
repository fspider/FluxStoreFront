import React, {Component} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import ListSubheader from '@material-ui/core/ListSubheader'
import IconButton from '@material-ui/core/IconButton'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/styles";
import { setProductDetail, setProductVariations } from "../actions";
import { connect } from "react-redux";

const myStyles = (theme) => ({
  root: {
    display: 'flex',
    marginTop: 15,
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    minHeight: 1000,
    //backgroundColor: theme.palette.background.paper
  },
  gridList: {
    maxWidth: 600,
    width: "100%",
    height: "100%"
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)'
  },
  title: {
    textAlign: "left",
  },
  salePrice: {
    fontSize: "15px",
    fontWeight: "bold"
  },
  regularPrice: {
    textDecoration: "line-through"
  },
})

const theme = createMuiTheme({
  overrides: {
    // Style sheet name ⚛️
  },
});

class ProductList extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedID: null,
      width: 0,
      height: 0,
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }
  
  componentDidMount() {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight })
  }

  onTileTouch = (id, product) => {
    this.setState({
      selectedID: id
    });
    this.props.setProductDetail(product);
    this.props.setProductVariations(null);
  }

  renderRedirect = () => {
    if (this.state.selectedID) {
      return <Redirect push={true} to={`/product/${this.state.selectedID}`} />
    }
  }

  renderPrice (tile) {
    const classes = this.props.classes
    if (tile.type == "variable" || (tile.sale_price == ""))
      return <div><span className={classes.salePrice}>RM {tile.price}</span></div>
    return <div><span className={classes.salePrice}>RM {tile.sale_price}</span>&nbsp;<span className={classes.regularPrice}>RM {tile.regular_price}</span></div>
  }

  render () {
    const classes = this.props.classes
    const products = this.props.products ?? [];
    return (
      <div className={classes.root}>
        {this.renderRedirect()}
        <GridList cellHeight={this.state.height / 4} className={classes.gridList} spacing={25}>
          {products.length == 0 && <GridListTile key='Subheader' cols={2} style={{ height: 'auto' }}>
            <ListSubheader component='div' style={{textAlign: "center"}}>Empty Products</ListSubheader>
          </GridListTile>}
          {products.map(tile => (
            <GridListTile key={tile.id} onClick={(e) => this.onTileTouch(tile.id, tile)}>
              <img src={tile.images[0]["src"]} alt={tile.name} />
              <GridListTileBar
                className={classes.title}
                title={tile.name}
                subtitle={this.renderPrice(tile)}
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    )
  }
}

ProductList.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  mystore: state.mystore,
  selectedProduct: state.selectedProduct,
  selectedVariants: state.selectedVariants,
});


export default withStyles(myStyles(theme))(
  connect(mapStateToProps, {
    setProductDetail,
    setProductVariations
  })(ProductList)
);
