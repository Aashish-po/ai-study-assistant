import { createApp } from "../server/_core/app";
import type { IncomingMessage, ServerResponse } from "http";

export const config = {
  api: {
    bodyParser: false,
  },
};

const app = createApp();

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return app(req as any, res as any);
}
