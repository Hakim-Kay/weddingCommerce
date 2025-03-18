/**
 * TwicPics utility functions for handling image paths
 */

/**
 * Formats a Supabase storage image path for TwicPics
 *
 * TwicPics is configured with:
 * - Path: https://elisa-makini.twic.pics/
 * - Source URL: https://pidimnoauortugjylfhw.supabase.co/storage/v1/object/public/Wedding%20Images/
 *
 * This function prioritizes relative paths and falls back to extracting from full URLs
 *
 * @param {string} imagePath - Relative path (e.g., "Bachelors/DSC01526.jpg") or full Supabase URL
 * @returns {string} Formatted path for TwicPics
 */
export function formatTwicPicsPath(imagePath) {
    // If it doesn't include 'supabase.co', assume it's already a relative path
    if (!imagePath.includes('supabase.co')) {
        return imagePath;
    }
    
    // If it's a full Supabase URL, extract just the path part after "Wedding Images/"
    // Find the position of "Wedding Images/" in the URL and get everything after it
    const basePathIndex = imagePath.indexOf('Wedding%20Images/');
    if (basePathIndex !== -1) {
        return imagePath.substring(basePathIndex + 'Wedding%20Images/'.length);
    }
    
    // Alternative check for non-URL-encoded version
    const altBasePathIndex = imagePath.indexOf('Wedding Images/');
    if (altBasePathIndex !== -1) {
        return imagePath.substring(altBasePathIndex + 'Wedding Images/'.length);
    }
    
    // If we can't find the expected pattern, return the original path
    console.warn('Unable to parse Supabase URL correctly:', imagePath);
    return imagePath;
}

/**
 * Gets the full TwicPics URL for an image
 *
 * @param {string} imagePath - Full Supabase URL or relative path
 * @param {Object} [options] - Optional TwicPics transformation options
 * @returns {string} Complete TwicPics URL
 */
export function getTwicPicsUrl(imagePath, options = {}) {
    const formattedPath = formatTwicPicsPath(imagePath)

    // Base TwicPics URL
    let url = `https://elisa-makini.twic.pics/${encodeURIComponent(formattedPath)}`

    // Add transformation parameters if provided
    const params = new URLSearchParams()

    Object.entries(options).forEach(([key, value]) => {
        params.append(key, value.toString())
    })

    const queryString = params.toString()
    if (queryString) {
        url += `?${queryString}`
    }

    return url
}

/**
 * Creates a TwicPics src attribute value for use in TwicImg component
 *
 * @param {string} imagePath - Full Supabase URL or relative path
 * @returns {string} Path to use in TwicImg src attribute
 */
export function getTwicPicsSrc(imagePath) {
    return formatTwicPicsPath(imagePath)
}
