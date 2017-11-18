// libs
import * as format from 'date-fns/format';
import * as Rx from 'rx';

// utils
import { CONFIG } from './../common/utils/config';

// interfaces
import { IMoistureData } from './../common/interfaces/moisture-data.interface';

// services
import { FileService } from './../common/services/file.service';
import { MailService } from './../common/services/mail.service';

/**
 * SoilMoisture Service
 * 
 * @export
 * @class SoilMoistureService
 */
export class SoilMoistureService {
  private fileService: FileService;
  private mailService: MailService;

  /**
   * Creates an instance of SoilMoistureService.
   * @memberof SoilMoistureService
   */
  constructor() {
    this.fileService = new FileService();
    this.mailService = new MailService();
  }

 /**
  * Save Data to local json
  * 
  * @param {number} moisture 
  * @returns {Promise<any>} 
  * @memberof SoilMoistureService
  */
  public async saveDataLocal(soilMoisture: number, moistureData: IMoistureData): Promise<any> {
    let today = format(new Date(), 'YYYY/MM/DD HH:mm:ss');
    // cal remaining water
    let currentMoisturePct = this.calMoisturePct(soilMoisture);

    // set params
    let newMoistureData: IMoistureData = {
      moisture: soilMoisture,
      moisturePct: currentMoisturePct,
      updateDate: today,
      lastWateredDate: this.isWatered(moistureData.moisturePct, currentMoisturePct)? today : moistureData.lastWateredDate
    };

    // output json
    await this.fileService.outputJson(CONFIG.PATH.MOISTURE_DATA, newMoistureData)

    return;
  };

  /**
   * 
   * 
   * @param {number} soilMoisture 
   * @param {IMoistureData} moistureData 
   * @returns {Promise<any>} 
   * @memberof SoilMoistureService
   */
  public async sendWateredMail(soilMoisture: number, moistureData: IMoistureData): Promise<any> {
    // cal remaining water
    let currentMoisturePct = this.calMoisturePct(soilMoisture);

    if (this.isWatered(moistureData.moisturePct, currentMoisturePct)) {
      await this.mailService.sendMail(CONFIG.MAIL.SUBJECT.WATERED, CONFIG.MAIL.TEXT.WATERED);
    }

    return;
  }
  
  /**
   * 
   * 
   * @private
   * @param {number} soilMoisture 
   * @returns {number} 
   * @memberof SoilMoistureService
   */
  private calMoisturePct(soilMoisture: number): number {
    return Math.round(100 * soilMoisture / CONFIG.MOISTURE.MAX);
  }

  /**
   * 
   * 
   * @private
   * @param {any} preMoisturePct 
   * @param {any} currentMoisturePct 
   * @returns 
   * @memberof SoilMoistureService
   */
  private isWatered(preMoisturePct, currentMoisturePct) {
    return preMoisturePct + CONFIG.MOISTURE.BORDER.WARTERD < currentMoisturePct? true : false;
  }
 
}