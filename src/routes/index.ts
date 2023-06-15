import express from 'express'


const router = express.Router();


router.get('/healthcheck', (_, res)=> res.sendStatus(200));

export default router;