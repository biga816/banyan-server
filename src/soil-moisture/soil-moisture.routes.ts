import * as fastify from 'fastify';

import { getOptions, postOptions} from './soil-moisture.options';
import { SoilMoistureController } from './soil-moisture.controller';
import { IRoutes } from '../common/interfaces/routes.interface';

/**
 * 
 * 
 * @export
 * @class SoilMoistureRoutes
 * @implements {IRoutes}
 */
export class SoilMoistureRoutes implements IRoutes {
  initRoutes(server: fastify.FastifyInstance, opts: fastify.RouteShorthandOptions, next: any): void  {
    const soilMoistureController = new SoilMoistureController();

    server.get('/soil-moisture', getOptions, soilMoistureController.getSoilMoistureHandler);
    server.post('/soil-moisture', postOptions, soilMoistureController.postSoilMoistureHandler);
  
    next();
  }
}