import Queue from 'bull';
import config from '@/config';

import {
  mailClient,
  getRegisterHTML,
  getCandidateHTML,
  getForgotPasswordHTML,
  getExternalRequestHTML,
} from './mail/mail';

export enum EmailQueue {
  register = 'register',
  candite = 'candidate',
  forgotPassword = 'forgotPassword',
  externalRequest = 'externalRequest',
}

export const emailQueue = new Queue('email', {
  prefix: 'bull',
  redis: config.redis,
  defaultJobOptions: {
    removeOnComplete: !config.app.isDev,
    removeOnFail: {
      age: 172800,
      count: 1000,
    },
  },
});

// Processors

emailQueue.process(EmailQueue.forgotPassword, async (job) => {
  const { data } = job;
  await mailClient.sendMail({
    from: config.mailer.from,
    to: data.email,
    subject: 'Şifreni Sıfırla',
    html: getForgotPasswordHTML(data),
  });
});

emailQueue.process(EmailQueue.register, async (job) => {
  const { data } = job;
  await mailClient.sendMail({
    from: config.mailer.from,
    to: data.email,
    subject: 'Aramıza Hoşgeldin',
    html: getRegisterHTML(data),
  });
});

emailQueue.process(EmailQueue.candite, async (job) => {
  const { data } = job;
  await mailClient.sendMail({
    from: config.mailer.from,
    to: data.email,
    subject: 'Değerlendirme Sonucu',
    html: getCandidateHTML(data),
  });
});

emailQueue.process(EmailQueue.externalRequest, async (job) => {
  const { data } = job;
  await mailClient.sendMail({
    from: config.mailer.from,
    to: data.email,
    subject: 'Yeni Talep Formu',
    html: getExternalRequestHTML(data),
  });
});
