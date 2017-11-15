import { getOptions, postOptions} from './soil-moisture.options';
import { SoilMoistureService } from './soil-moisture.service';

// common
import { IResponse } from '../common/interfaces/response.interface';

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
  async get(req: any, reply: any): Promise<IResponse> {
    const msg = "GET success:)";
    console.log(msg);
    reply.header('Content-Type', 'application/json').code(200);

    return {
      "status": "00000",
      "message": "",
      "data": [msg],
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
  async post(req: any, reply: any): Promise<IResponse> {
    let soilMoistureService = new SoilMoistureService();
    await soilMoistureService.saveDataLocal(req.body.soilMoisture);

    // set header
    reply.header('Content-Type', 'application/json').code(200);
    
    // return response
    return {
      'status': '00000',
      'message': ''
    };
  }
}