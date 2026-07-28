import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  note: z.string().trim().min(1).max(2_000),
  locale: z.enum(["en", "de"]),
  company: z.string().max(0).optional(),
});

export const sendContactEnquiry = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(async ({ data }) => {
    if (data.company) return { success: true };

    const { sendContactEmail } = await import("./contact-mailer.server");
    await sendContactEmail(data);
    return { success: true };
  });
