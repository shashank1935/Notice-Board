import Head from "next/head";
import Link from "next/link";
import NoticeForm from "../../components/NoticeForm";

export default function NewNotice() {
  return (
    <>
      <Head>
        <title>New notice · Notice Board</title>
      </Head>
      <main className="min-h-screen bg-[var(--paper)]">
        <header className="border-b border-[var(--line)] bg-[var(--card)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            <Link href="/" className="text-sm text-[var(--accent)] font-medium hover:underline">
              ← Back to notices
            </Link>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] mt-2">
              New notice
            </h1>
          </div>
        </header>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <NoticeForm />
        </div>
      </main>
    </>
  );
}
