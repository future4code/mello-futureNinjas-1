import React, { Component } from 'react'
import { ProductCard } from './ProductCard'
import styled from 'styled-components'
import { Filters } from '../Filters/Filters'
import { CircularProgress, Collapse, Typography, FormControlLabel, FormGroup, Checkbox } from '@material-ui/core'
import {ExpandMore, ExpandLess} from '@material-ui/icons'

const ProductGridContainer = styled.div`
    background: #f5f3fc;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-flow: auto;
    padding: 16px;
    gap: 16px;
    height: auto;
`
const SortingHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f5f3fc;
`

const Center=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
`

export class ProductGrid extends Component {
  state = {
    showFilters: false,
    icon: true,
    list: true,
    lowPrice: false,
    highPrice: false,
    name: false,
    inputNameValue: '',
    inputDescValue: '',
    filters: {
        valMin: null,
        valMax: null
    }
  }


  onClickFilter = () => {
    this.setState({
      showFilters: !this.state.showFilters,
    })
  }

  handleFilterTextValue = (event) => {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  handleSort = (event) => {
    this.setState({
      [event.target.name]: event.target.checked
    })
  }

  handleFilterNumberValue = (updatedValue) => {
    this.setState({
      filters: {
        ...this.state.filters,
        ...updatedValue
      }
    })
  }

  sortOffers = (offerOne, offerTwo) => {
    

    if(this.state.lowPrice) {
        return offerOne.value - offerTwo.value
    } else if ( this.state.highPrice) {
        return offerTwo.value - offerOne.value
    } else if(this.state.name){
        const offerOneTitle = offerOne.title
        const offerTwoTitle = offerTwo.title
        
        return offerOneTitle.localeCompare(offerTwoTitle)
    }
}

getFilteredProducts () {

    const { inputNameValue, inputDescValue, filters } = this.state

    let filteredOffers = this.props.handleOffers
    .filter(offer => {
      return offer.value < (filters.valMax || Infinity)
    })
    .filter(offer => {
      return offer.value > (filters.valMin || 0)
    })
    .filter(offer => {
      const title = offer.title.toLowerCase()
      return title.indexOf(inputNameValue.toLowerCase()) > -1
    })
    .filter(offer => {
      const desc = offer.description.toLowerCase()
      return desc.indexOf(inputDescValue.toLowerCase()) > -1
    })
    return filteredOffers
}

  render() {

    const filteredOffers = this.getFilteredProducts()
    const sortProducts = filteredOffers.sort(this.sortOffers)
    const disabledA = this.state.highPrice || this.state.name ? true: false
    const disabledB = this.state.lowPrice || this.state.name ? true: false
    const disabledC = this.state.lowPrice || this.state.highPrice ? true: false
    const arrow = this.state.showFilters ? <ExpandLess color='primary' onClick={this.onClickFilter} /> : <ExpandMore color='primary' onClick={this.onClickFilter} />

    return (
      <div>
        <SortingHeader>

        <Typography color='secondary' variant='h5' align="left">Ofertas Cadastradas: {sortProducts.length}</Typography>

        <FormGroup row>
          <FormControlLabel
            control={<Checkbox disabled={disabledA} checked={this.state.lowPrice} onClick={this.handleSort} name="lowPrice" />}
            label="Menor Preço"
          />
          <FormControlLabel
            control={<Checkbox disabled={disabledB} checked={this.state.highPrice} onChange={this.handleSort} name="highPrice" />}
            label="Maior Preço"
          />
          <FormControlLabel
            control={<Checkbox disabled={disabledC} checked={this.state.name} onChange={this.handleSort} name="name" />}
            label="Nome"
          />
        </FormGroup>
          {arrow}
        </SortingHeader>

        <Collapse in={this.state.showFilters}>
          <Filters  handleChange={this.handleFilterTextValue}
                    handleNumberChange={this.handleFilterNumberValue}
                    descValue={this.state.inputDescValue}
                    titleValue={this.state.inputNameValue}
                    filtersValue={this.state.filters}
                    transform={this.state.filterTransition}
          />
        </Collapse>

        <ProductGridContainer>
          {this.props.handleOffers.length === 0 && <Center><CircularProgress /></Center>}
          {sortProducts.map(offer => {
            return <ProductCard key={offer.id} offer={offer}/>
          })}
        </ProductGridContainer>
      </div>
    )
  }
}
