const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

/**
 * Validates and normalizes incoming notice data on the server.
 * Returns { valid: true, data } or { valid: false, errors }.
 */
export function validateNotice(body) {
  const errors = [];
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const noticeBody = typeof body.body === "string" ? body.body.trim() : "";
  const category = body.category;
  const priority = body.priority;
  const publishDateRaw = body.publishDate;
  const image = typeof body.image === "string" ? body.image.trim() : null;

  if (!title) errors.push("Title is required.");
  if (title.length > 200) errors.push("Title must be 200 characters or fewer.");

  if (!noticeBody) errors.push("Body is required.");

  if (!CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${CATEGORIES.join(", ")}.`);
  }

  if (!PRIORITIES.includes(priority)) {
    errors.push(`Priority must be one of: ${PRIORITIES.join(", ")}.`);
  }

  let publishDate = null;
  if (!publishDateRaw) {
    errors.push("Publish date is required.");
  } else {
    const parsed = new Date(publishDateRaw);
    if (isNaN(parsed.getTime())) {
      errors.push("Publish date must be a valid date.");
    } else {
      publishDate = parsed;
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      title,
      body: noticeBody,
      category,
      priority,
      publishDate,
      image: image || null,
    },
  };
}
