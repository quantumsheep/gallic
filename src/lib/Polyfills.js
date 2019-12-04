const Polyfills = {}
Polyfills.String = {}

/**
 * @param {string} str 
 * @param {number} start 
 * @param {number} count 
 * @param {string} sub 
 */
Polyfills.String.splice = (str, start, count, sub = '') => str.slice(0, start) + sub + str.slice(start + Math.abs(count))

/**
 * @param {string} str 
 * @param {number} start 
 * @param {string} sub 
 */
Polyfills.String.insert = (str, index, sub = '') => Polyfills.String.splice(str, index, 0, sub)

export default Polyfills
