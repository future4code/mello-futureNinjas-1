import React, { Component } from 'react'
import { ProductCard } from './ProductCard'
import styled from 'styled-components'
import { Filters } from '../Filters/Filters'
import { CircularProgress } from '@material-ui/core'

const ProductGridContainer = styled.div`
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
  padding: 8px 8px;
`
const Sorting = styled.select`
  margin-left: 8px;
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
    list: true,
    sort: '',
    inputNameValue: '',
    inputDescValue: '',
    filters: {
        valMin: null,
        valMax: null
    },
  }

  onClickFilter = () => {
    this.setState({
      showFilters: !this.state.showFilters
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
      sort: event.target.value
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
    const {sort} = this.state

    if(sort === 'ascending') {
        return offerOne.value - offerTwo.value
    } else if ( sort === 'descending') {
        return offerTwo.value - offerOne.value
    } else if(sort === 'nameAsc'){
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

    console.log(sortProducts)
    return (
      <div>
        <SortingHeader>
          <p>Ofertas Cadastradas: {sortProducts.length}</p>
          <label>Ordenar:
            <Sorting onChange={this.handleSort}>
              <option value=''> </option>
              <option value='ascending'>Crescente</option>
              <option value='descending'>Decrescente</option>
              <option value='nameAsc'>Nomes de A-Z</option>
            </Sorting>
          </label>
          <button onClick={this.onClickFilter}>Filtrar</button>
        </SortingHeader>
        {this.state.showFilters &&
        <Filters  handleChange={this.handleFilterTextValue}
                  handleNumberChange={this.handleFilterNumberValue}
                  descValue={this.state.inputDescValue}
                  titleValue={this.state.inputNameValue}
                  filtersValue={this.state.filters}
                  />}

        <ProductGridContainer>
          {sortProducts.map(offer => {
            return <ProductCard key={offer.id} offer={offer}/>
          })}
        </ProductGridContainer>
      </div>
    )
  }
}
