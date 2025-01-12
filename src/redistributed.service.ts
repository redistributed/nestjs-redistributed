import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { RedistributedModuleConfigs } from "./types";
import { DEFAULT_PREFIX_KEY, DEFAULT_TIMEOUT, REDISTRIBUTED_CONFIGS } from "./redistributed.constants";
import Redis, { RedisOptions } from "ioredis";
import { randomUUID } from "crypto";
import getLocalIp from "./utils/getLocalIp";
@Injectable()
export class RedistributedService implements OnModuleInit {
    constructor(
        @Inject(REDISTRIBUTED_CONFIGS) private configs: RedistributedModuleConfigs,
    ) { }

    private redisClient: Redis;
    private timeout: number = this.configs.timeout || DEFAULT_TIMEOUT
    private prefix: string = this.configs.prefix || DEFAULT_PREFIX_KEY
    private hostId: string = `${randomUUID()}_${getLocalIp()[0]}`;

    onModuleInit() {
        this.connectToRedis()
        this.updateHostStatus()
    }

    /**
     * Connect to Redis instance based on provided connection parameter.
     * If the parameter is a string or number, it will be used as the URL of the Redis server.
     * If the parameter is an instance of Redis, it will be used directly.
     * If the parameter is an object, it will be used as the RedisOptions to create a new Redis instance.
     */
    private connectToRedis() {
        if (typeof this.configs.connection === 'string' || typeof this.configs.connection === 'number') {
            this.redisClient = new Redis(this.configs.connection);
        } else if (this.configs.connection instanceof Redis) {
            this.redisClient = this.configs.connection;
        } else {
            this.redisClient = new Redis(this.configs.connection as RedisOptions);
        }
    }

    /**
     * Updates the host status in Redis by setting a key with the name of
     * `${this.prefix}:status:${this.hostId}` to 'OK' with a TTL of `this.timeout`.
     * This is done in an interval with a period of `this.timeout` to ensure the
     * status is updated every `this.timeout` milliseconds.
     */
    private updateHostStatus(): void {
        setInterval(() => {
            this.redisClient.set(`${this.prefix}:status:${this.hostId}`, 'OK', 'EX', this.timeout);
        }, this.timeout)
    }
}
