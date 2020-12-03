import Axios from 'axios'
import React from 'react'
import { Card, Container,Col,Row,Spinner, Button } from 'reactstrap'
import ClientNavBar from './ClientNavBar'
import ComonQuatityInput from './ComonQuatityInput'
import ImageComponent from './ImageComponent'
import '../../style/productDetail.scss'
import {connect} from 'react-redux'
 class ProductDetail extends React.Component {
    state = {
        quantyti:2,
        product_detail:[{
            id:null,
            name:"",
            image:[]
        }],
        loading:undefined,
    }
    handleChangeQuantyti =(data,operator = false)=>{
        if(operator) {
            return  this.setState({
                quantyti:this.state.quantyti + data
            })
        }
        this.setState({
            quantyti: data
        })
    }
    componentDidMount() {
        this.setState({
            loading:true
        })
        Axios.get(`https://shopping-api-with-jwt.herokuapp.com/products/${this.props.match.params.id}`).then(res=>{
            this.setState({
                product_detail:res.data,
                loading: false
            })
        })
        .catch(error=>{
            console.log(error)
        })
    }
    handleAddToCart = ()=>{
        this.props.addToCart({...this.state.product_detail,image:this.state.product_detail.image[0]},this.state.quantyti)
    }
    items = 'https://product.hstatic.net/1000351433/product/4a3c7686-0b83-4ab1-abff-de3d21a1758e_31d51d9c063940f09bddd0e5ac3475d3_grande.jpg';
    render (){
        const {name,price,image} = this.state.product_detail
        return (
            <>
                <ClientNavBar></ClientNavBar>
                {this.state.loading === false ? <Container>
                    <Row>
                        <Col md={3}>
                            <ImageComponent items={image}></ImageComponent>
                        </Col>
                        <Col md={9}>
                            <Card>
                                <h3>{name}</h3>
                                <h5 className="text-warning">{price} $</h5>
                                <ComonQuatityInput onChange={this.handleChangeQuantyti} value={this.state.quantyti}></ComonQuatityInput>
                                <Button color="dark" outline onClick={this.handleAddToCart}>Add to cart</Button>
                            </Card>
                        </Col>
                    </Row>
                </Container>
                :
                <div className="d-flex justify-content-center align-items-center loading"><Spinner color="secondary" /></div> }
           </>
        )
    }
}
const mapDispatchToProps = (dispatch) =>{
    return {
        addToCart: (product,quantyti)=>{
            dispatch({
                type:'Add_To_Cart',
                payload:{...product,quantyti},
            })
        }
    }
}
export default connect(null,mapDispatchToProps)(ProductDetail)