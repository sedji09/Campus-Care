import { Figtree } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";
import { SessionProvider } from "next-auth/react";

const figtree = Figtree({
	variable: "--font-figtree",
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {

	return (
		<html lang="en" suppressHydrationWarning>
			<body
				suppressHydrationWarning
				className={`${figtree.variable} antialiased h-dvh overflow-hidden`}
			>
				<SessionProvider> 
				{children}
				</SessionProvider> 
				<Toaster
					position="top-right"
					richColors={true}
					closeButton={false}
				/>
			</body>
		</html>
	)
}