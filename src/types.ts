import Redis from "ioredis";
export type RedistributedModuleConfigs = {
    connection?: Redis,
    prefix?: string,
    timeout?: number,
    isMaster?: boolean,
};