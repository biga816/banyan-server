import { SoilMoistureRoutes } from './soil-moisture/soil-moisture.routes';
import { DataProcessingRoutes } from './data-processing/data-processing.routes';

/**
 * Router
 */
export function Router(server) {
  const dataProcessingRoutes = new DataProcessingRoutes();
  const soilMoistureRoutes = new SoilMoistureRoutes();

  server.register([
    dataProcessingRoutes.initRoutes,
    soilMoistureRoutes.initRoutes
  ]);  
};
