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
    districtCode: {
      type: String,
      required: true
    },
    districtName: multilingualTextSchema,
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: true
    },
    cropId: {
      type: String,
      required: true
    },
    cropName: multilingualTextSchema,
    season: {
      type: String,
      required: true
    },
    soil: {
      types: [{ type: String }],
      phRange: { type: String },
      nitrogen: {
        recommendedRange: { type: String },
        note: { type: String }
      },
      phosphorus: {
        recommendedRange: { type: String },
        note: { type: String }
      },
      potassium: {
        recommendedRange: { type: String },
        note: { type: String }
      },
      characteristics: [{ type: String }],
      disclaimer: { type: String }
    },
    phLevel: {
      type: Number
    },
    npkLevel: {
      nitrogen: { type: String },
      phosphorus: { type: String },
      potassium: { type: String }
    },
    weatherRequirements: {
      temperature: { type: String },
      rainfall: { type: String },
      humidity: { type: String },
      risks: [{ type: String }],
      note: { type: String }
    },
    fertilizer: {
      recommendation: { type: String },
      applicationTiming: [{ type: String }],
      precautions: [{ type: String }]
    },
    irrigation: {
      requirement: { type: String },
      timing: { type: String },
      frequency: { type: String },
      criticalStages: [{ type: String }],
      precautions: [{ type: String }]
    },
    diseases: [
      {
        name: { type: String },
        gujaratiName: { type: String },
        symptoms: { type: String },
        prevention: { type: String },
        management: { type: String },
        riskConditions: { type: String }
      }
    ],
    pests: [
      {
        name: { type: String },
        gujaratiName: { type: String },
        symptoms: { type: String },
        prevention: { type: String },
        management: { type: String },
        riskConditions: { type: String }
      }
    ],
    precautions: [{ type: String }],
    sources: [
      {
        name: { type: String },
        url: { type: String }
      }
    ],
    metadata: {
      version: { type: String },
      state: { type: String },
      lastUpdated: { type: String },
      description: { type: String },
      dataSourceMethodology: { type: String }
    },
    // Backwards compatibility multilingual fields
    soilInformation: multilingualTextSchema,
    weatherInformation: multilingualTextSchema,
    fertilizerSuggestion: multilingualTextSchema,
    waterTiming: multilingualTextSchema,
    possibleDiseases: [multilingualTextSchema],
    rawJson: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

smartKrishiSchema.index({ district: 1, crop: 1, season: 1 }, { unique: true });

export const SmartKrishi = mongoose.model('SmartKrishi', smartKrishiSchema);
