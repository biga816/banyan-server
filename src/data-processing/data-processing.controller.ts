// libs
import * as fastify from 'fastify';
import * as fs from 'fs';

// services
import { DataProcessingService } from './data-processing.service';
import { MailService } from './../common/services/mail.service';

// interfaces
import { IResponse } from '../common/interfaces/response.interface';
import { IMoistureData } from '../common/interfaces/moisture-data.interface';
import { IBanyanStatus } from '../common/interfaces/banyan-status.interface';

// utils
import { CONFIG } from './../common/utils/config';

/**
 * DataProcessing Controller
 * 
 * @export
 * @class DataProcessingController
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
   * @param {fastify.FastifyRequest} req 
   * @param {fastify.FastifyReply} reply 
   * @returns {Promise<IResponse>} 
   * @memberof DataProcessingController
   */
  public async getDataProcessingHandler(req: fastify.FastifyRequest, reply: fastify.FastifyReply): Promise<IResponse> {
    let targetDate = req.query.date;
    let dataProcessingService = new DataProcessingService();
    let mailService = new MailService();

    // read local data
    let moistureData: IMoistureData = JSON.parse(fs.readFileSync(CONFIG.PATH.MOISTURE_DATA).toString());
    let banyanStatus: IBanyanStatus = JSON.parse(fs.readFileSync(CONFIG.PATH.BANYAN_STATUS).toString());

    // get status
    let processingStatus = dataProcessingService.getProcessingStatus(moistureData, banyanStatus);

    // send mail
    await dataProcessingService.sendStatusMail(processingStatus);
    // update banayan status
    await dataProcessingService.updateBanayanStatus(moistureData, banyanStatus, processingStatus);
    // save Data to Firebase
    await dataProcessingService.saveDataFb(targetDate, moistureData, banyanStatus);
      
    // set header
    reply.header('Content-Type', 'application/json').code(200);

    // return response
    return {
      "status": "00000",
      "message": ""
    };
  }
}