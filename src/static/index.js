//Pure functions and constant values used in multiple components in the project.

/**Base key of all movie images stored as dataURL in the Local Storage (or Session Storage for temporary files). */
export const MOVIE_LOCAL_STORAGE_NAME = "LiteFlixChallenge_imageDataURL";

/**Characters that separate the main title from the secondary title.*/
const MOVIE_SEPARATORS = [":", "-", ","];

/**Different lengths of the main title to consider it "long" or "very long". */
const LENGTH_CRITERIAS = Object.freeze({
  /**Length of the whole main title. */
  WHOLE: Object.freeze({ LONG: 10, VERY_LONG: 20 }),
  /**Length of a single word of the main title.*/
  BY_WORD: Object.freeze({ LONG: 8, VERY_LONG: 12 }),
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
  return `${MOVIE_LOCAL_STORAGE_NAME}_${fileName}`;
}

/**Returns the full local storage key of a given file name and title. Used for permanent uploaded files.
 * @param {string} fileName
 * @param {string} title
 */
export function getSavedMovieKey(fileName, title) {
  return `${title}/${MOVIE_LOCAL_STORAGE_NAME}_${fileName}`;
}

/**Returns the title of a saved movie given it's saveKey.
 * @param {string} savedKey
 */
export function getSavedMovieTitle(savedKey) {
  return savedKey.split("/")[0];
}

/**Processes the title of a movie and returns the main part, the secondary part, and a key indicating
 * the main part length approximately.
 * @param {string} title.
 * @returns {{mainTitle: string, secondaryTitle: string, mainTitleLength: "average" | "long" | "very-long"}}
 */
export function parseMovieTitle(title) {
  //Separate titles starting by finding the last separator in the string.
  var separatingIndex = Math.max(
    ...MOVIE_SEPARATORS.map((sep) => title.indexOf(sep))
  );
  if (separatingIndex < 0) separatingIndex = title.length; //No separator found, don't separate.

  const mainTitle = title.substring(0, separatingIndex);
  const secondaryTitle = title.substring(separatingIndex + 1);

  //Check title length starting by checking the whole title and then by-word.
  var mainTitleLength = "average";

  if (mainTitle.length >= LENGTH_CRITERIAS.WHOLE.VERY_LONG)
    mainTitleLength = "very-long";
  else if (mainTitle.length >= LENGTH_CRITERIAS.WHOLE.LONG)
    mainTitleLength = "long";

  console.log(mainTitleLength);

  if (mainTitleLength !== "very-long")
    //Check by word only if the length is not very-long already.
    for (let mainWord of mainTitle.split(" ")) {
      if (mainWord.length >= LENGTH_CRITERIAS.BY_WORD.VERY_LONG) {
        mainTitleLength = "very-long";
        break;
      } else if (mainWord.length >= LENGTH_CRITERIAS.BY_WORD.LONG) {
        mainTitleLength = "long";
        break;
      }
    }

  return { mainTitle, secondaryTitle, mainTitleLength };
}
