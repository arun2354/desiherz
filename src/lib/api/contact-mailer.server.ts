import process from "node:process";
import { randomUUID } from "node:crypto";
import tls from "node:tls";

type ContactMessage = {
  name: string;
  email: string;
  note: string;
  locale: "en" | "de";
};

type SmtpResponse = { code: number; text: string };

class SmtpSession {
  private buffer = "";
  private responseLines: string[] = [];
  private queued: SmtpResponse[] = [];
  private waiting: Array<{
    resolve: (response: SmtpResponse) => void;
    reject: (error: Error) => void;
  }> = [];

  constructor(private socket: tls.TLSSocket) {
    socket.on("data", (chunk) => this.handleData(chunk.toString("utf8")));
    socket.on("error", (error) => this.rejectAll(error));
    socket.on("timeout", () => this.rejectAll(new Error("IONOS SMTP timed out")));
  }

  private handleData(chunk: string) {
    this.buffer += chunk;
    const lines = this.buffer.split(/\r?\n/);
    this.buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line) continue;
      this.responseLines.push(line);
      if (/^\d{3} /.test(line)) {
        const response = {
          code: Number(line.slice(0, 3)),
          text: this.responseLines.join("\n"),
        };
        this.responseLines = [];
        const waiter = this.waiting.shift();
        if (waiter) waiter.resolve(response);
        else this.queued.push(response);
      }
    }
  }

  private rejectAll(error: Error) {
    for (const waiter of this.waiting.splice(0)) waiter.reject(error);
  }

  read() {
    const queued = this.queued.shift();
    if (queued) return Promise.resolve(queued);
    return new Promise<SmtpResponse>((resolve, reject) => {
      this.waiting.push({ resolve, reject });
    });
  }

  async command(command: string | undefined, expectedCodes: number[]) {
    if (command) this.socket.write(`${command}\r\n`);
    const response = await this.read();
    if (!expectedCodes.includes(response.code)) {
      throw new Error(`IONOS SMTP rejected a request (${response.code})`);
    }
    return response;
  }
}

const encodeHeader = (value: string) =>
  `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;

const wrapBase64 = (value: string) =>
  Buffer.from(value, "utf8")
    .toString("base64")
    .match(/.{1,76}/g)
    ?.join("\r\n") ?? "";

function connectSecurely(host: string, port: number) {
  return new Promise<tls.TLSSocket>((resolve, reject) => {
    const socket = tls.connect({
      host,
      port,
      servername: host,
      rejectUnauthorized: true,
    });
    socket.setTimeout(20_000);
    socket.once("secureConnect", () => resolve(socket));
    socket.once("error", reject);
  });
}

export async function sendContactEmail(message: ContactMessage) {
  const user = process.env.IONOS_SMTP_USER;
  const password = process.env.IONOS_SMTP_PASSWORD;
  const recipient = process.env.CONTACT_EMAIL || user || "hello@desiherz.de";

  if (!user || !password) {
    throw new Error("Contact email delivery is not configured");
  }

  const subject =
    message.locale === "de"
      ? `Private Anfrage von ${message.name}`
      : `Private enquiry from ${message.name}`;
  const body = `${message.note}\n\n— ${message.name} (${message.email})`;
  const host = process.env.IONOS_SMTP_HOST || "smtp.ionos.de";
  const port = Number(process.env.IONOS_SMTP_PORT || 465);
  const messageId = `<${randomUUID()}@desiherz.de>`;
  const socket = await connectSecurely(host, port);
  const smtp = new SmtpSession(socket);

  try {
    await smtp.command(undefined, [220]);
    await smtp.command("EHLO desiherz.de", [250]);
    await smtp.command("AUTH LOGIN", [334]);
    await smtp.command(Buffer.from(user).toString("base64"), [334]);
    await smtp.command(Buffer.from(password).toString("base64"), [235]);
    await smtp.command(`MAIL FROM:<${user}>`, [250]);
    await smtp.command(`RCPT TO:<${recipient}>`, [250, 251]);
    await smtp.command("DATA", [354]);

    const email = [
      `From: DesiHerz Website <${user}>`,
      `To: ${recipient}`,
      `Reply-To: ${message.email}`,
      `Subject: ${encodeHeader(subject)}`,
      `Date: ${new Date().toUTCString()}`,
      `Message-ID: ${messageId}`,
      "MIME-Version: 1.0",
      'Content-Type: text/plain; charset="UTF-8"',
      "Content-Transfer-Encoding: base64",
      "",
      wrapBase64(body),
    ].join("\r\n");

    socket.write(`${email}\r\n.\r\n`);
    const accepted = await smtp.command(undefined, [250]);
    console.info(`[contact-mail] IONOS accepted ${messageId}: ${accepted.text.replace(/\s+/g, " ")}`);
    await smtp.command("QUIT", [221]);
  } finally {
    socket.end();
  }
}
