import mongoose, { Document } from 'mongoose';

export interface ISite extends Document {
  url: string; //TODO make url dynamic to root site path
  title: string;
  content?: string;
  isOnMainMenu: boolean;
}

var site = new mongoose.Schema(
  {
    url: { type: String },
    title: { type: String },
    content: { type: String },
    isOnMainMenu: { type: Boolean, default: false }
  },
  { strict: false }
);

export var Site = mongoose.model<ISite>('Site', site);
