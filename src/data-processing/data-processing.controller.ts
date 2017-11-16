// libs
import * as fs from 'fs';

// services
import { DataProcessingService } from './data-processing.service';

// interfaces
import { IResponse } from '../common/interfaces/response.interface';
import { IMoistureData } from '../common/interfaces/moisture-data.interface';
import { IBanyanStatus } from '../common/interfaces/banyan-status.interface';

// utils
import { CONFIG } from './../common/utils/config';

/**
 * DataProcessing Controller
 */
export class DataProcessingController {
  /**
   * Creates an instance of DataProcessingController.
   * @memberof DataProcessingController
   */
  constructor(){ }

  /**
   * 
   * 
   * @param {*} req 
   * @param {*} reply 
   * @returns {Promise<IResponse>} 
   * @memberof DataProcessingController
   */
  public async getDataProcessingHandler(req: any, reply: any): Promise<IResponse> {
    let dataProcessingService = new DataProcessingService();

    // read data
    let moistureData: IMoistureData = JSON.parse(fs.readFileSync(CONFIG.PATH.MOISTURE_DATA).toString());
    let banyanStatus: IBanyanStatus = JSON.parse(fs.readFileSync(CONFIG.PATH.BANYAN_STATUS).toString());

    // get status
    let processingStatus = dataProcessingService.getProcessingStatus(moistureData, banyanStatus);

    if (processingStatus != 0) {
      // send mail
      let subject = CONFIG.MAIL.SUBJECT[processingStatus];
      let text = CONFIG.MAIL.TEXT[processingStatus];  
      await dataProcessingService.sendMail(subject, text);

      // update banayan status
      await dataProcessingService.updateBanayanStatus(moistureData, banyanStatus, processingStatus);
    }

    // set respons info
    reply.header('Content-Type', 'application/json').code(200);

    return {
      "status": "00000",
      "message": ""
    };
  }
}