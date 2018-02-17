'use strict';

// @flow

import React, { Component } from 'react';
import Web3 from 'web3';

declare var web3: Web3;

type Props = {
  rollingRent: Web3.Contract,
  usdOracle: Web3.Contract,
  web3: Web3,
  activeAccount: string
};
type State = {
  contractActive: boolean,
  contractWei: string,
  landlordWei: string,
  usdPrice: number,
  rentWei: string,
  rentPrice: number
};

export default class ContractStats extends Component<Props, State> {

  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      contractActive: false,
      contractWei: '',
      landlordWei: '',
      usdPrice: 0,
      rentWei: '',
      rentPrice: 0
    };
  }

  componentDidMount() {
    this.props.rollingRent.methods.rentWeiValue().call((err, rentWei) => this.setState({rentWei}));
    this.props.usdOracle.methods.getPrice().call((err, usdPrice) => this.setState({usdPrice}));
    this.props.rollingRent.methods.landlordBalance().call((err, landlordWei) => this.setState({landlordWei}));
    this.props.rollingRent.methods.contractBalance().call((err, contractWei) => this.setState({contractWei}));
    this.props.rollingRent.methods.rentPrice().call((err, rentPrice) => this.setState({rentPrice}));
  }

  render() {
    return (
      <div style={styles.container}>
        <p>Current USD/ETH price: ${this.state.usdPrice/100}</p>
        <button
          onClick={() => {
            this.props.web3.eth.sendTransaction({
              from: this.props.activeAccount,
              to: this.props.usdOracle.options.address,
              value: this.props.web3.utils.toWei('0.001'),
              gas: 300000
            }, (err, res) => {
              console.log(err, res);
            }).on('receipt', (obj) => console.log(obj));
          }}
        >
          Update
        </button>

        <p>Rent price: ${this.state.rentPrice/100} ({this.state.rentPrice / this.state.usdPrice} eth)</p>
        <p>Current contract balance: {this.props.web3.utils.fromWei(this.state.contractWei)}</p>
        <p>Current landlord balance: {this.props.web3.utils.fromWei(this.state.landlordWei)}</p>
        <br />
      </div>
    );
  }
}

const styles = {
  container: {
    margin: 0,
    padding: 0,
    flex: 1,
    backgroundColor: 'white'
  }
};
