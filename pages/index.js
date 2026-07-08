import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import NoticeCard from "../components/NoticeCard";
import { prisma } from "../lib/prisma";

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
  });

  return {
    props: {
      initialNotices: JSON.parse(JSON.stringify(notices)),
    },
  };
}

export default function Home({ initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);

  useEffect(() => {
    setNotices(initialNotices);
  }, [initialNotices]);

  function handleDeleted(id) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <>
      <Head>
        <title>Notice Board</title>
      </Head>

      <main className="min-h-screen bg-[var(--paper)]">
        <header className="border-b border-[var(--line)] bg-[var(--card)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--accent)] font-semibold">
                Reno Platforms
              </p>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)]">
                Notice Board
              </h1>
            </div>
            <Link
              href="/notices/new"
              className="shrink-0 rounded-lg bg-[var(--accent)] text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition"
            >
              + New notice
            </Link>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {notices.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[var(--line)] rounded-xl">
              <p className="text-[var(--ink)]/60 mb-4">No notices yet.</p>
              <Link
                href="/notices/new"
                className="inline-block rounded-lg bg-[var(--accent)] text-white px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition"
              >
                Post the first notice
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {notices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} onDeleted={handleDeleted} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
