'use strict';

// @flow

import React, { Component } from 'react';
import Web3 from 'web3';
import ContractStats from 'components/ContractStats';
import RippleLoader from 'components/RippleLoader';
import Promisify from 'utils/Promisify';

// Injected web3
declare var web3: Web3;

const contractAddress = '0xad30db44bb3fbc5157425c7f137ce6b1730e6e11';
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
  activeAccount: string,
  contractActive?: boolean,
  contractWei?: string,
  landlordWei?: string,
  usdPrice?: number,
  usdNeedsUpdate?: boolean,
  rentWei?: string,
  rentPrice?: number,
  loadingScreenVisible: boolean
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
      activeAccount: '',
      loadingScreenVisible: true
    };
    setTimeout(() => {
      this.setState({
        loadingScreenVisible: false
      });
    }, 2000);
  }

  componentDidMount() {
    Promise.all([
      Promisify(this.state.rollingRent.methods.contractEnabled(), 'call'),
      Promisify(this.state.rollingRent.methods.landlordBalance(), 'call'),
      Promisify(this.state.usdOracle.methods.getPrice(), 'call'),
      Promisify(this.state.rollingRent.methods.contractBalance(), 'call'),
      Promisify(this.state.rollingRent.methods.rentPrice(), 'call')
    ])
      .then((results: any[]) => {
        this.setState({
          contractActive: results[0],
          landlordWei: results[1],
          usdPrice: results[2],
          contractWei: results[3],
          rentPrice: results[4]
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div style={styles.app}>
        {(() => {
          if (this.state.loadingScreenVisible) return (
            <div style={{
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              margin: 'auto',
              width: 80,
              height: 80,
              // backgroundColor: 'red'
            }}>
              <RippleLoader />
            </div>
          );
          else return (
            <ContractStats
              contractActive={this.state.contractActive || false}
              contractWei={this.state.contractWei || '0'}
              landlordWei={this.state.landlordWei || '0'}
              usdPrice={this.state.usdPrice || 0}
              usdNeedsUpdate={this.state.usdNeedsUpdate || true}
              rentWei={this.state.rentWei || '0'}
              rentPrice={this.state.rentPrice || 0}
              rollingRent={this.state.rollingRent}
              usdOracle={this.state.usdOracle}
              web3={this.state.web3}
              activeAccount={this.state.activeAccount}
            />
          );
        })()}
      </div>
    );
  }
}

const styles = {
  app: {
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
