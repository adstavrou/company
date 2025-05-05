export async function prompt<T = any>(questions: any[]): Promise<T> {
  const { prompt: enquirerPrompt } = await import('enquirer');
  return enquirerPrompt<T>(questions);
}
