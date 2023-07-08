import { Redis } from "@upstash/redis";
const kv = Redis.fromEnv();

export const config = {
    runtime: 'edge',
}

export default async function handler(req: Request) {
    const url = new URL(req.url);
    const user = String(url.searchParams.get("userid"))
    const data = await kv.get(user);
    await kv.del(user);
    return new Response(
        data ? JSON.stringify(data) : null,
        {
            status: data ? 200 : 204,
            headers: {
                'content-type': 'application/json',
            },
        }
    )
}
