//Pure functions and constant values used in multiple places in the project.

/**Base key of all movie images stored as dataURL in the Local Storage (or Session Storage for temporary files). */
export const MOVIE_STORAGE_NAME = "LiteFlixChallenge_imageDataURL";

/**Base key of the configuration data stored in the Local Storage. */
export const CONFIG_LOCAL_STORAGE_NAME = "LiteFlixChallenge_config";

/**Characters that separate the main title from the secondary title.*/
const MOVIE_SEPARATORS = Object.freeze([":", "-", ","]);

/**Different lengths of the main title to consider it "long" or "very long". */
const LENGTH_CRITERIAS = deepFreeze({
  get smallPhone() {
    return this.phone;
  },
  phone: {
    /**Length of the whole main title. */
    WHOLE: { LONG: 10, VERY_LONG: 20 },
    /**Length of a single word of the main title.*/
    BY_WORD: { LONG: 8, VERY_LONG: 12 },
  },

  tablet: {
    /**Length of the whole main title. */
    WHOLE: { LONG: 18, VERY_LONG: 30 },
    /**Length of a single word of the main title.*/
    BY_WORD: { LONG: 12, VERY_LONG: 20 },
  },

  get landscape() {
    return this.laptop;
  },
  laptop: {
    /**Length of the whole main title. */
    WHOLE: { LONG: 25, VERY_LONG: 40 },
    /**Length of a single word of the main title.*/
    BY_WORD: { LONG: 20, VERY_LONG: 30 },
  },
  get wideLaptop() {
    return this.laptop;
  },
  get monitor() {
    return this.laptop;
  },
});

/**
 * @typedef {"monitor" | "wideLaptop" | 'laptop' | 'landscape' | 'tablet' | 'phone' | 'smallPhone'} ValidBreakpoint
 * Make sure the ValidBreakpoints coincide with the properties keys within the BREAKPOINTS object.
 * @type { { [breakpointKey: string]: number } }
 */
export const BREAKPOINTS = Object.freeze({
  monitor: 1500, //sl (super large)
  wideLaptop: 1280, //xl (extra large)
  laptop: 1024, //lg (large)
  landscape: 768, //md (medium)
  tablet: 550, //sm (small)
  phone: 350, //xs (extra small)
  smallPhone: 0, //ss (super small)
});

/**Returns the full session storage key of a given file name. Used for temporary files.
 * @param {string} fileName
 */
export function getTempMovieKey(fileName) {
  return `${MOVIE_STORAGE_NAME}_${fileName}`;
}

/**Returns the full local storage key of a given file name and title. Used for permanent uploaded files.
 * @param {string} fileName
 * @param {string} title
 */
export function getSavedMovieKey(fileName, title) {
  return `${title}/${MOVIE_STORAGE_NAME}_${fileName}`;
}

/**Returns the title of a saved movie given it's saveKey.
 * @param {string} savedKey
 */
export function getSavedMovieTitle(savedKey) {
  return savedKey.split("/")[0];
}

/**Processes the title of a movie and returns the main part, the secondary part, and a key indicating
 * the main part length approximately.
 * @param {string} title
 * @param {boolean} isDesktop If `true`, the desktop criteria will be used, otherwise the mobile criteria will be used.
 * @returns {{mainTitle: string, secondaryTitle: string, mainTitleLength: "average" | "long" | "very-long"}}
 */
export function parseMovieTitle(title, breakpoint) {
  //Separate titles starting by finding the last separator in the string.
  var separatingIndex = Math.max(
    ...MOVIE_SEPARATORS.map((sep) => title.indexOf(sep))
  );
  if (separatingIndex < 0) separatingIndex = title.length; //No separator found, don't separate.

  const mainTitle = title.substring(0, separatingIndex);
  const secondaryTitle = title.substring(separatingIndex + 1);

  //Check main title length starting by checking the whole title and then by-word.
  var mainTitleLength = "average";
  const { BY_WORD, WHOLE } = LENGTH_CRITERIAS[breakpoint];

  if (mainTitle.length >= WHOLE.VERY_LONG) mainTitleLength = "very-long";
  else if (mainTitle.length >= WHOLE.LONG) mainTitleLength = "long";

  if (mainTitleLength !== "very-long")
    //Check by word only if the length is not very-long already.
    for (let mainWord of mainTitle.split(" ")) {
      if (mainWord.length >= BY_WORD.VERY_LONG) {
        mainTitleLength = "very-long";
        break;
      } else if (mainWord.length >= BY_WORD.LONG) {
        mainTitleLength = "long";
        break;
      }
    }

  return { mainTitle, secondaryTitle, mainTitleLength };
}

/**Get the full URL of a backdrop image for the specified path. If `isMain`, the quality is the highest available.
 * @param {string} backdropPath
 * @param {boolean} isMain
 */
export function getBackdropURL(backdropPath, isMain) {
  const config = JSON.parse(localStorage.getItem(CONFIG_LOCAL_STORAGE_NAME));

  const baseImageURL = config.images.base_url;
  const availableSizes = config.images.backdrop_sizes;

  const size = isMain ? availableSizes.at(-1) : availableSizes.at(-3); //For non-main movies, quality is the third-best.

  return `${baseImageURL}/${size}${backdropPath}`;
}

/**
 * @template T
 * @param {T} o
 * @returns {T}
 */
function deepFreeze(o) {
  Object.freeze(o);
  if (o === undefined) {
    return o;
  }

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (
      o[prop] !== null &&
      (typeof o[prop] === "object" || typeof o[prop] === "function") &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}
