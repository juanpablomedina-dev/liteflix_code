const API_KEY = "api_key=6f26fd536dd6192ec8a57e94141f8b20";

const BASE_URL = "https://api.themoviedb.org/3";

export const ENDPOINTS = {
  NOW_PLAYING: "/movie/now_playing",
  POPULAR: "/movie/popular",
  CONFIG: "/configuration",
};

export function getApiUrl(endpoint) {
  return `${BASE_URL}${endpoint}?${API_KEY}`;
}
