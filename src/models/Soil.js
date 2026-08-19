import mongoose from 'mongoose';

const multilingualTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    gu: { type: String, required: true, trim: true },
    hi: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const soilSchema = new mongoose.Schema(
  {
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: true,
      unique: true
    },
    soilType: {
      type: multilingualTextSchema,
      required: true
    },
    averagePH: {
      type: Number,
      required: true
    },
    npkInfo: {
      nitrogen: { type: String, default: 'Medium' },
      phosphorus: { type: String, default: 'Medium' },
      potassium: { type: String, default: 'High' }
    },
    waterSources: [multilingualTextSchema],
    commonCrops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop'
      }
    ],
    nearbyAPMCMarkets: [multilingualTextSchema]
  },
  {
    timestamps: true
  }
);

export const Soil = mongoose.model('Soil', soilSchema);
