let instance: any;

export async function prompt<T = any>(questions: any[]): Promise<T> {
  if (!instance) {
    const { default: Enquirer } = await import('enquirer');
    instance = new Enquirer();
  }

  return instance.prompt(questions);
}
