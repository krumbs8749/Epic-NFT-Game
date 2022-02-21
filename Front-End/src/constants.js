const CONTRACT_ADDRESS = '0xe8d899E8F335A82bBD3418Ad5cdCB52644eD0c72';

const transformCharacterData = (characterData) =>{
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  }
}

export { CONTRACT_ADDRESS, transformCharacterData };