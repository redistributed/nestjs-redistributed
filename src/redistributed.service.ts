import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { RedistributedModuleConfigs } from "./types";
import { REDISTRIBUTED_CONFIGS } from "./redistributed.constants";
import Redis, { RedisOptions } from "ioredis";

@Injectable()
export class RedistributedService implements OnModuleInit {
    constructor(
        @Inject(REDISTRIBUTED_CONFIGS) private configs: RedistributedModuleConfigs,
    ) { }

    private redisClient: Redis;

    onModuleInit() {
        this.connectToRedis()
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
}
