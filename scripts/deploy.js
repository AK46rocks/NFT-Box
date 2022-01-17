async function main(){
    const contractFactoryNFT = await hre.ethers.getContractFactory("KadakNFT");
    const NFTContract = await contractFactoryNFT.deploy();
    await NFTContract.deployed();

    console.log("Contract Address:",NFTContract.address);

    let txn = await NFTContract.makeAnKadakNFT();
    await txn.wait();
    console.log("Minted #1 NFT");

    txn = await NFTContract.makeAnKadakNFT();
    await txn.wait();
    console.log("Minted #2 NFT");
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