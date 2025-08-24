import { Types } from "mongoose";

export type TAnswer = {
  questionnaireId: Types.ObjectId;
  answer: string;
};

export type TQuestionnaireAnswer = {
  userId: Types.ObjectId;
  questionsAnswered: [TAnswer];
  
};