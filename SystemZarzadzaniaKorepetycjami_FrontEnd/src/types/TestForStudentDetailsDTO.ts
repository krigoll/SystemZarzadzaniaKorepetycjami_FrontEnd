import { StudentAnswerAndMarkDTO } from './StudentAnswerAndMarkDTO';

export interface TestForStudentDetailsDTO {
  idTestForStudent: number;
  title: string;
  status: string;
  assignment: StudentAnswerAndMarkDTO[];
}
