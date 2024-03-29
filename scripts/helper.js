require('dotenv').config()

const Eos = require('./eosjs-port')
const R = require('ramda')

// Note: For some reason local chain ID is different on docker vs. local install of eosio
const dockerLocalChainID = 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f'
const eosioLocalChainID = '8a34ec7df1b8cd06ff4a8abbaa7cc50300823350cadc59ab296cb00d104d2b8f'

const networks = {
  local:  eosioLocalChainID,
  telosTestnet: '1eaa0824707c8c16bd25145493bf062aecddfeb56c736f6ba6397f3195f33c9f',
  telosMainnet: '4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11',
  eosMainnet: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
}

const networkDisplayName = {
  local: 'Local',
  telosTestnet: 'Telos Testnet',
  telosMainnet: 'Telos Mainnet',
  eosMainnet: 'EOS Mainnet',
}

const endpoints = {
  local: process.env.LOCAL_ENDPOINT,
  telosTestnet: 'https://api-test.telosfoundation.io',
  telosMainnet: 'https://api.telosfoundation.io',
  eosMainnet: 'http://eos.greymass.com',
}

const ownerAccounts = {
  local: 'owner',
  telosTestnet: 'seeds',
  telosMainnet: 'seed.seeds',
  eosMainnet: 'hypha',
}

const {
  EOSIO_NETWORK,
  EOSIO_API_ENDPOINT,
  EOSIO_CHAIN_ID
} = process.env

const chainId = EOSIO_CHAIN_ID || networks[EOSIO_NETWORK] || networks.local
const httpEndpoint = EOSIO_API_ENDPOINT || endpoints[EOSIO_NETWORK] || endpoints.local
const owner = ownerAccounts[EOSIO_NETWORK] || ownerAccounts.local

const netName = EOSIO_NETWORK != undefined ? (networkDisplayName[EOSIO_NETWORK] || "INVALID NETWORK: "+EOSIO_NETWORK) : "Local"
console.log(""+netName)

