'use strict';

// @flow

import { Store } from 'flux/utils';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import Web3 from 'web3';
import Promisify from 'utils/Promisify';
import UserStore from 'stores/User';

// Injected web3
declare var web3: Web3;

class LeaseStore extends Store {

  static leaseAbi;
  static leaseBytecode;
  static oracleAbi;
  static oracleBytecode;

  leaseAddress: string;
  leaseStartTime: string;
  leaseCycleTime: string;
  landlordBalanceWei: string;
  contractBalanceWei: string;
  contractEnabled: boolean;
  usdOracleAddress: string;
  rentPrice: string;

  tenantAddress: string;
  landlordAddress: string;

  __onDispatch(payload: Action<any>): void {
    if (payload.type === Action.lease.loaded) {
      this.leaseStartTime = payload.data.leaseStartTime;
      this.leaseCycleTime = payload.data.leaseCycleTime;
      this.contractBalanceWei = payload.data.contractBalanceWei;
      this.contractEnabled = payload.data.contractEnabled;
      this.rentPrice = payload.data.rentPrice;
      this.usdOracleAddress = payload.data.usdOracleAddress;
      this.landlordAddress = payload.data.landlordAddress;
      this.tenantAddress = payload.data.tenantAddress;
    } else if (payload.type === Action.lease.update) {
      console.assert(payload.data.leaseAddress, 'No lease address supplied to load');
      console.assert(payload.data.leaseAbi, 'No lease ABI supplied to load');
      console.assert(web3, 'No web3 found');
      const _web3 = new Web3(web3.currentProvider);
      const leaseContract = new _web3.eth.Contract(payload.data.leaseAbi, payload.data.leaseAddress);
      Promise.all([
        Promisify(leaseContract.methods.leaseStartTime(), 'call'),
        Promisify(leaseContract.methods.leaseCycleTime(), 'call'),
        Promisify(leaseContract.methods.contractBalance(), 'call'),
        Promisify(leaseContract.methods.contractEnabled(), 'call'),
        Promisify(leaseContract.methods.rentPrice(), 'call'),
        Promisify(leaseContract.methods.usdOracle(), 'call'),
        Promisify(leaseContract.methods.landlord(), 'call'),
        Promisify(leaseContract.methods.tenant(), 'call')
      ])
        .then((results: any[]) => {
          Dispatcher.dispatch({
            type: Action.lease.loaded,
            data: {
              leaseStartTime: results[0],
              leaseCycleTime: results[1],
              contractBalanceWei: results[2],
              contractEnabled: results[3],
              rentPrice: results[4],
              usdOracleAddress: results[5],
              landlordAddress: results[6],
              tenantAddress: results[7]
            }
          });
        });
    } else if (payload.type === Action.lease.create) {
      console.assert(payload.data.landlordAddress, 'No landlordAddress supplied');
      console.assert(payload.data.tenantAddress, 'No tenantAddress supplied');
      console.assert(payload.data.leaseCyclePriceUsd, 'No leaseCyclePriceUsd supplied');
      console.assert(payload.data.leaseStartTime, 'No leaseStartTime supplied');
      console.assert(payload.data.leaseCycleTime, 'No leaseCycleTime supplied');
      const _web3 = new Web3(web3.currentProvider);
      const lease = new _web3.eth.Contract(LeaseStore.leaseAbi, {
        from: UserStore.activeAccount,
        data: LeaseStore.leaseBytecode
      });

      lease.deploy([

      ])
    }
  }
}

LeaseStore.leaseAbi = JSON.parse(`[
	{
		"constant": false,
		"inputs": [],
		"name": "collectRent",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "contractEnabled",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "bailout",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "assertContractEnabled",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "leaseStartTime",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "contractBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "tenant",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "rentWeiValue",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "usdOracle",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "leaseCycleTime",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "landlordBalance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "landlord",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "rentPrice",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"name": "_usdOracle",
				"type": "address"
			},
			{
				"name": "_landlord",
				"type": "address"
			},
			{
				"name": "_tenant",
				"type": "address"
			},
			{
				"name": "_rentPrice",
				"type": "uint256"
			},
			{
				"name": "_leaseStartTime",
				"type": "uint256"
			},
			{
				"name": "_leaseCycleTime",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	}
]`);

