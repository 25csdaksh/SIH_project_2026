import mongoose from 'mongoose';

const multilingualTextSchema = new mongoose.Schema(
  {
    en: { type: String, required: true },
    gu: { type: String, required: true },
    hi: { type: String, required: true }
  },
  { _id: false }
);

const mandiRateSchema = new mongoose.Schema(
  {
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'District',
      required: true
    },
    market: multilingualTextSchema,
    commodity: multilingualTextSchema,
    variety: {
      type: String,
      default: 'General'
    },
    minimumPrice: {
      type: Number,
      required: true
    },
    maximumPrice: {
      type: Number,
      required: true
    },
    modalPrice: {
      type: Number,
      required: true
    },
    arrivalDate: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

mandiRateSchema.index({ district: 1 });

export const MandiRate = mongoose.model('MandiRate', mandiRateSchema);
