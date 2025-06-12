// nazotoki_payment/app/layout.tsx
'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from '@wagmi/connectors'; // <-- ここが変更点: injected 関数をインポート

const inter = Inter({ subsets: ['latin'] });

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!),
  },
  connectors: [
    injected(), // <-- ここが変更点: new を外し、関数として呼び出す
  ],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <WagmiProvider config={config}>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </WagmiProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}