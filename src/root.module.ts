import { DynamicModule } from '@nestjs/common';
import { RedistributedModuleConfigs } from './types';
import { REDISTRIBUTED_CONFIGS } from './redistributed.constants';

export class RedistributedModule {
  private static configs: RedistributedModuleConfigs;

  static forRoot(configs: RedistributedModuleConfigs): DynamicModule {
    this.configs = configs;
    return {
      global: true,
      module: RedistributedModule,
      providers: [
        {
          provide: REDISTRIBUTED_CONFIGS,
          useValue: configs
        }
      ]
    };
  }
}
