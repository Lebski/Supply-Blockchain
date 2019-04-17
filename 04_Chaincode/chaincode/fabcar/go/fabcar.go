package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// SmartContract implements a simple chaincode to manage an asset
type SmartContract struct {
}

type Product struct {
	Id string `json:"id"`
}

type Shell struct {
	Product
	Status string `json:"status"`
}

// Init is called during chaincode instantiation to initialize any
// data. Note that chaincode upgrade also calls this function to reset
// or to migrate data, so be careful to avoid a scenario where you
// inadvertently clobber your ledger's data!
// According to the fabcar example is it best practice to nitialize the ledger in 
// another function
func (t *SmartContract) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

// Invoke is called per transaction on the chaincode. 
func (t *SmartContract) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	// Extract the function and args from the transaction proposal
	fn, args := stub.GetFunctionAndParameters()
	if fn == "createShell" {
		return t.createShell(stub, args)
		/*} else if fn == "changeStatus" {
			return t.changeStatus(stub, args)
		} else if fn == "getShell" {
			return t.getShell(stub, args)*/
	} else if fn == "initLedger" {
		return t.initLedger(stub)
	}
	return shim.Error("No fuction called")
}

// initLedger is called to initialze some sample data for test purposes. 
func (t *SmartContract) initLedger(stub shim.ChaincodeStubInterface) peer.Response {
	shell := Shell{Product{"1"}, "TRANSPORT"}
	shellAsByte, err := json.Marshal(shell)
	if err != nil {
		return shim.Error(fmt.Sprintln(err))
	}
	stub.PutState("Shell1", shellAsByte)
	return shim.Success([]byte("Init succesful"))
}

//createShell creates a shell with an String Array ["id","status"]
// Key of the Shell is "SHELL +id"
func (t *SmartContract) createShell(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("Wrong number of arguments in creating shell")
	}
	shell := Shell{Product{args[0]}, args[1]}
	shellAsByte, err := json.Marshal(shell)
	if err != nil {
		return shim.Error(fmt.Sprintln(err))
	}
	stub.PutState("SHELL"+args[0], shellAsByte)
	return shim.Success([]byte("Shell created"))
}

// main function starts up the chaincode in the container during instantiate
func main() {
	if err := shim.Start(new(SmartContract)); err != nil {
		fmt.Printf("Error starting SmartContract chaincode: %s", err)
	}
}
