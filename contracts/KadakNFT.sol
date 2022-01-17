// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

import {Base64} from "./libraries/Base64.sol";

contract KadakNFT is ERC721URIStorage{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event NewKadakNFTMinted(address sender, uint256 tokenId);

    string baseUrl ="<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] firstWord  = ["Small","Medium","Large","ComboSize","XLSize"];
    string[] secondWord = ["Cheese","Chicken","Veggie","Paneer","Plain"];
    string[] thirdWord = ["Pizza","Tandooripizza","Thincrustpizza","Hotpizza","Spicypizza"];

    constructor() ERC721("PushpaBhau","PUSHPA") {
        console.log("BlockCoders Rocks !!");
    }
    function pickFirstWord(uint256 tokenId) public view returns(string memory) {
      uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));

        rand = rand % firstWord.length;

        return firstWord[rand];
    }
    function pickSecondWord(uint256 tokenId) public view returns(string memory) {
      uint256 rand = random(string(abi.encodePacked("SECOND_WORD", Strings.toString(tokenId))));

        rand = rand % secondWord.length;

        return secondWord[rand];
    }
    function pickThirdWord(uint256 tokenId) public view returns(string memory) {
      uint256 rand = random(string(abi.encodePacked("THIRD_WORD", Strings.toString(tokenId))));

        rand = rand % thirdWord.length;

        return thirdWord[rand];
    }

    function random(string memory input) internal pure returns(uint256){
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function makeAnKadakNFT() public{
        uint256 newItem = _tokenIds.current();

        string memory first = pickFirstWord(newItem);
        string memory second = pickSecondWord(newItem);
        string memory third = pickThirdWord(newItem);
        string memory combinedWord = string(abi.encodePacked(first,second,third));

        string memory finalSvg = string(abi.encodePacked(baseUrl, first, second, third,"</text></svg>"));

         string memory json = Base64.encode(
          bytes(
            string(
                abi.encodePacked(
                    '{"name": "',combinedWord,
                    '", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                    // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                    Base64.encode(bytes(finalSvg)),
                    '"}'
                )
            )
        )
       );

        console.log("\n FinalTokenUri: ",json);
        console.log("\n--------------------");
        console.log(finalSvg);
        console.log("--------------------\n");

        string memory finalTokenUri = string(
        abi.encodePacked("data:application/json;base64,", json)
        );

         console.log("\n--------------------");
         console.log("Final URI:",finalTokenUri);
         console.log("--------------------\n");

        _safeMint(msg.sender, newItem);

        _setTokenURI(newItem, finalTokenUri); 
         
        _tokenIds.increment();

        console.log("An NFT w/ %s ID has be minted to jjjjjjjjjr23w%smmm342mmmmmmmmmm",newItem, msg.sender);

        emit NewKadakNFTMinted(msg.sender, newItem);
    }



}