export interface CustomLibGeneratorSchema {
  name: string;
  build: boolean;
  unitTest: boolean;
  files?: ('utils' | 'constants' | 'types')[];
}
