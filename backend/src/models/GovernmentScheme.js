import mongoose from 'mongoose';

const multilingualTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true },
    gu: { type: String, required: true },
    hi: { type: String, required: true }
  },
  { _id: false }
);

const governmentSchemeSchema = new mongoose.Schema(
  {
    title: {
      type: multilingualTextSchema,
      required: true
    },
    description: {
      type: multilingualTextSchema,
      required: true
    },
    eligibility: {
      type: multilingualTextSchema,
      required: true
    },
    benefits: {
      type: multilingualTextSchema,
      required: true
    },
    department: {
      type: multilingualTextSchema,
      required: true
    },
    officialWebsite: {
      type: String,
      required: true,
      trim: true
    },
    applicationLink: {
      type: String,
      required: true,
      trim: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const GovernmentScheme = mongoose.model('GovernmentScheme', governmentSchemeSchema);
