import { Redis } from "@upstash/redis";
const kv = Redis.fromEnv();

export const config = {
    runtime: "edge",
};

export default async function handler(req: Request) {
    const data = await req.json()
    await kv.set(data.gt_user, JSON.stringify(data))
    return new Response(
        "OK",
        {
            status: 201,
            headers: {
                "content-type": "text/plain; charset=utf-8",
            },
        }
    );
}
