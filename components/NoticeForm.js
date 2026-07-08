import { useState } from "react";
import { useRouter } from "next/router";

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function NoticeForm({ initialNotice, noticeId }) {
  const router = useRouter();
  const isEdit = Boolean(noticeId);

  const [form, setForm] = useState({
    title: initialNotice?.title || "",
    body: initialNotice?.body || "",
    category: initialNotice?.category || "General",
    priority: initialNotice?.priority || "Normal",
    publishDate: toDateInputValue(initialNotice?.publishDate) || toDateInputValue(new Date()),
    image: initialNotice?.image || "",
  });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);

    try {
      const res = await fetch(isEdit ? `/api/notices/${noticeId}` : "/api/notices", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrors(data.errors || [data.error || "Something went wrong."]);
        setSubmitting(false);
        return;
      }

      router.push("/");
    } catch (err) {
      setErrors(["Network error. Please try again."]);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      {errors.length > 0 && (
        <div className="rounded-lg border border-[var(--urgent)]/30 bg-[var(--urgent-soft)] p-3">
          <ul className="text-sm text-[var(--urgent)] list-disc list-inside">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          Title <span className="text-[var(--urgent)]">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
          maxLength={200}
          className="rounded-lg border border-[var(--line)] px-3 py-2 bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          placeholder="e.g. Mid-semester exam schedule released"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="body" className="text-sm font-medium">
          Body <span className="text-[var(--urgent)]">*</span>
        </label>
        <textarea
          id="body"
          value={form.body}
          onChange={(e) => update("body", e.target.value)}
          required
          rows={5}
          className="rounded-lg border border-[var(--line)] px-3 py-2 bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y"
          placeholder="Full details of the notice..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            className="rounded-lg border border-[var(--line)] px-3 py-2 bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
            <option value="General">General</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="priority" className="text-sm font-medium">
            Priority
          </label>
          <select
            id="priority"
            value={form.priority}
            onChange={(e) => update("priority", e.target.value)}
            className="rounded-lg border border-[var(--line)] px-3 py-2 bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          >
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="publishDate" className="text-sm font-medium">
          Publish date <span className="text-[var(--urgent)]">*</span>
        </label>
        <input
          id="publishDate"
          type="date"
          value={form.publishDate}
          onChange={(e) => update("publishDate", e.target.value)}
          required
          className="rounded-lg border border-[var(--line)] px-3 py-2 bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="image" className="text-sm font-medium">
          Image URL <span className="text-[var(--ink)]/40 font-normal">(optional)</span>
        </label>
        <input
          id="image"
          type="url"
          value={form.image}
          onChange={(e) => update("image", e.target.value)}
          className="rounded-lg border border-[var(--line)] px-3 py-2 bg-[var(--card)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          placeholder="https://example.com/image.jpg"
        />
        <p className="text-xs text-[var(--ink)]/50">
          Paste a link to an image to show it on the notice card.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-[var(--accent)] text-white px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition disabled:opacity-60"
        >
          {submitting ? "Saving..." : isEdit ? "Save changes" : "Create notice"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-lg px-5 py-2.5 text-sm font-medium border border-[var(--line)] hover:bg-[var(--paper)] transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
