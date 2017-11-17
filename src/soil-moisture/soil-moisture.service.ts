import * as format from 'date-fns/format';
import * as Rx from 'rx';

import { CONFIG } from './../common/utils/config';
import { IMoistureData } from './../common/interfaces/moisture-data.interface';
import { FileService } from './../common/services/file.service';

/**
 * SoilMoisture Service
 * 
 * @export
 * @class SoilMoistureService
 */
export class SoilMoistureService {
  private fileService: FileService;

  /**
   * Creates an instance of SoilMoistureService.
   * @memberof SoilMoistureService
   */
  constructor() {
    this.fileService = new FileService();
  }

 /**
  * Save Data to local json
  * 
  * @param {number} moisture 
  * @returns {Promise<any>} 
  * @memberof SoilMoistureService
  */
  public saveDataLocal(soilMoisture: number, moistureData: IMoistureData): Promise<any> {
    let self = this;

    return new Promise((resolve, reject) => {
      // cal remaining water
      let moisturePct = Math.round(100 * soilMoisture / CONFIG.MOISTURE.MAX);
      console.log('date : ', format(new Date(), 'YYYY/MM/DD HH:mm'));
      console.log('result : ', moisturePct, '%');  

      // read data
      let today = format(new Date(), 'YYYY/MM/DD HH:mm:ss');
      let preMoisturePct = moistureData.moisturePct;

      // set params
      let newMoistureData: IMoistureData = {
        moisture: soilMoisture,
        moisturePct: moisturePct,
        updateDate: today,
        lastWateredDate: preMoisturePct + 10 < moisturePct? today : moistureData.lastWateredDate
      };

      // set observable
      var source = Rx.Observable.fromPromise(
        self.fileService.outputJson(CONFIG.PATH.MOISTURE_DATA, newMoistureData).then(
          (data) => { return data; },
          (err) => { return err; }
        )
      );

      // save data
      source.subscribe(
        (res) => resolve(),
        (err) => {
          console.log(err);
          reject(new Error(err));
        }
      );
    });
  };
 
}