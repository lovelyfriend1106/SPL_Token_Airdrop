import { decode } from "bs58";
import csv from "csv-parser";
import { createReadStream } from "fs";
import {
  Connection,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
  Keypair,
  ComputeBudgetProgram,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from "@solana/spl-token";

const getAddress = () => {
  return new Promise((resolve, reject) => {
    const results: any = [];
    createReadStream("./1.csv") // Update the file path to 'wallet.csv'
      .pipe(csv())
      .on("data", (data) => {
        const [walletAddress, amount] = data["Sender;Quantity"].split(";");
        results.push({ walletAddress, amount: parseInt(amount) });
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

const sendRazeTokens = async () => {
  const connection = new Connection(clusterApiUrl("mainnet-beta"), {
    commitment: "confirmed",
  });
  const feePayer = Keypair.fromSecretKey(decode(process.env.PRIVATE_KEY || ""));
  const mintPubkey = new PublicKey(
    process.env.TOKEN_MINT_PUBLIC_KEY || ""
  );
  const walletListArray: any = await getAddress();
  const toTokenAccountList = [];
  const PRIORITY_RATE = 1000000; // MICRO_LAMPORTS
  const PRIORITY_FEE_INSTRUCTIONS = ComputeBudgetProgram.setComputeUnitPrice({
    microLamports: PRIORITY_RATE,
  });
    for (let i = 0; i < walletListArray.length; i++) {
      const receiveAddress = new PublicKey(walletListArray[i].walletAddress);
      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        feePayer,
        mintPubkey,
        receiveAddress
      );
      console.log("i------->", i);
      toTokenAccountList.push(toTokenAccount);
    }
    const sourceAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      feePayer,
      mintPubkey,
      feePayer.publicKey
    );
    const instructions = [];

    for (let i = 0; i < toTokenAccountList.length; i++) {
      const transferAmountInDecimals =
        walletListArray[i].amount * Math.pow(10, 14);
      const transferInstruction = createTransferInstruction(
        sourceAccount.address,
        toTokenAccountList[i].address,
        feePayer.publicKey,
        transferAmountInDecimals
      );
      instructions.push(transferInstruction);
    }

    const latestBlockhash = await connection.getLatestBlockhash("confirmed");
    const messageV0 = new TransactionMessage({
      payerKey: feePayer.publicKey,
      recentBlockhash: latestBlockhash.blockhash,
      instructions: [PRIORITY_FEE_INSTRUCTIONS, ...instructions],
    }).compileToV0Message();
    const versionedTransaction = new VersionedTransaction(messageV0);
    versionedTransaction.sign([feePayer]);
    const txid = await connection.sendTransaction(versionedTransaction, {
      maxRetries: 20,
    });
    console.log(`Transaction Bundle Submitted : ${txid}`);
    await new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
};

export default sendRazeTokens;
