'use strict';

// @flow

import React, { Component } from 'react';
import Web3 from 'web3';
import moment from 'moment';

type Props = {
  contractActive: boolean,
  contractWei: string,
  landlordWei: string,
  usdPrice: number,
  usdNeedsUpdate: boolean,
  rentWei: string,
  rentPrice: number,
  rollingRent: Web3.Contract,
  usdOracle: Web3.Contract,
  web3: Web3,
  activeAccount: string
};

type State = {};

export default class ContractStats extends Component<Props, State> {

  state: State;

  render() {
    return (
      <div style={styles.container}>
        <p>Current USD/ETH price: ${this.props.usdPrice/100}</p>
        <button
          onClick={() => {
            this.props.web3.eth.sendTransaction({
              from: this.props.activeAccount,
              to: this.props.usdOracle.options.address,
              value: this.props.web3.utils.toWei('0.001'),
              gas: 300000
            }, (err, res) => {
              console.log(err, res);
            });
          }}
        >
          Update
        </button>

        <p>Rent price: ${this.props.rentPrice/100} ({this.props.rentPrice / this.props.usdPrice} eth)</p>
        <p>Current contract balance: {this.props.web3.utils.fromWei(this.props.contractWei)}</p>
        <p>Current landlord balance: {this.props.web3.utils.fromWei(this.props.landlordWei)}</p>
        <br />
        <button
          onClick={() => {
            console.log('button pressed');
          }}
        >
          Withdraw funds
        </button>
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
