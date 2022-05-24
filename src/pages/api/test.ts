import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //test for serverless deployment

  res.status(200).json({ message: 'work' });
};
