import { getOptions, postOptions} from './soil-moisture.options';
import { SoilMoistureController } from './soil-moisture.controller';

export class SoilMoistureRoutes {
  initRoutes(server, opts, next) {
    const soilMoistureController = new SoilMoistureController();

    // server.decorate('utility', () => {});
    server.get('/soil-moisture', getOptions, soilMoistureController.get);
    server.post('/soil-moisture', postOptions, soilMoistureController.post);
  
    next();
  }
}