import * as fastify from 'fastify';

import { getOptions,} from './data-processing.options';
import { DataProcessingController } from './data-processing.controller';
import { IRoutes } from '../common/interfaces/routes.interface';

/**
 * 
 * 
 * @export
 * @class DataProcessingRoutes
 * @implements {IRoutes}
 */
export class DataProcessingRoutes implements IRoutes {
  initRoutes(server: fastify.FastifyInstance, opts: fastify.RouteShorthandOptions, next: any): void  {
    const dataProcessingController = new DataProcessingController();

    server.get('/data-processing', getOptions, dataProcessingController.getDataProcessingHandler);
  
    next();
  }
}