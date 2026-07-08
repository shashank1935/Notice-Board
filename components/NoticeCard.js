import { useState } from "react";
import Link from "next/link";

const CATEGORY_STYLES = {
  Exam: "bg-[#eef1fb] text-[#33449e]",
  Event: "bg-[#fdf3e7] text-[#8a5a1e]",
  General: "bg-[var(--accent-soft)] text-[var(--accent)]",
};

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NoticeCard({ notice, onDeleted }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const isUrgent = notice.priority === "Urgent";

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/notices/${notice.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        throw new Error("Delete failed");
      }
      onDeleted(notice.id);
    } catch (err) {
      setError("Couldn't delete this notice. Try again.");
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <div
      className={`relative rounded-xl border bg-[var(--card)] shadow-sm flex flex-col overflow-hidden transition hover:shadow-md ${
        isUrgent ? "border-[var(--urgent)]/40" : "border-[var(--line)]"
      }`}
    >
      {notice.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.image}
          alt=""
          className="w-full h-36 object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug text-[var(--ink)] break-words">
            {notice.title}
          </h3>
          {isUrgent && (
            <span className="shrink-0 rounded-full bg-[var(--urgent-soft)] text-[var(--urgent)] text-xs font-bold px-2.5 py-1 tracking-wide">
              URGENT
            </span>
          )}
        </div>

        <p className="text-sm text-[var(--ink)]/80 whitespace-pre-wrap break-words line-clamp-4">
          {notice.body}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-auto pt-2">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              CATEGORY_STYLES[notice.category] || CATEGORY_STYLES.General
            }`}
          >
            {notice.category}
          </span>
          <span className="text-xs text-[var(--ink)]/50">{formatDate(notice.publishDate)}</span>
        </div>

        {error && <p className="text-xs text-[var(--urgent)]">{error}</p>}

        <div className="flex items-center gap-2 pt-2 border-t border-[var(--line)]">
          <Link
            href={`/notices/${notice.id}/edit`}
            className="flex-1 text-center text-sm font-medium rounded-lg py-2 border border-[var(--line)] hover:bg-[var(--paper)] transition"
          >
            Edit
          </Link>

          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="flex-1 text-center text-sm font-medium rounded-lg py-2 border border-[var(--urgent)]/30 text-[var(--urgent)] hover:bg-[var(--urgent-soft)] transition"
            >
              Delete
            </button>
          ) : (
            <div className="flex-1 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 text-xs font-semibold rounded-lg py-2 bg-[var(--urgent)] text-white hover:opacity-90 transition disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Confirm"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={deleting}
                className="flex-1 text-xs font-semibold rounded-lg py-2 border border-[var(--line)] hover:bg-[var(--paper)] transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
