import mongoose from 'mongoose';

const multilingualTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true },
    gu: { type: String, required: true },
    hi: { type: String, required: true }
  },
  { _id: false }
);

const pestDetectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    imageUrl: {
      type: String,
      required: true
    },
    diseaseName: {
      type: multilingualTextSchema,
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    description: {
      type: multilingualTextSchema,
      required: true
    },
    recommendedAction: {
      type: multilingualTextSchema,
      required: true
    },
    prevention: {
      type: multilingualTextSchema,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const PestDetection = mongoose.model('PestDetection', pestDetectionSchema);
