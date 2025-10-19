import type { Data } from "./+data";
import { About, Footer, Header, Links, Skills } from "./components/index.tsx";
import { ScrapboxPages } from "./components/ScrapboxPages.tsx";

export default function Page({ data }: { data: Data }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <About />
        <Skills />
        <Links scrapboxContent={<ScrapboxPages data={data.scrapboxData} />} />
      </main>

      <Footer />
    </div>
  );
}
