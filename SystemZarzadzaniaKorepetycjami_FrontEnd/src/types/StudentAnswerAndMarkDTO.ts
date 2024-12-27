export interface StudentAnswerAndMarkDTO {
  idStudentAnswer: number;
  studentAnswer: string | null;
  idAssignment: number;
  answerAssignment: string | null;
  content: string;
  idMark: number;
  description: string | null;
  value: boolean;
}
