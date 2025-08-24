import { model, Schema } from "mongoose";
import { TQuestionnaire } from "./questionnaire.interface";

const questionnaireSchema = new Schema<TQuestionnaire>(
  {
    question: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: [true, 'Images are required'],
      validate: {
        validator: function (value: string[]) {
          return value && value.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    answer: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { timestamps: true },
);

const Questionnaire = model<TQuestionnaire>(
  'Questionnaire',
  questionnaireSchema,
);
export default Questionnaire;