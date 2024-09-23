import { join } from 'path';
import config from '@/config';
import { readFileSync } from 'fs';
import nodemailer from 'nodemailer';
import Handlebars from 'handlebars';

import { EmailQueue, emailQueue } from '../bull';

export interface IForgotPasswordMailData {
  email: string;
  code: string;
  name: string;
}

export interface IExternalRequestMailData {
  email: string;
  url: string;
}

export interface ICandidateMailData {
  email: string;
  message: string;
}

export interface IRegisterMailData {
  email: string;
  name: string;
  password: string;
}

export const mailClient = nodemailer.createTransport(config.mailer);

export function getForgotPasswordHTML(data: { name: string; code: string }) {
  const baseDir = join(__dirname, 'templates');
  const headerFile = readFileSync(join(baseDir, 'header', 'header.hbs'), { encoding: 'utf-8' });
  const forgotFile = readFileSync(join(baseDir, 'forgot.hbs'), { encoding: 'utf-8' });

  Handlebars.registerPartial('header', headerFile);

  return Handlebars.compile(forgotFile)(data);
}

export function getExternalRequestHTML(data: { url: string }) {
  const baseDir = join(__dirname, 'templates');
  const headerFile = readFileSync(join(baseDir, 'header', 'header.hbs'), { encoding: 'utf-8' });
  const externalRequest = readFileSync(join(baseDir, 'external-request.hbs'), {
    encoding: 'utf-8',
  });

  Handlebars.registerPartial('header', headerFile);

  return Handlebars.compile(externalRequest)(data);
}

export function getCandidateHTML(data: { message: string }) {
  const baseDir = join(__dirname, 'templates');
  const headerFile = readFileSync(join(baseDir, 'header', 'header.hbs'), { encoding: 'utf-8' });
  const candidate = readFileSync(join(baseDir, 'candidate.hbs'), { encoding: 'utf-8' });

  Handlebars.registerPartial('header', headerFile);

  return Handlebars.compile(candidate)(data);
}

export function getRegisterHTML(data: { name: string; password: string }) {
  const baseDir = join(__dirname, 'templates');
  const headerFile = readFileSync(join(baseDir, 'header', 'header.hbs'), { encoding: 'utf-8' });
  const register = readFileSync(join(baseDir, 'register.hbs'), { encoding: 'utf-8' });

  Handlebars.registerPartial('header', headerFile);

  return Handlebars.compile(register)(data);
}

// Queue Add

export async function sendForgotPasswordMail(data: IForgotPasswordMailData) {
  return emailQueue.add(EmailQueue.forgotPassword, data);
}

export async function sendExternalRequestMail(data: IExternalRequestMailData) {
  return emailQueue.add(EmailQueue.externalRequest, data);
}

export async function sendCandidateMail(data: ICandidateMailData) {
  return emailQueue.add(EmailQueue.candite, data);
}

export async function sendRegisterMailData(data: IRegisterMailData) {
  return emailQueue.add(EmailQueue.register, data);
}
