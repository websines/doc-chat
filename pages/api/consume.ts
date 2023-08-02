import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { DocxLoader } from 'langchain/document_loaders/fs/docx';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { initPinecone } from '@/utils/pinecone-client';
import axios from 'axios'


// This is the updated version!!
import {
  openAIapiKey,
  supabaseKey,
  supabaseBucket,
  supabaseURL,
  pineconeIndexName as targetIndex,
  supabaseDatabaseUrl,
} from '@/utils/keys';
import { createClient } from '@supabase/supabase-js';
import { createPrisma } from '@/utils/prisma';

const prisma = createPrisma({ url: supabaseDatabaseUrl })
const supabase = createClient(supabaseURL!, supabaseKey!)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const pinecone = await initPinecone();

  const { namespaceName, chunkSize, overlapSize } = req.query;

  const doc_data = req.body;
  const docDataParsed = JSON.parse(doc_data);

  try {
    const data = await prisma.documents.create({
      data: {
        url: docDataParsed?.url,
        // @ts-ignore
        name: docDataParsed?.name,
        assigned_namespace: namespaceName as string,
      },
    });
    
    const {
      data: { publicUrl },
    }: any = await supabase.storage.from(supabaseBucket!).getPublicUrl(docDataParsed?.url);
    const response = await axios.get(publicUrl, { responseType: "arraybuffer" });

    const arrayBuffer = response.data;

    const directoryLoader = new DirectoryLoader('in-memory', {
      '.pdf': (path) => new PDFLoader(arrayBuffer),
      '.docx': (path) => new DocxLoader(arrayBuffer),
      '.txt': (path) => new TextLoader(arrayBuffer),
    });

    const rawDocs = await directoryLoader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: Number(chunkSize),
      chunkOverlap: Number(overlapSize),
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: openAIapiKey as string,
    });

    const index = pinecone.Index(targetIndex!);

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: namespaceName as string,
      textKey: 'text',
    });

    res.status(200).json({ message: 'Data ingestion complete' });
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ error: 'Failed to ingest your data' });
  }
}