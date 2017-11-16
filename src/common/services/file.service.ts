import * as fs from 'fs';

import { CONFIG } from './../utils/config';
import { IMoistureData } from '../interfaces/moisture-data.interface';

export class FileService {
  /**
   * Creates an instance of FileService.
   * @memberof FileService
   */
  constructor() {
  }

  /**
   * Output json file
   * 
   * @param {string} path 
   * @param {object} obj 
   * @returns {Promise<any>} 
   * @memberof FileService
   */
  public outputJson(path: string, obj: object): Promise<any> {
		return new Promise((resolve, reject) => {
			fs.writeFile(path, JSON.stringify(obj, null, '    '), (err) => {
				if (err) {
					reject(new Error());
				} else {
					console.log('Outputted json successfully: ' + path);
					resolve();
				}
			});
		});
  }

}