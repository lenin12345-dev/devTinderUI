// utils/imageUtils.js
export const extractImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/150?text=User";

  // If it's already a direct image URL, return it
  if (
    url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    url.includes("freepik") ||
    url.includes("unsplash")
  ) {
    return url;
  }

  // If it's a Google Images redirect, extract the actual URL
  if (url.includes("google.com/imgres")) {
    try {
      const match = url.match(/imgurl=([^&]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    } catch (e) {
      console.error("Error extracting image URL:", e);
    }
  }

  return url;
};
