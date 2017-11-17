import * as fastify from 'fastify';

import { SoilMoistureRoutes } from './soil-moisture/soil-moisture.routes';
import { DataProcessingRoutes } from './data-processing/data-processing.routes';

/**
 * Router
 * 
 * @export
 * @param {fastify.FastifyInstance} server 
 */
export function Router(server: fastify.FastifyInstance): void {
  const dataProcessingRoutes = new DataProcessingRoutes();
  const soilMoistureRoutes = new SoilMoistureRoutes();

  server.register([
    dataProcessingRoutes.initRoutes,
    soilMoistureRoutes.initRoutes
  ]);  
};
