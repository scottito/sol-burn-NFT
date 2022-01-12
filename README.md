This project uses modified code from Metaplex's FairLaunch program (https://github.com/metaplex-foundation/metaplex/blob/master/js/packages/cli/src/fair-launch-cli.ts)

##Usage##
1.) Clone repository
2.) Run `yarn` to install dependencies
3.) Save the keypair of the wallet with tokens you want to burn to your device
4.) Run `ts-node ./src/sol-burn-NFT.ts burn_NFTs -e <Solana cluster name (default devnet)> -k <filepath of wallet keypair> -m <mint ID of token to burn>`
