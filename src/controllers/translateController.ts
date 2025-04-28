import axios from 'axios';
import qs from 'qs';
import { Request, Response } from 'express';

export const translateController = async (req: Request, res: Response) => {
  const { keyword, from = 'zh-CHS', to = 'en' } = req.query;

  if (!keyword) {
    res.status(400).json({ message: 'Missing required parameter: keyword' });
    return;
  }

  try {
    const salt = new Date().getTime();
    const appKey = '62d80088b21aac25';
    const key = '8zUpZJvbFaQYK8k6prcaHeuowbCjc4im';
    const curtime = Math.round(new Date().getTime() / 1000);
    const str1 = appKey + keyword + salt + curtime + key;
    const sign = require('crypto').createHash('sha256').update(str1).digest('hex');

    const requestData = qs.stringify({
      q: keyword,
      appKey,
      salt,
      from,
      to,
      sign,
      signType: 'v3',
      curtime,
    });

    const response = await axios.post('http://openapi.youdao.com/api', requestData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    res.json({ translation: response.data });
  } catch (error: any) {
    console.error('Error calling translation API:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to fetch translation',
      error: error.response?.data || error.message,
    });
  }
};