import { getOptions,} from './data-processing.options';
import { DataProcessingController } from './data-processing.controller';
import { IRoutes } from '../common/interfaces/routes.interface';

export class DataProcessingRoutes　implements　IRoutes {
  initRoutes(server, opts, next): void  {
    const dataProcessingController = new DataProcessingController();

    server.get('/data-processing', getOptions, dataProcessingController.getDataProcessingHandler);
  
    next();
  }
}