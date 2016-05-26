import fs from 'fs';
import workflow from '../util/workflow';
import mongoose from 'mongoose';

const profileApi = {
  profile(req, res) {

    res.status(200).json({
      success: true,
      user: req.user
    });
  }
};

export { profileApi };
