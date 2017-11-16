import * as fs from 'fs';

import { SoilMoistureService } from './soil-moisture.service';
import { IResponse } from '../common/interfaces/response.interface';
import { IMoistureData } from '../common/interfaces/moisture-data.interface';
import { CONFIG } from './../common/utils/config';

/**
 * SoilMoisture Controller
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
   * @param {*} req 
   * @param {*} reply 
   * @returns {Promise<IResponse>} 
   * @memberof SoilMoistureController
   */
  public async getSoilMoistureHandler(req: any, reply: any): Promise<IResponse> {
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
   * @param {*} req 
   * @param {*} reply 
   * @returns {Promise<IResponse>} 
   * @memberof SoilMoistureController
   */
  public async postSoilMoistureHandler(req: any, reply: any): Promise<IResponse> {
    let soilMoistureService = new SoilMoistureService();

    // read data
    let moistureData: IMoistureData = JSON.parse(fs.readFileSync(CONFIG.PATH.MOISTURE_DATA).toString());      
    await soilMoistureService.saveDataLocal(req.body.soilMoisture, moistureData);

    // set header
    reply.header('Content-Type', 'application/json').code(200);
    
    // return response
    return {
      'status': '00000',
      'message': ''
    };
  }
}