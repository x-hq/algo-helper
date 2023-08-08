import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import emojis from './emojis';
import search from './search';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/emojis', emojis);
router.use('/search', search);

export default router;
