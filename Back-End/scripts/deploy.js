const main = async () =>{
    const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
    const gameContract = await gameContractFactory.deploy(
        ["Demon Emperor", "Shadow Monarch", "Pirate King", "Baldy Master"],         // Names
        ["QmW6UDyksuPtAv9KsSUEc6DsAmMfp8dDArL7MnDtsgHCbn", // Images
        "QmPax5FrCHo2W9ykjf2H6ScdQHuPixkaB2GmdoY4fHHVdG", 
        "QmXdmcPmRSEvuWAVdq7uEL5od4fBXJKNjxhdLrp5xnqZpm",
        "QmWSSRGPr3nSNHKyNQ3zAFe7wWDoSn1B8VtGGGvnejtT46"],
        [100, 200, 300, 250],                    // HP values
        [250, 200, 180, 250],
        "Vegito SS", // Boss name
        "QmfJetwkBpmiwZRwtN29Nds4PniR7EsXSzBJPw1wE7CJVL", // Boss image
        7777, // Boss hp
        77 // Boss attack damage                       //  Attack
    );
    await gameContract.deployed();

    console.log("Contract has been deployed to %s", gameContract.address) // 0xe8d899E8F335A82bBD3418Ad5cdCB52644eD0c72
}

const runMain = async() => {
    try{
        await main();
        process.exit(0);
    }catch(error){
        console.log();
        process.exit(1);
    }
}

runMain();