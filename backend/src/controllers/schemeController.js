import { GovernmentScheme } from '../models/GovernmentScheme.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getLocalizedField, isValidObjectId } from '../utils/validators.js';
import { schemesData } from '../seed/schemes.js';

export const getSchemes = async (req, res, next) => {
  try {
    const lang = req.lang || 'en';
    let schemes = [];
    try {
      schemes = await GovernmentScheme.find({ isActive: true });
    } catch (err) {
      schemes = [];
    }

    if (!schemes || schemes.length === 0) {
      schemes = schemesData.map((s, index) => ({
        _id: `scheme_${index + 1}`,
        ...s
      }));
    }

    const formatted = schemes.map((s) => ({
      _id: s._id,
      title: getLocalizedField(s.title, lang),
      description: getLocalizedField(s.description, lang),
      eligibility: getLocalizedField(s.eligibility, lang),
      benefits: getLocalizedField(s.benefits, lang),
      department: getLocalizedField(s.department, lang),
      officialWebsite: s.officialWebsite,
      applicationLink: s.applicationLink
    }));

    return successResponse(res, 'Government agricultural schemes fetched successfully', formatted);
  } catch (error) {
    next(error);
  }
};

export const getSchemeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = req.lang || 'en';

    let scheme = null;
    try {
      if (isValidObjectId(id)) {
        scheme = await GovernmentScheme.findById(id);
      }
    } catch (err) {
      scheme = null;
    }

    if (!scheme) {
      const index = parseInt(id.replace('scheme_', '')) - 1;
      if (isNaN(index) || !schemesData[index]) {
        return errorResponse(res, 'Government scheme not found', null, 404);
      }
      scheme = {
        _id: id,
        ...schemesData[index]
      };
    }

    const formatted = {
      _id: scheme._id,
      title: getLocalizedField(scheme.title, lang),
      description: getLocalizedField(scheme.description, lang),
      eligibility: getLocalizedField(scheme.eligibility, lang),
      benefits: getLocalizedField(scheme.benefits, lang),
      department: getLocalizedField(scheme.department, lang),
      officialWebsite: scheme.officialWebsite,
      applicationLink: scheme.applicationLink
    };

    return successResponse(res, 'Government scheme details fetched successfully', formatted);
  } catch (error) {
    next(error);
  }
};
