import mongoose from 'mongoose';

const weatherSchema = new mongoose.Schema(
  {
    districtName: {
      type: String,
      required: true,
      index: true
    },
    coordinates: {
      lat: Number,
      lon: Number
    },
    temperature: {
      type: Number,
      required: true
    },
    feelsLike: Number,
    humidity: {
      type: Number,
      required: true
    },
    rainfall: {
      type: Number,
      default: 0
    },
    windSpeed: {
      type: Number,
      required: true
    },
    condition: {
      en: String,
      gu: String,
      hi: String
    },
    forecastSummary: {
      en: String,
      gu: String,
      hi: String
    },
    cachedUntil: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

weatherSchema.index({ cachedUntil: 1 }, { expireAfterSeconds: 0 });

export const Weather = mongoose.model('Weather', weatherSchema);
