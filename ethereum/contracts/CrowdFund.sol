pragma solidity ^0.4.17;
contract CrowdFundFactory
{
    address[] public deployedContracts;
    function newCampaign(uint minimum) public
    {
        address campaign=address(new CrowdFund(minimum, msg.sender));
        deployedContracts.push(campaign);
    }
    function getDeployedCampaigns() public view returns (address[] memory){
        return deployedContracts;
    }

}
contract CrowdFund
{
    struct SpendingRequest
    {
        string description;
        uint amount;
        address vendor;
        bool completed;
        uint yesCount;
        mapping(address =>bool) whoVoted;
    }
    address public manager;
    uint public minContri;
    mapping(address=>bool) public investors;
    SpendingRequest [] public requestedSpendings;
    uint public countInvestors;

    modifier onlyManager()
    {
        require(msg.sender==manager);
        _;
    }

   function CrowdFund(uint minContribution,address client) public
    {
        manager=client;
        minContri=minContribution;
    }
    function sendFund() payable public
    {
        require(msg.value>minContri);
        investors[msg.sender] =true;
        countInvestors++;
    }
    function createSpending(string memory describe,uint amount,address vendor) public  onlyManager
    {
       SpendingRequest memory request=SpendingRequest(describe,amount,vendor,false,0) ;
       //when we initialise a struct we only have to give values for primitive data types not for reference datatypes like mapping
      requestedSpendings.push(request);

    }
    function approveSpending(uint index) public
    {
        //SpendingRequest storage sr= requestedSpendings[index]

        require(investors[msg.sender]);  //checking if he has invested in the campaign
        require(!requestedSpendings[index].whoVoted[msg.sender]);  //an investor is only allowed to vote once
        requestedSpendings[index].whoVoted[msg.sender]= true;
        requestedSpendings[index].yesCount++;
    }
    function finalizeSpending(uint index) public onlyManager
    {
        SpendingRequest storage request = requestedSpendings[index];
        require(request.yesCount > (countInvestors/2));
        request.vendor.transfer(request.amount);
        require(!request.completed);
        request.completed=true;
    }

}
