import express from 'express';
import { Site } from '../../../databaseScripts/Site';

export const router = express.Router();

router.get(
  '/sites/getAll',
  (req: express.Request, res: express.Response): void => {
    var allSites = Site.find({}).exec();
    allSites
      .then(data => res.send(JSON.stringify(data)))
      .catch(err => res.send(err));
  }
);

router.get(
  '/sites/getMainManu',
  (req: express.Request, res: express.Response): void => {
    var allSites = Site.find({ isOnMainMenu: true }).exec();
    allSites
      .then(data => res.send(JSON.stringify(data)))
      .catch(err => res.send(err));
  }
);
