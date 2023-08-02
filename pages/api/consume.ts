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


const prisma = createPrisma({url: supabaseDatabaseUrl})
const supabase = createClient(supabaseURL!, supabaseKey!)

const filePath = process.env.NODE_ENV === 'production' ? '/tmp' : 'tmp';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {

  const pinecone = await initPinecone();

  const { namespaceName, chunkSize, overlapSize } = req.query;

  const doc_data = req.body

  console.log(doc_data)

  try {

  const data = await prisma.documents.create({
    data: {
      url: doc_data?.url,
      // @ts-ignore
      name: doc_data?.name,
      assigned_namespace: doc_data?.namespaceName
    },
  })

 console.log(data)

  const {
    data: { publicUrl },
  }: any = supabase.storage.from(supabaseBucket!).getPublicUrl(doc_data?.url)
  const response = await axios.get(publicUrl, { responseType: "arraybuffer" })

  // Write the PDF to a temporary file. This is necessary because the PDFLoader
  fs.writeFileSync(`/tmp/${Date.now()}.pdf`, response.data)

  
    // Load PDF files from the specified directory
    const directoryLoader = new DirectoryLoader(filePath, {
      '.pdf': (path) => new PDFLoader(path),
      '.docx': (path) => new DocxLoader(path),
      '.txt': (path) => new TextLoader(path),
    });

    const rawDocs = await directoryLoader.load();

    // Split the PDF documents into smaller chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: Number(chunkSize),
      chunkOverlap: Number(overlapSize),
    });

    const docs = await textSplitter.splitDocuments(rawDocs);

    // OpenAI embeddings for the document chunks
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: openAIapiKey as string,
    });

    // Get the Pinecone index with the given name
    const index = pinecone.Index(targetIndex!);

    // Store the document chunks in Pinecone with their embeddings
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: namespaceName as string,
      textKey: 'text',
    });

    // Delete the PDF, DOCX and TXT files
    const filesToDelete = fs
      .readdirSync(filePath)
      .filter(
        (file) =>
          file.endsWith('.pdf') ||
          file.endsWith('.docx') ||
          file.endsWith('.txt'),
      );
    filesToDelete.forEach((file) => {
      fs.unlinkSync(`${filePath}/${file}`);
    });

    res.status(200).json({ message: 'Data ingestion complete' });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: 'Failed to ingest your data' });
  }
}
