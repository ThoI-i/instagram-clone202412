/**
 * 디바운스 함수
 * @param {Function} fn - 실행할 함수
 * @param {number} delay - 지연시간 (ms)
 * @returns {Function} 디바운스된 함수
 */
export function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}
/**
 * 쓰로틀 함수
 * @param {Function} fn - 실행할 함수
 * @param {number} limit - 제한시간 (ms)
 * @returns {Function} 쓰로틀된 함수
 */
export function throttle(fn, limit) {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}