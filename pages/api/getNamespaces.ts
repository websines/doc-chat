import { NextApiRequest, NextApiResponse } from 'next';
import { initPinecone } from '@/utils/pinecone-client';
import {
  pineconeIndexName as targetIndex,
} from '@/utils/keys';

type NamespaceSummary = {
  vectorCount: number;
};

const getNamespaces = async (req: NextApiRequest, res: NextApiResponse) => {

  const pinecone = await initPinecone(
  );

  try {
    const index = pinecone.Index(targetIndex!);

    const describeIndexStatsQuery = {
      describeIndexStatsRequest: {
        filter: {},
      },
    };

    const indexStatsResponse = await index.describeIndexStats(
      describeIndexStatsQuery,
    );
    const namespaces = Object.keys(
      indexStatsResponse.namespaces as { [key: string]: NamespaceSummary },
    );

    res.status(200).json(namespaces);
  } catch (error) {
    console.log('Error fetching namespaces', error);
    res.status(500).json({ message: 'Error fetching namespaces' });
  }
};

export default getNamespaces;
