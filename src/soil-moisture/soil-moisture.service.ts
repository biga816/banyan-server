import * as fastify from 'fastify'
import * as fs from 'fs'
import * as format from 'date-fns/format'
import * as Rx from 'rx'

import { CONFIG } from './../common/utils/config';

export class SoilMoistureService {
  /**
   * Creates an instance of SoilMoistureService.
   * @memberof SoilMoistureService
   */
  constructor() {
  }

 /**
  * Save Data to local json
  * 
  * @param {number} moisture 
  * @returns {Promise<any>} 
  * @memberof SoilMoistureService
  */
  saveDataLocal(moisture: number): Promise<any> {
    return new Promise((resolve, reject) => {
      let self = this;

      // cal remaining water
      let moisturePct = Math.round(100 * moisture / CONFIG.MOISTURE.MAX);
      console.log('date : ', format(new Date(), 'YYYY/MM/DD HH:mm'));
      console.log('result : ', moisturePct, '%');  

      // read data
      let statusObj = JSON.parse(fs.readFileSync(CONFIG.PATH.BANYAN_STATUS).toString());
      let today = format(new Date(), 'YYYY/MM/DD HH:mm:ss');
      let preMoisturePct = statusObj['moisturePct'];

      // set params
      statusObj['moisture'] = moisture;
      statusObj['moisturePct'] = moisturePct;
      statusObj['updateDate'] = today;
      statusObj['lastWateredDate'] = preMoisturePct + 10 < moisturePct? today : statusObj['lastWateredDate'];

      // set observable
      var source = Rx.Observable.fromPromise(
        self.outputJson(statusObj).then(
          (data) => { return data; },
          (err) => { return err; }
        )
      );

      // save data
      source.subscribe(
        (res) => resolve(),
        (err) => reject(new Error(err))
      );
    });
  };
 
 /**
  * Output json file
  * 
  * @param {object} obj 
  * @returns {Promise<any>} 
  * @memberof SoilMoistureService
  */
  outputJson(obj: object): Promise<any> {
		return new Promise((resolve, reject) => {
			fs.writeFile(CONFIG.PATH.BANYAN_STATUS, JSON.stringify(obj, null, '    '), (err) => {
				if (err) {
					reject(err);
				} else {
					console.log('Outputted json　successfully.');
					resolve();
				}
			});
		});
  }

}