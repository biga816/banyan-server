import { getOptions, postOptions} from './soil-moisture.options';
import { SoilMoistureController } from './soil-moisture.controller';
import { IRoutes } from '../common/interfaces/routes.interface';

export class SoilMoistureRoutes　implements　IRoutes {
  initRoutes(server, opts, next): void  {
    const soilMoistureController = new SoilMoistureController();

    // server.decorate('utility', () => {});
    server.get('/soil-moisture', getOptions, soilMoistureController.getSoilMoistureHandler);
    server.post('/soil-moisture', postOptions, soilMoistureController.postSoilMoistureHandler);
  
    next();
  }
}