LeaseStore.leaseBytecode = `0x6060604052600060065560006007556000600860006101000a81548160ff0219169083151502179055506000600860016101000a81548160ff021916908315150217905550341561004f57600080fd5b60405160c080610f468339810160405280805190602001909190805190602001909190805190602001909190805190602001909190805190602001909190805190602001909190505085600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550846000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555083600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508260058190555081600381905550806004819055504260035411151561017f57600080fd5b610e1060045411151561019157600080fd5b505050505050610da0806101a66000396000f3006060604052600436106100e6576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630c08bf88146100eb5780631a5c01f0146101005780633181743e146101155780634d4a919f1461012a578063572f14401461013f5780637bd2805d1461016857806384420d501461019157806388e86a48146101ba578063a709c4fe146101e3578063adf07791146101ed578063b947a06314610242578063c8a4271f1461026b578063cee3249c146102c0578063da7201fc146102e9578063dc1997ea14610312578063e0eb1fe214610367575b600080fd5b34156100f657600080fd5b6100fe610390565b005b341561010b57600080fd5b610113610528565b005b341561012057600080fd5b610128610619565b005b341561013557600080fd5b61013d6107b3565b005b341561014a57600080fd5b610152610a70565b6040518082815260200191505060405180910390f35b341561017357600080fd5b61017b610a76565b6040518082815260200191505060405180910390f35b341561019c57600080fd5b6101a4610ad8565b6040518082815260200191505060405180910390f35b34156101c557600080fd5b6101cd610ade565b6040518082815260200191505060405180910390f35b6101eb610ae4565b005b34156101f857600080fd5b610200610b58565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561024d57600080fd5b610255610b7e565b6040518082815260200191505060405180910390f35b341561027657600080fd5b61027e610cf0565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156102cb57600080fd5b6102d3610d16565b6040518082815260200191505060405180910390f35b34156102f457600080fd5b6102fc610d1c565b6040518082815260200191505060405180910390f35b341561031d57600080fd5b610325610d22565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561037257600080fd5b61037a610d47565b6040518082815260200191505060405180910390f35b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156103ee57600080fd5b6103f6610528565b6103fe610b7e565b600654013073ffffffffffffffffffffffffffffffffffffffff16311015151561042757600080fd5b61042f610b7e565b600660008282540192505081905550600654905060006006819055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015156104ac57600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f19350505050151561052557600080fd5b50565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806105d25750600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b15156105dd57600080fd5b6105e5610d47565b9050806007541015610616576105f9610b7e565b600754820302600660008282540192505081905550806007819055505b50565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561067657600080fd5b61067e610528565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a6a8613060016000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b151561071857600080fd5b6102c65a03f1151561072957600080fd5b5050506040518051905060065411151561074257600080fd5b600654905060006006819055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015156107b057600080fd5b50565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16148061085d5750600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561086857600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156108dd576001600860006101000a81548160ff021916908315150217905550610950565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561094f576001600860016101000a81548160ff0219169083151502179055505b5b600860019054906101000a900460ff1680156109785750600860009054906101000a900460ff165b15610a6d57610985610528565b600654905060006006819055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015156109f357600080fd5b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f193505050501515610a6c57600080fd5b5b50565b60055481565b600080610a81610528565b610a89610b7e565b600654019050803073ffffffffffffffffffffffffffffffffffffffff16311115610ab75760009150610ad4565b3073ffffffffffffffffffffffffffffffffffffffff1631810391505b5090565b60075481565b60035481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610b4057600080fd5b610b48610a76565b3410151515610b5657600080fd5b565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166372850e7a6000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b1515610c0e57600080fd5b6102c65a03f11515610c1f57600080fd5b50505060405180519050151515610c3557600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a6a861306005546000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b1515610cd057600080fd5b6102c65a03f11515610ce157600080fd5b50505060405180519050905090565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b60065481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000600354421015610d5c5760009050610d71565b6004546003544203811515610d6d57fe5b0490505b905600a165627a7a723058208493ae38027128ea891f380d9ff8fb46eabde18c759c3c3e6ff5ed5717c3367e0029`;

export default new LeaseStore(Dispatcher);
