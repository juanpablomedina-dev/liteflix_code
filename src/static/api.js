/**Code to perform requests to the API */
const API_KEY = "6f26fd536dd6192ec8a57e94141f8b20";

/**Base URL of the API */
const BASE_URL = "https://api.themoviedb.org/3";

/**Available endpoints for requests. They are for GET only. */
export const ENDPOINTS = {
  NOW_PLAYING: "/movie/now_playing",
  POPULAR: "/movie/popular",
  CONFIG: "/configuration",
};

/**Get the full URL to perform a request for the given `endpoint`
 * @param {string} endpoint
 */
export function getApiUrl(endpoint) {
  return `${BASE_URL}${endpoint}?api_key=${API_KEY}`;
}
