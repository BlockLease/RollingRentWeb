'use strict';

// @flow

import React, { Component } from 'react';
import Web3 from 'web3';
import ContractStats from 'components/ContractStats';

// Injected web3
declare var web3: Web3;

const contractAddress = '0x1EDa2717A936b7bB70c6D6cA39002Bcfe3529cb2';
const contractAbiString = '[{"constant":false,"inputs":[],"name":"collectRent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"bailout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rentPeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"assertContractEnabled","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"contractBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"tenant","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rentWeiValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rentStartTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"usdOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"landlordBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"landlord","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rentPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_usdOracle","type":"address"},{"name":"_landlord","type":"address"},{"name":"_tenant","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]';
const contractAbi = JSON.parse(contractAbiString);

const oracleAddress = '0x25aa30c7b08d2ba54f4425d7461f0b541834cd0e';
const oracleAbiString = '[{"constant":false,"inputs":[{"name":"_myid","type":"bytes32"},{"name":"_result","type":"string"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"myid","type":"bytes32"},{"name":"result","type":"string"},{"name":"proof","type":"bytes"}],"name":"__callback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"}]';
const oracleAbi = JSON.parse(oracleAbiString);

type Props = { };
type State = {
  rollingRent: Web3.Contract,
  usdOracle: Web3.Contract,
  web3: Web3,
  activeAccount: string
};

export default class App extends Component<Props, State> {

  state: State;

  constructor(props: Props) {
    super(props);
    const _web3 = new Web3(web3.currentProvider);
    _web3.eth.getAccounts((err, accounts) => {
      this.setState({activeAccount: accounts[0]});
    });
    const rollingRent = new _web3.eth.Contract(contractAbi, contractAddress);
    const usdOracle = new _web3.eth.Contract(oracleAbi, oracleAddress);
    this.state = {
      rollingRent,
      usdOracle,
      web3: _web3,
      activeAccount: ''
    };
  }

  render() {
    return (
      <div style={styles.app}>
        <ContractStats
          rollingRent={this.state.rollingRent}
          usdOracle={this.state.usdOracle}
          web3={this.state.web3}
          activeAccount={this.state.activeAccount}
        />
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
