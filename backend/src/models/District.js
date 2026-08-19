import mongoose from 'mongoose';

const multilingualTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    gu: { type: String, required: true, trim: true },
    hi: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const districtSchema = new mongoose.Schema(
  {
    districtName: {
      type: multilingualTextSchema,
      required: true
    },
    districtCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    region: {
      type: multilingualTextSchema,
      required: true
    },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number }
    }
  },
  {
    timestamps: true
  }
);

export const District = mongoose.model('District', districtSchema);
