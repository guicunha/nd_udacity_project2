## Blockchain project about Udacity term 1 project 2 nanodegree

### This project on a easy way try to describe de basis about time stamp theory

#### Prerequisites

To run this app you will need NodeJS and NPM after download this two you can run npm install on root folder to install NPM dependencies:

    "crypto-js": "^3.1.9-1",
    "level": "^4.0.0",
    "leveldown": "^4.0.1",
    "levelup": "^3.1.1",
    "lexicographic-integer-encoding": "^1.0.1",
    "readline-sync": "^1.4.9"
    
Other 3th parties was added to improve the funcionalities of our softwares.

### Approach Modifications

- To show the basics more intuitive was created a menu with readline-sync. This wasn't on the Udacity prerequisites.
- To make the app faster I look how bitcoin does it, and create two databases one with indexes and other with data. This wasn't on the Udacity prerequisites.


### Endpoint API

GET a block by height

Variable  | Type

[:height:] => integer relative to block position on chain

``
    http://localhost:8080/block/[:height:]
``

Expected result

```json
{
  "hash": "8de8d5d6dee79fced824e3b000e789dbdc28501453f104c9fc0e6fe4ebcc99f1",
  "height": 0,
  "body": "First block in the chain - Genesis block",
  "time": "1537550929",
  "previousBlockHash": "0000000000000000000000000000000000000000000000000000000000000000"
}
```

POST a block on a top of chain

body sample

```json
    {
    "body": "Body sample" 
    }
```

Expected result

```json
{
  "success": true,
  "block": {
    "hash": "e7b73c0ad6435e9480bc1c24c4a6757b1652e0a13b8f8c7aee54e112fd4c2d40",
    "height": 10,
    "body": "block 3",
    "time": "1537552718",
    "previousBlockHash": "5e7597cedf88fc5844a46ccc88c727fb297c95dbb762e6352be167d3efd0eded"
  }
}
```


Common errors

When send a null body the expected result is:

```json
{
    "error": true,
    "message": "You need to pass data body to create your block"
}
```

When look for a non-valid block the expected result is:

```json
{
  "error": true,
  "message": "Block does not found"
}
```


### Errors on lastes push

* Adds blocks after you've added the genesis block. But it fails without prompting the user when genesis is not yet generated. Must be reimplemented to avoid crashing.
    * Checking and creating the genesis block before menu solved it.
* Genesis block should be created upon startup. Right now, user needs to click an option (Verify Genesis) before it is generated.
    * Solved creating block genesis on startup.
* It is not clear which blocks are invalid.
    * Now the code show the error blocks.
* Not implemented. Closest function is to get the last block integrity (option 3). I'm afraid it doesn't satisfy the rubric. Function must be exposed to the user.
    * Functionality created. 
* Change the name of simpleChain.js to simpleChainCLI.js 
