import React from "react";

import { BREAKPOINTS } from "../../static";

/**
 * Hook to quickly use reactive breakpoints for responsive behaviors.
 */
function useBreakpoint() {
  const [currentBpKey, setCurrentBpKey] = React.useState(getCurrentBP);

  React.useEffect(() => {
    const updateBreakpoint = () => setCurrentBpKey(getCurrentBP());
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  /**Checks if the current breakpoint is wider than the specified one.
   *
   * @param {import("@values/").ValidBreakpoint} bpName Breakpoint to compare with the current one.
   * @returns {boolean} The check result.
   */
  function isWiderThan(bpName) {
    const currentDeviceWidth = BREAKPOINTS[currentBpKey];
    const specifiedDeviceWidth = BREAKPOINTS[bpName];

    return currentDeviceWidth > specifiedDeviceWidth;
  }

  /**Sugar for checking for the desktop breakpoint.
   * @returns {boolean} `true` if the current screen width is considered "Desktop", `false` otherwise.
   */
  function isDesktop() {
    return isWiderThan(LAST_MOBILE_BREAKPOINT);
  }

  return {
    /**@type {import("@values/").ValidBreakpoint} */
    name: currentBpKey,
    isWiderThan,
    isDesktop,
  };
}

function getCurrentBP() {
  const width = window.innerWidth;

  for (let bpKey of SORTED_BREAKPOINTS)
    if (width > BREAKPOINTS[bpKey]) return bpKey;
}

const SORTED_BREAKPOINTS = Object.keys(BREAKPOINTS).sort(
  (bp1, bp2) => BREAKPOINTS[bp2] - BREAKPOINTS[bp1]
);

const LAST_MOBILE_BREAKPOINT = "tablet";

export default useBreakpoint;
