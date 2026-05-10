import { Header } from "@/components/header";
import { DocsSidebar } from "@/components/docs-sidebar";
import { Footer } from "@/components/footer";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			<div className="flex pt-16 min-h-screen">
				<DocsSidebar />
				<main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="docs-content">{children}</div>
				</main>
			</div>
			<Footer />
		</>
	);
}
