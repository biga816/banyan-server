// libs
import * as fastify from 'fastify';
import * as fs from 'fs';

// services
import { SoilMoistureService } from './soil-moisture.service';

// interfaces
import { IResponse } from '../common/interfaces/response.interface';
import { IMoistureData } from '../common/interfaces/moisture-data.interface';

// utils
import { CONFIG } from './../common/utils/config';

/**
 * SoilMoisture Controller
 * 
 * @export
 * @class SoilMoistureController
 */
export class SoilMoistureController {
  /**
   * Creates an instance of SoilMoistureController.
   * @memberof SoilMoistureController
   */
  constructor(){ }

  /**
   * 
   * 
   * @param {fastify.FastifyRequest} req 
   * @param {fastify.FastifyReply} reply 
   * @returns {Promise<IResponse>} 
   * @memberof SoilMoistureController
   */
  public async getSoilMoistureHandler(req: fastify.FastifyRequest, reply: fastify.FastifyReply): Promise<IResponse> {
    console.log("GET success:)");
    reply.header('Content-Type', 'application/json').code(200);

    return {
      "status": "00000",
      "message": "",
      "data": [],
    };
  }

  /**
   * 
   * 
   * @param {fastify.FastifyRequest} req 
   * @param {fastify.FastifyReply} reply 
   * @returns {Promise<IResponse>} 
   * @memberof SoilMoistureController
   */
  public async postSoilMoistureHandler(req: fastify.FastifyRequest, reply: fastify.FastifyReply): Promise<IResponse> {
    let soilMoistureService = new SoilMoistureService();

    // read data
    let moistureData: IMoistureData = JSON.parse(fs.readFileSync(CONFIG.PATH.MOISTURE_DATA).toString());
    await soilMoistureService.saveDataLocal(req.body.soilMoisture, moistureData);

    // send mail
    await soilMoistureService.sendWateredMail(req.body.soilMoisture, moistureData);

    // set header
    reply.header('Content-Type', 'application/json').code(200);
    
    // return response
    return {
      'status': '00000',
      'message': ''
    };
  }
}