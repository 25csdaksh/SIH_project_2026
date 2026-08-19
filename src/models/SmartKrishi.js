import mongoose from 'mongoose';

const multilingualTextSchema = new mongoose.Schema(
  {
    en: { type: String },
    gu: { type: String },
    hi: { type: String }
  },
  { _id: false }
);

const smartKrishiSchema = new mongoose.Schema(
  {
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: true
    },
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: true
    },
    season: {
      type: String,
      required: true
    },
    soilInformation: multilingualTextSchema,
    phLevel: {
      type: Number
    },
    npkLevel: {
      nitrogen: { type: String },
      phosphorus: { type: String },
      potassium: { type: String }
    },
    weatherInformation: multilingualTextSchema,
    fertilizerSuggestion: multilingualTextSchema,
    waterTiming: multilingualTextSchema,
    possibleDiseases: [multilingualTextSchema],
    precautions: [multilingualTextSchema]
  },
  {
    timestamps: true
  }
);

smartKrishiSchema.index({ district: 1, crop: 1, season: 1 });

export const SmartKrishi = mongoose.model('SmartKrishi', smartKrishiSchema);
