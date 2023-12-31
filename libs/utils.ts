export function chunk(
    inputs: Document[],
    chunkSize: number = 100
  ): Document[][] {
    const chunks = []
    for (let i = 0; i < inputs.length; i += chunkSize) {
      const chunk = inputs.slice(i, i + chunkSize)
      if (chunk.length < chunkSize && i + chunkSize < inputs.length) {
        const remaining = inputs.slice(i + chunkSize)
        chunk.push(...remaining)
      }
      chunks.push(chunk)
    }
    return chunks
  }
  
  