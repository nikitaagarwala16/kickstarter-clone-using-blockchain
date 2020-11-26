const path =require('path');
const solc =require('solc');
const fs =require('fs-extra')//file system

//clearing build path if there is any
const buildPath = path.resolve(__dirname,"build");
fs.removeSync(buildPath);

//reading and compiling from CrowdFund.sol
const crowdFundPath = path.resolve(__dirname,"contracts","CrowdFund.sol");
const source = fs.readFileSync(crowdFundPath,'utf8');
const output = solc.compile(source,1).contracts;

//saving the deployedContracts in build folder

fs.ensureDirSync(buildPath); //ebsures that a build folder is created 
console.log(output)
for(let c in output)
{
  fs.outputJsonSync(path.resolve(buildPath,c.replace(':',"")+".json"),
output[c]);

}
