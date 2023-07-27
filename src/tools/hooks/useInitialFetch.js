import { useEffect } from "react";

import { getApiUrl } from "@static/api";

/**A ready-to-use fetch wrapped in `useEffect` that executes on mount and when `condition`, `endpoint` or `deps` change.
 *
 * It already handles abortion on unmounting and the `AbortError` is ignored and doesn't execute `callback`.
 *
 * @param {Object} config
 * @param {string} config.endpoint The `endpoint` to fetch from.
 * @param {boolean} config.condition A condition to perform the request; if not met, the request is not performed. The request retries when the condition is updated. Is `true` by default.
 * @param {Array<any>} config.deps Additional dependencies for the `useEffect`.
 * @param {({ data, error }) => void} callback Function to execute on success or error.
 */
function useInitialFetch(
  { endpoint, condition = true, deps = [] } = {},
  callback
) {
  useEffect(() => {
    if (condition) {
      const abortController = new AbortController();

      fetch(getApiUrl(endpoint), { signal: abortController.signal })
        .then((res) =>
          res
            .json()
            .then((data) => callback({ data }))
            .catch((error) => callback({ error }))
        )
        .catch(
          (error) =>
            error.name != "AbortError" &&
            error.code != 20 &&
            callback({ error })
        );

      return () => abortController.abort();
    }
  }, [endpoint, condition, ...deps]);
}

export default useInitialFetch;
