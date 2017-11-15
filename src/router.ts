import { SoilMoistureRoutes } from './soil-moisture/soil-moisture.routes';

/**
 * Router
 */
export function Router(server) {
  const soilMoistureRoutes = new SoilMoistureRoutes();

  server.register([
    soilMoistureRoutes.initRoutes
  ]);  
};
