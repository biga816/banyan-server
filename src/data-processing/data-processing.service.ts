// libs
import * as Rx from 'rx';
import * as isAfter from 'date-fns/is_after';
import * as addDays from 'date-fns/add_days';
import * as mailer from 'nodemailer'
import * as transport from 'nodemailer-smtp-transport'

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

  /**
   * Creates an instance of DataProcessingService.
   * @memberof DataProcessingService
   */
  constructor() {
    this.fileService = new FileService();
  }

  /**
   * 
   * 
   * @param {IMoistureData} moistureData 
   * @returns {number} 
   * @memberof DataProcessingService
   */
  public getProcessingStatus(moistureData: IMoistureData, banayanStatus: IBanyanStatus): number {
    // check if watered
    let yesterday = addDays(new Date(), - 1);
    let lastWateredDate = moistureData.lastWateredDate;
    let isWatered = isAfter(lastWateredDate, yesterday);

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
   * 
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
				from: process.env.MAIL_FROM,
				to: process.env.MAIL_TO1,
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
   * 
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
        updateDate: moistureData.updateDate,
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
}