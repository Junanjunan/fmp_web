import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Home</h1>
      <ul>
        <li><Link href="/symbols">Symbols</Link></li>
        <li><Link href="/analysis">Analysis</Link></li>
        <li><Link href="/analysis-volume">Analysis Volume</Link></li>
      </ul>
    </main>
  );
}
