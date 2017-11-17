// libs
import * as Rx from 'rx';
import * as format from 'date-fns/format';
import * as isAfter from 'date-fns/is_after';
import * as addDays from 'date-fns/add_days';
import * as mailer from 'nodemailer'
import * as transport from 'nodemailer-smtp-transport'
import * as firebase from 'firebase'

// utils
import { CONFIG } from './../common/utils/config';

// interfaces
import { IMoistureData } from '../common/interfaces/moisture-data.interface';
import { IBanyanStatus } from '../common/interfaces/banyan-status.interface';

// services
import { FileService } from './../common/services/file.service';

export class DataProcessingService {
  private fileService: FileService;
  private smtpConfig: object = {
    host: "smtp.mail.yahoo.co.jp",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_COFIG_MAIL,
      pass: process.env.SMTP_COFIG_PASS,
    },
  }
  private mailFrom: string = process.env.MAIL_FROM;
  private mailTos: string[] = [process.env.MAIL_TO1];
  private firebaseUserId: string = process.env.FIREBASE_USER_ID;
  private firebaseUserPassword: string = process.env.FIREBASE_USER_PASS;
  private firebaseConfig: object = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID
  };

  /**
   * Creates an instance of DataProcessingService.
   * @memberof DataProcessingService
   */
  constructor() {
    this.fileService = new FileService();
    firebase.initializeApp(this.firebaseConfig);
  }

  /**
   * Get Processing Status
   * 
   * @param {string} targetDate 
   * @param {IMoistureData} moistureData 
   * @param {IBanyanStatus} banayanStatus 
   * @returns {number} 
   * @memberof DataProcessingService
   */
  public getProcessingStatus(targetDate: string, moistureData: IMoistureData, banayanStatus: IBanyanStatus): number {
    // check if watered
    let isWatered = isAfter(moistureData.lastWateredDate, targetDate);

    // check if warned
    let moisturePct = moistureData.moisturePct;
    let isWarned = moisturePct < CONFIG.MOISTURE.BORDER.WARNING ? true : false;

    // check if alerted
    let isAlerted = moisturePct < CONFIG.MOISTURE.BORDER.ALERT ? true : false;

    // set status
    let resStatus = CONFIG.BANYAN_STATUS.NOTHING;

    if (isWatered && banayanStatus.status != CONFIG.BANYAN_STATUS.WATERED) {
      resStatus = CONFIG.BANYAN_STATUS.WATERED;
    } else if (isWarned && banayanStatus.status != CONFIG.BANYAN_STATUS.WARNED) {
      resStatus = CONFIG.BANYAN_STATUS.WARNED;
    } else if (isAlerted && banayanStatus.status != CONFIG.BANYAN_STATUS.ALERTED) {
      resStatus = CONFIG.BANYAN_STATUS.ALERTED;
    }

    return resStatus;
  }

  /**
   * Send Mail
   * 
   * @param {string} subject 
   * @param {string} text 
   * @returns {Promise<any>} 
   * @memberof DataProcessingService
   */
  public sendMail(subject: string, text: string): Promise<any> {
    let self = this;

		return new Promise((resolve, reject) => {
      let transporter = mailer.createTransport(transport(self.smtpConfig));

			transporter.sendMail({
				from: self.mailFrom,
				to: self.mailTos,
				subject: subject,
				text: text
			},  (err, info) => {
				if (err) {
          console.log(err);
					reject(new Error(err));
				} else {
					console.log('Sent mail successfully.');
					resolve();
				};
			});
    });    
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
  public updateBanayanStatus(moistureData: IMoistureData, banyanStatus: IBanyanStatus, processingStatus: number) {
    let self = this;

    return new Promise((resolve, reject) => {
      // set params
      let newBanyanStatus: IBanyanStatus = {
        moisturePct: moistureData.moisture,
        status: processingStatus === 0 ? banyanStatus.status || 0 : processingStatus,
        updateDate: format(new Date(), 'YYYY/MM/DD HH:mm:ss'),
        lastWateredDate: moistureData.lastWateredDate
      }

      // set observable
      var source = Rx.Observable.fromPromise(
        self.fileService.outputJson(CONFIG.PATH.BANYAN_STATUS, newBanyanStatus).then(
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
      let firebaseUserId = firebase.auth().signInWithEmailAndPassword(self.firebaseUserId, self.firebaseUserPassword).then(
        () => {
          let statusRef = firebase.database().ref('/status');
          let historyRef = firebase.database().ref('/history');

          // check if watered
          let isWatered = isAfter(moistureData.lastWateredDate, targetDate);
      
          let history = {
            date: targetDate,
            moisture : moistureData.moisture,
            moisturePct : moistureData.moisturePct,
            isWarterd: isWatered
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

}