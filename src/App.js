'use strict';

// @flow

import React, { Component } from 'react';
import Web3 from 'web3';

// Injected web3
declare var web3: Web3;

const contractAddress = '0x1EDa2717A936b7bB70c6D6cA39002Bcfe3529cb2';
const contractAbiString = '[{"constant":false,"inputs":[],"name":"collectRent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"bailout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rentPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"assertContractEnabled","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tenant","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rentWeiValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rentStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"usdOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"landlordBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"landlord","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rentPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_usdOracle","type":"address"},{"name":"_landlord","type":"address"},{"name":"_tenant","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]';
const contractAbi = JSON.parse(contractAbiString);

const oracleAddress = '0xd310cddf742145dad87b10f43868050dcd81a4b0';
const oracleAbiString = '[{"constant":false,"inputs":[{"name":"_myid","type":"bytes32"},{"name":"_result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"},{"name":"proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]';
const oracleAbi = JSON.parse(oracleAbiString);


type Props = { };
type State = {
  contractActive: boolean,
  contractWei: string,
  landlordWei: string,
  usdPrice: number,
  rentWei: string,
  rentPrice: number
};

export default class App extends Component<Props, State> {

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
    console.log('loading contract');
    const _web3 = new Web3(web3.currentProvider);
    const contract = new _web3.eth.Contract(contractAbi, contractAddress);
    const oracle = new _web3.eth.Contract(oracleAbi, oracleAddress);
    console.log(contract.methods);
    contract.methods.rentWeiValue().call((err, rentWei) => this.setState({rentWei}));
    oracle.methods.getPrice().call((err, usdPrice) => this.setState({usdPrice}));
    contract.methods.landlordBalance().call((err, landlordWei) => this.setState({landlordWei}));
    contract.methods.contractBalance().call((err, contractWei) => this.setState({contractWei}));
    contract.methods.rentPrice().call((err, rentPrice) => this.setState({rentPrice}));
    // _web3.eth.getAccounts((err, res) => {
    //   console.log(err, res);
    // });
  }

  render() {
    const _web3 = new Web3(web3.currentProvider);
    return (
      <div style={styles.app}>
        <p>Current USD/ETH price: ${this.state.usdPrice/100}</p>
        <p>Rent price: ${this.state.rentPrice/100} ({this.state.rentPrice / this.state.usdPrice} eth)</p>
        <p>Current contract balance: {_web3.utils.fromWei(this.state.contractWei)}</p>
        <p>Current landlord balance: {_web3.utils.fromWei(this.state.landlordWei)}</p>
      </div>
    );
  }
}

const styles = {
  app: {
    margin: 0,
    padding: 0,
    flex: 1,
    backgroundColor: 'white'
  },
  topButton: {
    // backgroundColor: 'blue',
    flex: 1
  },
  bottomButton: {
    // backgroundColor: 'red',
    flex: 1
  }
};
