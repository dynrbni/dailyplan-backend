import { Context } from "elysia";

declare module "elysia" {
    interface Context {
        jwt: {
            sign: (payload: any) => Promise<string>;
            verify: (token: string) => Promise<any>;
        };
        user?: any;
        headers: Record<string, string>;
    }
}
