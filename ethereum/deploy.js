const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CrowdFundFactory.json');

const provider=new HDWalletProvider(
  'curtain answer meadow order aunt crew error vehicle salute belt royal sound',
  'https://ropsten.infura.io/v3/fc79873b2b284286be119e5d1619161c'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();


// Contract deployed to 0x87D5A79D764Fd82fec65787EF8cFdA6E69D2C83b
