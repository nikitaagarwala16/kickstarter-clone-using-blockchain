const events = require('events').EventEmitter.defaultMaxListeners = 0;
const assert=require("assert");
const ganache=require('ganache-cli')
const Web3 = require( 'web3'); // Web3 is a constructor
const provider = ganache.provider();
const web3 = new Web3(provider); //here it is an object and we are saying web3 gets connected with provider

const compiledFactory= require('../ethereum/build/CrowdFundFactory.json');
const compiledCrowdFund=require('../ethereum/build/CrowdFund.json');

let accounts;
let factory;
let campaign;
let campaignAddress;

beforeEach(async ()=>
{
  accounts= await web3.eth.getAccounts();
  factory= await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) //parsing the interface into a js object
  .deploy({data:compiledFactory.bytecode}) //deploying
  .send({from:accounts[0],gas:'1000000'}); // from mentioned acc

 await factory.methods.newCampaign('25').send(
   {
     from :accounts[0],
     gas: '1000000'
   }
 );
 [campaignAddress]=await factory.methods.getDeployedCampaigns().call();

campaign=await new web3.eth.Contract(JSON.parse(compiledCrowdFund.interface),
campaignAddress);
  factory.setProvider(provider);
});
describe('Campaigns', () => {
  it('CrowdFund and CrowdFundFactory are getting deployed', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  it('campaign manager is being set', async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(accounts[0], manager);
  });

  it('mapping of approvers is working', async () => {
    await campaign.methods.sendFund().send({
      value: '200',
      from: accounts[1]
    });
    const isInvestor = await campaign.methods.investors(accounts[1]).call();
    assert(isInvestor);
  });

  it('minimum contribution is working', async () => {
    try {
      await campaign.methods.sendFund().send({
        value: '5',
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it('allows a manager to make a spending request', async () => {
    await campaign.methods
      .createSpending('Buy AWS credits', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    const request = await campaign.methods.requestedSpendings(0).call();

    assert.equal(100,request.amount);
  });

});
