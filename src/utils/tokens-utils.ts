import GPT3Tokenizer from 'gpt3-tokenizer'

const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })

export const getTokenAmount = (text: string) => {
  const enconded: { bpe: number[]; text: string[] } = tokenizer.encode(text)
  return enconded.bpe.length
}
