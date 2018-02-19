'use strict';

// @flow

import { Store } from 'flux/utils';
import Dispatcher from 'src/Dispatcher';
import Action from 'src/Action';
import Web3 from 'web3';
import Promisify from 'utils/Promisify';
import UserStore from 'stores/User';
import _ from 'lodash';

// Injected web3
declare var web3: Web3;

class LeaseStore extends Store {

  static leaseAbi;
  static leaseBytecode;

  leaseAddress: string;
  leaseStartTime: string;
  leaseCycleTime: string;
  landlordBalanceWei: string;
  contractBalanceWei: string;
  usdOracleAddress: string;
  rentPrice: string;
  currentCycle: string;
  signed: boolean;

  tenantAddress: string;
  landlordAddress: string;

  __onDispatch(payload: Action<any>): void {
    if (payload.type === Action.lease.loaded) {
      _.assign(this, payload.data);
    } else if (payload.type === Action.lease.update) {
      console.assert(payload.data.leaseAddress, 'No lease address supplied to load');
      console.assert(web3, 'No web3 found');
      const _web3 = new Web3(web3.currentProvider);
      const leaseContract = new _web3.eth.Contract(LeaseStore.leaseAbi, payload.data.leaseAddress);
      Promise.all([
        Promisify(leaseContract.methods.startTime(), 'call'),
        Promisify(leaseContract.methods.cycleTime(), 'call'),
        Promisify(leaseContract.methods.landlordBalance(), 'call'),
        _web3.eth.getBalance(payload.data.leaseAddress),
        Promisify(leaseContract.methods.cyclePriceUsd(), 'call'),
        Promisify(leaseContract.methods.usdOracle(), 'call'),
        Promisify(leaseContract.methods.landlord(), 'call'),
        Promisify(leaseContract.methods.tenant(), 'call'),
        Promisify(leaseContract.methods.leaseCycle(), 'call'),
        Promisify(leaseContract.methods.signed(), 'call')
      ])
        .then((results: any[]) => {
          Dispatcher.dispatch({
            type: Action.lease.loaded,
            data: {
              leaseAddress: payload.data.leaseAddress,
              leaseStartTime: results[0],
              leaseCycleTime: results[1],
              landlordBalanceWei: results[2],
              contractBalanceWei: results[3],
              rentPrice: results[4],
              usdOracleAddress: results[5],
              landlordAddress: results[6],
              tenantAddress: results[7],
              currentCycle: results[8],
              signed: results[9]
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
      //
      // lease.deploy([
      //
      // ])
    }
  }
}

LeaseStore.leaseAbi = JSON.parse(`[{"constant":false,"inputs":[],"name":"terminate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"updateLandlordBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"signed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"sign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"startTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cyclePriceUsd","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"rentOwed","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"landlordCyclesPaid","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"payRent","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"tenant","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"receiveRent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"rentWeiValue","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"destroySignatures","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"signatures","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"usdOracle","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"cycleTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"landlordBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minCycleCount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"landlord","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"leaseCycle","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_usdOracle","type":"address"},{"name":"_landlord","type":"address"},{"name":"_tenant","type":"address"},{"name":"_startTime","type":"uint256"},{"name":"_cycleTime","type":"uint256"},{"name":"_cyclePriceUsd","type":"uint256"},{"name":"_minCycleCount","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]`);

LeaseStore.leaseBytecode = `606060405260006006556000600755341561001957600080fd5b60405160e0806112c183398101604052808051906020019091908051906020019091908051906020019091908051906020019091908051906020019091908051906020019091908051906020019091905050428411151561007957600080fd5b610e108311151561008957600080fd5b866000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555085600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555084600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555081600581905550836003819055508260048190555080600881905550505050505050506111448061017d6000396000f30060606040526004361061011d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630c08bf88146101225780631a5c01f014610137578063232a6b9d1461014c5780632ca151221461017957806378e979251461018e5780637a5ed0aa146101b75780637bd2805d146101e057806383197ef01461020957806384420d501461021e578063a709c4fe14610247578063adf0779114610251578063aebc4ac7146102a6578063b947a063146102bb578063bab086bc146102e4578063c792f36d14610335578063c8a4271f14610386578063d708e2c1146103db578063da7201fc14610404578063dbc0f9581461042d578063dc1997ea14610456578063e0eb1fe2146104ab575b600080fd5b341561012d57600080fd5b6101356104d4565b005b341561014257600080fd5b61014a61068c565b005b341561015757600080fd5b61015f61077e565b604051808215151515815260200191505060405180910390f35b341561018457600080fd5b61018c61086b565b005b341561019957600080fd5b6101a1610979565b6040518082815260200191505060405180910390f35b34156101c257600080fd5b6101ca61097f565b6040518082815260200191505060405180910390f35b34156101eb57600080fd5b6101f3610985565b6040518082815260200191505060405180910390f35b341561021457600080fd5b61021c6109db565b005b341561022957600080fd5b610231610c91565b6040518082815260200191505060405180910390f35b61024f610c97565b005b341561025c57600080fd5b610264610d13565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156102b157600080fd5b6102b9610d39565b005b34156102c657600080fd5b6102ce610ec6565b6040518082815260200191505060405180910390f35b34156102ef57600080fd5b61031b600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611036565b604051808215151515815260200191505060405180910390f35b341561034057600080fd5b61036c600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611056565b604051808215151515815260200191505060405180910390f35b341561039157600080fd5b610399611076565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156103e657600080fd5b6103ee61109b565b6040518082815260200191505060405180910390f35b341561040f57600080fd5b6104176110a1565b6040518082815260200191505060405180910390f35b341561043857600080fd5b6104406110a7565b6040518082815260200191505060405180910390f35b341561046157600080fd5b6104696110ad565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156104b657600080fd5b6104be6110d3565b6040518082815260200191505060405180910390f35b60006104de611103565b6008546104e96110d3565b1115156104f557600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561055157600080fd5b61055961068c565b610561610ec6565b600654013073ffffffffffffffffffffffffffffffffffffffff16311015151561058a57600080fd5b610592610ec6565b60066000828254019250508190555060065490506000600681905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f19350505050151561061057600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc3073ffffffffffffffffffffffffffffffffffffffff16319081150290604051600060405180830381858888f19350505050151561068957600080fd5b50565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806107375750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561074257600080fd5b61074a6110d3565b905080600754101561077b5761075e610ec6565b600754820302600660008282540192505081905550806007819055505b50565b600060096000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff168015610866575060096000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614806109145750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b151561091f57600080fd5b6001600960003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550565b60035481565b60055481565b600061098f61068c565b6006543073ffffffffffffffffffffffffffffffffffffffff163111156109b957600090506109d8565b3073ffffffffffffffffffffffffffffffffffffffff16316006540390505b90565b60006109e5611103565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161480610a8e5750600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b1515610a9957600080fd5b6001600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908315150217905550600a6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff168015610bd75750600a6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b15610c8e57610be461068c565b60065490506000600681905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501515610c5357600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b50565b60075481565b610c9f611103565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610cfb57600080fd5b610d03610985565b3410151515610d1157600080fd5b565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600080610d44611103565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610da057600080fd5b610da861068c565b6000600654111515610db957600080fd5b6006543073ffffffffffffffffffffffffffffffffffffffff163110151515610de157600080fd5b6006549150606482811515610df257fe5b0490506000600681905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc8284039081150290604051600060405180830381858888f193505050501515610e6157600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501515610ec257600080fd5b5050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166372850e7a6000604051602001526040518163ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401602060405180830381600087803b1515610f5557600080fd5b6102c65a03f11515610f6657600080fd5b50505060405180519050151515610f7c57600080fd5b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a6a861306005546000604051602001526040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050602060405180830381600087803b151561101657600080fd5b6102c65a03f1151561102757600080fd5b50505060405180519050905090565b600a6020528060005260406000206000915054906101000a900460ff1681565b60096020528060005260406000206000915054906101000a900460ff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60045481565b60065481565b60085481565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006003544210156110e85760009050611100565b60045460035442038115156110f957fe5b0460010190505b90565b61110b61077e565b151561111657600080fd5b5600a165627a7a72305820431bfa486c55243aed416c6429228178e2e6329bf93409d049479c4454acf2f90029`;

export default new LeaseStore(Dispatcher);
