import { prisma } from "../../../lib/prisma";
import { validateNotice } from "../../../lib/validateNotice";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Urgent notices always float to the top of the list. This works
      // because the Priority enum is declared as [Normal, Urgent] in
      // schema.prisma, so MySQL's native enum ordering ranks Urgent
      // higher than Normal, and priority: "desc" puts Urgent first.
      // Within a priority group, the newest publishDate comes first.
      // All ordering happens in this Prisma query - never in the browser.
      const notices = await prisma.notice.findMany({
        orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
      });
      return res.status(200).json(notices);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch notices." });
    }
  }

  if (req.method === "POST") {
    const result = validateNotice(req.body || {});
    if (!result.valid) {
      return res.status(400).json({ errors: result.errors });
    }
    try {
      const notice = await prisma.notice.create({ data: result.data });
      return res.status(201).json(notice);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create notice." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
