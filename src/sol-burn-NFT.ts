import * as fs from 'fs';
import { program } from 'commander';
import * as anchor from '@project-serum/anchor';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Token, MintLayout } from '@solana/spl-token';
import {
  CACHE_PATH,
  TOKEN_METADATA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '../helpers/constants';
import {
  loadWalletKey,
  loadFairLaunchProgram,
  getTokenMint,
  getTreasury,
  getAtaForMint,
  getMetadata,
  getParticipationMint,
  getParticipationToken,
  getMasterEdition,
  getEditionMarkPda,
} from '../helpers/accounts';
import { chunks, getMultipleAccounts, sleep } from '../helpers/various';
import { createAssociatedTokenAccountInstruction } from '../helpers/instructions';
import { sendTransactionWithRetryWithKeypair } from '../helpers/transactions';

program
  .command('burn_NFTs')
  .option(
    '-e, --env <string>',
    'Solana cluster env name',
    'devnet', //mainnet-beta, testnet, devnet
  )
  .option(
    '-k, --keypair <path>',
    `Solana wallet location`,
    '--keypair not provided',
  )
 // .option('-m, --mint-key <string>', ' mint id')
  .option('-n, --number <string>', 'number to burn')
  .action(async (_, cmd) => {
    const { env, keypair, mintKey, number } = cmd.opts();

  
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await loadFairLaunchProgram(walletKeyPair, env);
    const walrusMint = new anchor.web3.PublicKey(mintKey);
 
    console.log("variables set")

    const myTokenAccount = (
      await getAtaForMint(
        //@ts-ignore
        walrusMint,
        walletKeyPair.publicKey,
      )
    )[0];

    const instructions = [
      Token.createBurnInstruction(
        TOKEN_PROGRAM_ID,
        //@ts-ignore
        walrusMint,
        myTokenAccount,
        walletKeyPair.publicKey,
        [],
        1,
      ),
    ];

    let txid = await sendTransactionWithRetryWithKeypair(
      anchorProgram.provider.connection,
      walletKeyPair,
      instructions,
      [],
      'single',
    );

    console.log(txid)

    console.log(
      `Burned ${1} tokens in account ${myTokenAccount.toBase58()}.`,
    );
  });