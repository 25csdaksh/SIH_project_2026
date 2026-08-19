import mongoose from 'mongoose';

const multilingualTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    gu: { type: String, required: true, trim: true },
    hi: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const seasonSchema = new mongoose.Schema(
  {
    seasonCode: {
      type: String,
      required: true,
      enum: ['kharif', 'rabi', 'zaid', 'summer', 'annual']
    },
    name: {
      type: multilingualTextSchema,
      required: true
    },
    idealMonths: {
      en: { type: String },
      gu: { type: String },
      hi: { type: String }
    }
  },
  { _id: false }
);

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: multilingualTextSchema,
      required: true
    },
    cropCode: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['cash_crop', 'grain', 'pulse', 'oilseed', 'vegetable', 'fruit', 'spice'],
      default: 'cash_crop'
    },
    seasons: [seasonSchema],
    suitableDistricts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District'
      }
    ]
  },
  {
    timestamps: true
  }
);

cropSchema.index({ suitableDistricts: 1 });

export const Crop = mongoose.model('Crop', cropSchema);
