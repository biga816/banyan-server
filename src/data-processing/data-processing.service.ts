// libs
import * as Rx from 'rx';
import * as format from 'date-fns/format';
import * as addDays from 'date-fns/add_days';
import * as firebase from 'firebase'

// utils
import { CONFIG } from './../common/utils/config';

// interfaces
import { IMoistureData } from '../common/interfaces/moisture-data.interface';
import { IBanyanStatus } from '../common/interfaces/banyan-status.interface';

// services
import { FileService } from './../common/services/file.service';
import { MailService } from './../common/services/mail.service';

/**
 * DataProcessing Service
 * 
 * @export
 * @class DataProcessingService
 */
export class DataProcessingService {
  private fileService: FileService;
  private firebaseUserId: string = process.env.FIREBASE_USER_ID;
  private firebaseUserPassword: string = process.env.FIREBASE_USER_PASS;
  private mailService: MailService;

  /**
   * Creates an instance of DataProcessingService.
   * @memberof DataProcessingService
   */
  constructor() {
    this.fileService = new FileService();
    this.mailService = new MailService();
  }

  /**
   * Get Processing Status
   * 
   * @param {IMoistureData} moistureData 
   * @param {IBanyanStatus} banayanStatus 
   * @returns {number} 
   * @memberof DataProcessingService
   */
  public getProcessingStatus(moistureData: IMoistureData, banayanStatus: IBanyanStatus): number {
    // check if warned
    let moisturePct = moistureData.moisturePct;
    let isWarned = moisturePct < CONFIG.MOISTURE.BORDER.WARNING ? true : false;

    // check if alerted
    let isAlerted = moisturePct < CONFIG.MOISTURE.BORDER.ALERT ? true : false;

    // set status
    let resStatus = CONFIG.BANYAN_STATUS.NOTHING;

    if (isWarned && banayanStatus.status != CONFIG.BANYAN_STATUS.WARNED) {
      resStatus = CONFIG.BANYAN_STATUS.WARNED;
    } else if (isAlerted && banayanStatus.status != CONFIG.BANYAN_STATUS.ALERTED) {
      resStatus = CONFIG.BANYAN_STATUS.ALERTED;
    }

    return resStatus;
  }

  /**
   * Update Banayan Status
   * 
   * @param {IMoistureData} moistureData 
   * @param {IBanyanStatus} banyanStatus 
   * @param {number} processingStatus 
   * @returns 
   * @memberof DataProcessingService
   */
  public async updateBanayanStatus(moistureData: IMoistureData, banyanStatus: IBanyanStatus, processingStatus: number) {
    // set params
    let newBanyanStatus: IBanyanStatus = {
      moisturePct: moistureData.moisturePct,
      status: processingStatus === 0 ? banyanStatus.status || 0 : processingStatus,
      updateDate: format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
      lastWateredDate: moistureData.lastWateredDate
    }

    // output json
    await this.fileService.outputJson(CONFIG.PATH.BANYAN_STATUS, newBanyanStatus).then
    
    return;
  }


  /**
   * Save Data to Firebase
   * 
   * @param {string} targetDate 
   * @param {IMoistureData} moistureData 
   * @param {IBanyanStatus} banyanStatus 
   * @returns 
   * @memberof DataProcessingService
   */
  saveDataFb(targetDate: string, moistureData: IMoistureData, banyanStatus: IBanyanStatus) {
    let self = this;

    return new Promise((resolve, reject) => {
      // sign in anonymously
      firebase.auth().signInWithEmailAndPassword(self.firebaseUserId, self.firebaseUserPassword).then(
        () => {
          let statusRef = firebase.database().ref('/status');
          let historyRef = firebase.database().ref('/history');

          let history = {
            date: targetDate,
            moisture : moistureData.moisture,
            moisturePct : moistureData.moisturePct,
          };

          // set observable
          let source = Rx.Observable.forkJoin(
            statusRef.set(banyanStatus).then(
              (data) => { return data; },
              (err) => { return err; }
            ),
            historyRef.push(history).then(
              (data) => { return data; },
              (err) => { return err; }
            )
          );

          // save data
          source.subscribe(
            (res) => {
              console.log('Saved data successfully.');
              statusRef.off();
              resolve(res);
            },
            (err) => {
              statusRef.off();
              reject(err);
            }
          );

        }
      );
    });
  }

  /**
   * 
   * 
   * @param {number} processingStatus 
   * @returns {Promise<any>} 
   * @memberof DataProcessingService
   */
  public async sendStatusMail(processingStatus: number): Promise<any> {
    if (processingStatus != 0) {
      let subject = CONFIG.MAIL.SUBJECT[processingStatus];
      let text = CONFIG.MAIL.TEXT[processingStatus];  
      await this.mailService.sendMail(subject, text);
    }
    return;
  }

}