/**
 * Standardized API Success Response
 * @param {Response} res 
 * @param {string} message 
 * @param {object|array} data 
 * @param {number} statusCode 
 */
export const successResponse = (res, message = 'Request successful', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Standardized API Error Response
 * @param {Response} res 
 * @param {string} message 
 * @param {any} error 
 * @param {number} statusCode 
 */
export const errorResponse = (res, message = 'Something went wrong', error = null, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : (typeof error === 'string' ? error : null)
  });
};
