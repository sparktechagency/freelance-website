import { Schema, model, Types } from "mongoose";
import { TQuestionnaireAnswer } from "./questionnaireAnswers.interface";

const answerSchema = new Schema(
  {
    questionnaireId: {
      type: Schema.Types.ObjectId,
      ref: "Questionnaire", 
      required: true,
    },
    answer: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
);

const questionnaireAnswerSchema = new Schema<TQuestionnaireAnswer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionsAnswered: {
      type: [answerSchema],
      required: true,
    },
  },
  { timestamps: true }
);


const QuestionnaireAnswer = model<TQuestionnaireAnswer>(
  "QuestionnaireAnswer",
  questionnaireAnswerSchema
);
export default QuestionnaireAnswer;