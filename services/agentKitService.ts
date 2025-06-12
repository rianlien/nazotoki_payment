// nazotoki_payment/services/agentKitService.ts
'use client';
import { parseUnits } from 'viem';
// **ここにCoinbase AgentKitのSDKのインポートと初期化を追加します**
// 仮に `@/lib/agentkit` エイリアスでエクスポートされていると想定します。
// その他のAgentKit関連のファイルが削除されているため、以下のように修正する必要があります。
// CLIが生成したプロジェクトには `src/lib/agentkit.ts` のようなファイルがないため、
// agentkitパッケージ自体をここで直接インポートして初期化します。

import { AgentKit } from '@coinbase/agentkit'; // package.jsonで0.8.0を確認済み

// AgentKitのAPIキーは.envから読み込み
const agentKit = new AgentKit({
  apiKey: process.env.AGENTKIT_API_KEY!, // AGENTKIT_API_KEY または COINBASE_CLOUD_API_KEY など
  network: 'sepolia', // Sepoliaテストネットを指定
});

const USDC_CONTRACT_ADDRESS_SEPOLIA = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS_SEPOLIA;

export const sendUsdc = async (recipientAddress: string, amount: string): Promise<string> => {
  if (!recipientAddress || !amount) { throw new Error('送金先アドレスと金額が必要です。'); }
  if (!USDC_CONTRACT_ADDRESS_SEPOLIA) { throw new Error('USDCコントラクトアドレスが設定されていません。`.env` を確認してください。'); }

  try {
    const amountBigInt = parseUnits(amount, 6); // USDCは6decimals

    // Coinbase AgentKitの実際の送金APIの呼び出しに置き換えます。
    // AgentKit SDKの `sendTransaction` または `transferToken` メソッドを使用します。
    // AgentKit SDKのドキュメントを確認し、適切なメソッドを呼び出してください。
    // 以下はsendTransactionの例です。
    const transactionResult = await agentKit.sendTransaction({
      to: USDC_CONTRACT_ADDRESS_SEPOLIA, // USDCコントラクト自体が対象
      data: agentKit.encodeFunctionData({ // ERC-20 transfer関数のデータをエンコード
        abi: [
          {
            inputs: [ { name: '_to', type: 'address' }, { name: '_value', type: 'uint256' } ],
            name: 'transfer',
            outputs: [{ name: '', type: 'bool' }],
            stateMutability: 'nonpayable',
            type: 'function'
          }
        ],
        functionName: 'transfer',
        args: [recipientAddress, amountBigInt]
      }),
      value: '0', // ERC-20転送なのでETHのvalueは0
      chain: 'sepolia', // チェーン名を指定
    });

    console.log('USDC 送金トランザクション結果:', transactionResult);
    return transactionResult.transactionHash;
  } catch (error) {
    console.error('USDC 送金に失敗しました:', error);
    throw error;
  }
};