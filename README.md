## Blockchain project about Udacity term 1 project 2 nanodegree

### This project on a easy way try to describe de basis about time stamp theory

### [Changelog]

* Change the name of simpleChain.js to simpleChainCLI.js 

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

### Errors on lastes push

* Adds blocks after you've added the genesis block. But it fails without prompting the user when genesis is not yet generated. Must be reimplemented to avoid crashing.
    * Checking and creating the genesis block before menu solved it.
* Genesis block should be created upon startup. Right now, user needs to click an option (Verify Genesis) before it is generated.
    * Solved creating block genesis on startup.
* It is not clear which blocks are invalid.
    * Now the code show the error blocks.
* Not implemented. Closest function is to get the last block integrity (option 3). I'm afraid it doesn't satisfy the rubric. Function must be exposed to the user.
    * Functionality created. 