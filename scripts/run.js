async function main(){
    const [randomPerson] = await hre.ethers.getSigners();
    const contractFactoryNFT = await hre.ethers.getContractFactory("KadakNFT");
    const NFTContract = await contractFactoryNFT.deploy();
    await NFTContract.deployed();

    console.log("Contract Address:",NFTContract.address);

    let txn = await NFTContract.makeAnKadakNFT();
    await txn.wait();

    txn = await NFTContract.connect(randomPerson).makeAnKadakNFT();
    await txn.wait();
}

const runMain = async() => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
runMain();