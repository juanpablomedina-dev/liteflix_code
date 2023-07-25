import { useEffect } from "react";

/**A ready-to-use fetch wrapped in `useEffect` that executes on mount and when `condition` or `url` change.
 *
 * It already handles abortion on unmounting and the `AbortError` is ignored and doesn't execute `callback`.
 *
 * _Note_: Only requires `url` in this App where requests are very simple GETs.
 *
 * @param {string} url The `url` to fetch from.
 * @param {({ data, error }) => void} callback Function to execute on success or error.
 * @param {Object} config
 * @param {boolean} config.condition A condition to perform the request; if not met, the request is not performed. The request retries when the condition is updated. Is `true` by default.
 */
function useInitialFetch(url, callback, { condition = true } = {}) {
  useEffect(() => {
    if (condition) {
      const abortController = new AbortController();

      fetch(url, { signal: abortController.signal })
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
  }, [url, condition]);
}

export default useInitialFetch;
