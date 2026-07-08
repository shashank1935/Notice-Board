import Head from "next/head";
import Link from "next/link";
import NoticeForm from "../../../components/NoticeForm";
import { prisma } from "../../../lib/prisma";

export async function getServerSideProps({ params }) {
  const id = Number(params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id } });

  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      notice: JSON.parse(JSON.stringify(notice)),
    },
  };
}

export default function EditNotice({ notice }) {
  return (
    <>
      <Head>
        <title>Edit notice · Notice Board</title>
      </Head>
      <main className="min-h-screen bg-[var(--paper)]">
        <header className="border-b border-[var(--line)] bg-[var(--card)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
            <Link href="/" className="text-sm text-[var(--accent)] font-medium hover:underline">
              ← Back to notices
            </Link>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] mt-2">
              Edit notice
            </h1>
          </div>
        </header>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <NoticeForm initialNotice={notice} noticeId={notice.id} />
        </div>
      </main>
    </>
  );
}
