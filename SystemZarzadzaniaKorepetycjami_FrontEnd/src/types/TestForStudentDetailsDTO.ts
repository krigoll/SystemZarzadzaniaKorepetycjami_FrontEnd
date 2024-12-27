import { StudentAnswerAndMarkDTO } from './StudentAnswerAndMarkDTO';

export interface TestForStudentDetailsDTO {
  idTestForStudent: number;
  title: string;
  assignment: StudentAnswerAndMarkDTO[];
}