const publicKeys = {
  [networks.local]: ['EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV', 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'],
  [networks.telosMainnet]: ['EOS6kp3dm9Ug5D3LddB8kCMqmHg2gxKpmRvTNJ6bDFPiop93sGyLR', 'EOS6kp3dm9Ug5D3LddB8kCMqmHg2gxKpmRvTNJ6bDFPiop93sGyLR'],
  [networks.telosTestnet]: ['EOS8MHrY9xo9HZP4LvZcWEpzMVv1cqSLxiN2QMVNy8naSi1xWZH29', 'EOS8C9tXuPMkmB6EA7vDgGtzA99k1BN6UxjkGisC1QKpQ6YV7MFqm'],
  [networks.eosMainnet]: []
}
const [ ownerPublicKey, activePublicKey ] = publicKeys[chainId]

const apiKeys = {
  [networks.local]: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV',
  [networks.telosMainnet]: 'EOS7YXUpe1EyMAqmuFWUheuMaJoVuY3qTD33WN4TrXbEt8xSKrdH9',
  [networks.telosTestnet]: 'EOS7YXUpe1EyMAqmuFWUheuMaJoVuY3qTD33WN4TrXbEt8xSKrdH9',
  [networks.eosMainnet]: []
}
const apiPublicKey = apiKeys[chainId]

const inviteApiKeys = {
  [networks.local]: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV',
  [networks.telosMainnet]: 'EOS87Wy26MWLJgQYPCzb8aRe9ezjXRDrigkKZMvhHJy27td5F7nZ5',
  [networks.telosTestnet]: 'EOS8PC16tnMUkUxeuQHWmEWkAtoz6GvvHVWnehk1HPQSYBV4ujT6v',
  [networks.eosMainnet]: []
}
const inviteApiKey = inviteApiKeys[chainId]


const payForCPUKeys = {
  [networks.local]: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV',
  [networks.telosMainnet]: 'EOS8gu3qzDsieAC7ni7o9vdKKnUjQXMEXN1NQNjFFs6M2u2kEyTvz',
  [networks.telosTestnet]: 'EOS8CE5iqFh5XNfJygGZjm7FtKRSLEHFHfioXF6VLmoQSAMSrzzXE',
  [networks.eosMainnet]: []
}

const payForCPUPublicKey = payForCPUKeys[chainId]

const applicationKeys = {
  [networks.local]: 'EOS7HXZn1yhQJAiHbUXeEnPTVHoZLgAScNNELAyvWxoqQJzcLbbjq',
  [networks.telosMainnet]: 'EOS7HXZn1yhQJAiHbUXeEnPTVHoZLgAScNNELAyvWxoqQJzcLbbjq',
  [networks.telosTestnet]: 'EOS7HXZn1yhQJAiHbUXeEnPTVHoZLgAScNNELAyvWxoqQJzcLbbjq',
  [networks.eosMainnet]: []
}
const applicationPublicKey = applicationKeys[chainId]

const exchangeKeys = {
  [networks.local]: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV', // normal dev key
  [networks.telosMainnet]: 'EOS75DmTxcnpvhjNekfKQzLrfwo44muPN6YPPX49vYPot4Qmo5cTo', 
  [networks.telosTestnet]: 'EOS8C9tXuPMkmB6EA7vDgGtzA99k1BN6UxjkGisC1QKpQ6YV7MFqm',
  [networks.eosMainnet]: []
}

const exchangePublicKey = exchangeKeys[chainId]

const freePublicKey = 'EOS8UAPG5qSWetotJjZizQKbXm8dkRF2BGFyZdub8GbeRbeXeDrt9'

const account = (accountName, quantity = '0.0000 SEEDS', pubkey = activePublicKey) => ({
  type: 'account',
  account: accountName,
  creator: owner,
  publicKey: pubkey,
  stakes: {
    cpu: '1.0000 TLOS',
    net: '1.0000 TLOS',
    ram: 10000
  },
  quantity
})

const contract = (accountName, contractName, quantity = '0.0000 SEEDS') => ({
  ...account(accountName, quantity),
  type: 'contract',
  name: contractName,
  stakes: {
    cpu: '1.0000 TLOS',
    net: '1.0000 TLOS',
    ram: 700000
  }
})

const testnetUserPubkey = "EOS8M3bWwv7jvDGpS2avYRiYh2BGJxt5VhfjXhbyAhFXmPtrSd591"

const token = (accountName, issuer, supply) => ({
  ...contract(accountName, 'token'),
  type: 'token',
  issuer,
  supply
})

const rgn = 'rgn'

const accountsMetadata = (network) => {
  if (network == networks.local) {
    return {
      owner: account(owner),
      rgn: account(rgn),
      firstuser: account('seedsuseraaa', '10000000.0000 SEEDS'),
      seconduser: account('seedsuserbbb', '10000000.0000 SEEDS'),
      thirduser: account('seedsuserccc', '5000000.0000 SEEDS'),
      fourthuser: account('seedsuserxxx', '10000000.0000 SEEDS'),
      fifthuser: account('seedsuseryyy', '10000000.0000 SEEDS'),
      sixthuser: account('seedsuserzzz', '5000.0000 SEEDS'),
      token: token('token.seeds', owner, '1500000000.0000 SEEDS'),
      testtoken: token('token.seeds', owner, '1500000000.0000 TESTS'),
      oswaps: contract('oswapper', 'oswaps')
    }
  } else if (network == networks.telosMainnet) {
    return {
      owner: account(owner),
      rgn: account(rgn),
    }
  } else if (network == networks.telosTestnet) {
    return {
      firstuser: account('seedsuseraaa', '10000000.0000 SEEDS'),
      seconduser: account('seedsuserbbb', '10000000.0000 SEEDS'),
      thirduser: account('seedsuserccc', '5000000.0000 SEEDS'),
      fourthuser: account('seedsuserxxx', '10000000.0000 SEEDS', testnetUserPubkey),
      fifthuser: account('seedsuseryyy', '10000000.0000 SEEDS', testnetUserPubkey),
      sixthuser: account('seedsuserzzz', '5000.0000 SEEDS', testnetUserPubkey),
      constitutionalGuardians: account('cg.seeds', '1.0000 SEEDS'),

      owner: account(owner),
      rgn: account(rgn),

    }
  } else if (network == networks.eosMainnet) {
    return {
      // EOS mainnet doesn't have most of the accounts
    }
  } else {
    throw new Error(`${network} deployment not supported`)
  }
}

const accounts = accountsMetadata(chainId)
const names = R.mapObjIndexed((item) => item.account, accounts)
const allContracts = []
const allContractNames = []
const allAccounts = []
for (let [key, value] of Object.entries(names)) {
  if (accounts[key].type=="contract" || accounts[key].type=="token") {
    allContracts.push(key)
    allContractNames.push(value)
  } else {
    if (value.indexOf(".seeds") != -1) {
      allAccounts.push(key)
    }
  }
}
allContracts.sort()
allContractNames.sort()
allAccounts.sort()

var permissions = [
]

const isTestnet = chainId == networks.telosTestnet
const isLocalNet = chainId == networks.local


const keyProviders = {
  [networks.local]: [process.env.LOCAL_PRIVATE_KEY, process.env.LOCAL_PRIVATE_KEY, process.env.APPLICATION_KEY],
  [networks.telosMainnet]: [
    process.env.TELOS_MAINNET_OWNER_KEY, 
    process.env.TELOS_MAINNET_HYPHA_OWNER_KEY, 
    process.env.TELOS_MAINNET_ACTIVE_KEY, 
    process.env.APPLICATION_KEY, 
    process.env.EXCHANGE_KEY,
    process.env.PAY_FOR_CPU_MAINNET_KEY,
    process.env.SCRIPT_KEY
  ],
  [networks.telosTestnet]: [
    process.env.TELOS_TESTNET_OWNER_KEY, 
    process.env.TELOS_TESTNET_HYPHA_ACTIVE_KEY, 
    process.env.TESTNET_NEWPAYMENT_KEY,
    process.env.TELOS_TESTNET_ACTIVE_KEY, 
    process.env.APPLICATION_KEY
  ],
  [networks.eosMainnet]: [
    process.env.EOS_MAINNET_ACTIVE_KEY, 
  ]

}

const keyProvider = keyProviders[chainId].filter((item) => item)


if (keyProvider.length == 0 || keyProvider[0] == null) {
  console.log("ERROR: Invalid Key Provider: "+JSON.stringify(keyProvider, null, 2))
}

const isLocal = () => { return chainId == networks.local }

const config = {
  keyProvider,
  httpEndpoint,
  chainId
}

const eos = new Eos(config, isLocal)

setTimeout(async ()=>{
  let info = await eos.getInfo({})
  if (info.chain_id != chainId) {
    console.error("Fix this by setting local chain ID to "+info.chain_id)
    console.error('Chain ID mismatch, signing will not work - \nactual Chain ID: "+info.chain_id + "\nexpected Chain ID: "+chainId')
    throw new Error("Chain ID mismatch")
  }
})

const getEOSWithEndpoint = (ep) => {
  const config = {
    keyProvider,
    httpEndpoint: ep,
    chainId
  }
  return new Eos(config, isLocal)
}

const getTableRows = eos.getTableRows

const getTelosBalance = async (user) => {
  const balance = await eos.getCurrencyBalance(names.tlostoken, user, 'TLOS')
  return Number.parseInt(balance[0])
}

const getBalance = async (user) => {
  const balance = await eos.getCurrencyBalance(names.token, user, 'SEEDS')
  return Number.parseInt(balance[0])
}

const getBalanceFloat = async (user) => {
  const balance = await eos.getCurrencyBalance(names.token, user, 'SEEDS')
  var float = parseInt(Math.round(parseFloat(balance[0]) * 10000)) / 10000.0;

  return float;
}

const initContracts = (accounts) =>
  Promise.all(
    Object.values(accounts).map(
      account => eos.contract(account)
    )
  ).then(
    contracts => Object.assign({}, ...Object.keys(accounts).map(
      (account, index) => ({
        [account]: contracts[index]
      })
    ))
  )
  
const ecc = require('eosjs-ecc')
const sha256 = ecc.sha256

const ramdom64ByteHexString = async () => {
  let privateKey = await ecc.randomKey()
  const encoded = Buffer.from(privateKey).toString('hex').substring(0, 64); 
  return encoded
}
const fromHexString = hexString => new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

const createKeypair = async () => {
  let private = await ecc.randomKey()
  let public = await Eos.getEcc().privateToPublic(private)
  return{ private, public }
}

const sleep = async (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function asset (quantity) {
  if (typeof quantity == 'object') {
    if (quantity.symbol) {
      return quantity
    }
    return null
  }
  const [amount, symbol] = quantity.split(' ')
  const indexDecimal = amount.indexOf('.')
  const precision = amount.substring(indexDecimal + 1).length
  return {
    amount: parseFloat(amount),
    symbol,
    precision,
    toString: quantity
  }
}

const sendTransaction = async (actions) => {
  return await eos.transaction({
    actions
  })
} 

module.exports = {
  keyProvider, httpEndpoint,
  eos, getEOSWithEndpoint, getBalance, getBalanceFloat, getTableRows, initContracts,
  accounts, names, ownerPublicKey, activePublicKey, apiPublicKey, permissions, sha256, isLocal, ramdom64ByteHexString, createKeypair,
  testnetUserPubkey, getTelosBalance, fromHexString, allContractNames, allContracts, sleep, asset, isTestnet,
  sendTransaction
}
