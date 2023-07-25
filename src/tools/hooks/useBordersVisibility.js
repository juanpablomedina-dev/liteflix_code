import { useState, useEffect } from "react";

/**
 * This hooks provides a quick visibility state for the top and bottom of the entire current page/document.
 * @param {Object} config
 * @param {number} config.pixelsForVisibleTop The amount of pixels from the top that are considered "top". Is 1 pixel by default.
 * @param {number} config.pixelsForVisibleBottom The amount of pixels from the bottom that are considered "bottom". Is 1 pixel by default.
 * @param {"top-sensor" | "bottom-sensor"} config.disable The specified border visibility sensor will be disabled and won't perform state updates.
 * @returns An object with the visibility state.
 */
function useBordersVisibility(config = {}) {
  //prettier-ignore
  const { pixelsForVisibleTop = 1, pixelsForVisibleBottom = 1, disable } = config;

  const [topVisible, setTopVisible] = useState(false);
  const [bottomVisible, setBottomVisible] = useState(false);

  //Add visibility sensor.
  useEffect(() => {
    const checkVisibility = () => {
      if (disable !== "top-sensor") {
        const is = window.scrollY <= pixelsForVisibleTop;
        setTopVisible((was) => (is !== was ? is : was));
      }

      if (disable !== "bottom-sensor") {
        const is =
          window.scrollY + window.innerHeight >=
          document.body.offsetHeight - pixelsForVisibleBottom; //See the file's bottom for a description of this.
        setBottomVisible((was) => (is !== was ? is : was));
      }
    };

    checkVisibility(); //Execute it once to check if not already in a border.
    window.addEventListener("scroll", checkVisibility);
    return () => window.removeEventListener("scroll", checkVisibility);
  }, [pixelsForVisibleTop, pixelsForVisibleBottom, disable]);

  return { top: topVisible, bottom: bottomVisible };
}

export default useBordersVisibility;

/** How to calculate visibility of the page's Bottom.
 *
 * window.scrollY provides the amount of pixels scrolled from the top of the entire page.
 * In other words, it tells the exact pixel in which the very top of the screen is at the moment.
 *
 * Adding the window.innerHeight to the previous amount gives us the exact pixel of the bottom
 * of the screen. Let's call this value bottom_current_pixel.
 *
 * document.body.offsetHeight provides the amount of pixels of the entire document's body (the entire page).
 * Let's call it page_height.
 *
 * We may define an arbitrary range of pixels from the bottom that we consider "the bottom". If the user scrolls
 * any further than that, then "the bottom is visible". Let's call it bottom_range.
 *
 * Lastly, the question would be: Is the bottom_current_pixel higher than the page_height - bottom_range?
 *
 * This question in code would be:
 * bottomVisible = window.scrollY + window.screen.height > document.body.offsetHeight - PIXELS_FOR_VISIBLE_BOTTOM
 *
 */
