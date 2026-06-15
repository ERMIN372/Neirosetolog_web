// Server-side proxy for fal.ai.
// Keeps your FAL_KEY on the server — the browser talks to this route, never to fal directly.
// Docs: https://docs.fal.ai/model-apis/integrations/nextjs
import { route } from "@fal-ai/server-proxy/nextjs";

export const { GET, POST, PUT } = route;

// Generation can take a while — give the serverless function room to stream queue updates.
export const maxDuration = 300;
export const dynamic = "force-dynamic";
