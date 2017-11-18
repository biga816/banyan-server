// libs
import * as mailer from 'nodemailer'
import * as transport from 'nodemailer-smtp-transport'

/**
 * Mail Service
 * 
 * @export
 * @class MailService
 */
export class MailService {
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

  /**
   * Creates an instance of MailService.
   * @memberof MailService
   */
  constructor() {
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
}