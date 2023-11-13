const messageWithDots = (message: string): string => message + '.'.repeat(50 - message.length)

const replaceLastOccurrence = (input: string, find: string, replaceWith: string): string => {
  if (typeof input !== 'string' || typeof find !== 'string' || typeof replaceWith !== 'string') {
    throw new Error('Invalid type')
  }

  const lastOccIndex = input.lastIndexOf(find)
  if (lastOccIndex < 0) {
    return input
  }

  return input.substring(0, lastOccIndex) + replaceWith + input.substring(lastOccIndex + find.length)
}

export {
  messageWithDots,
  replaceLastOccurrence
}
