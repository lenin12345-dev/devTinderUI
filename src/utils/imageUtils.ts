// utils/imageUtils.js
export const extractImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/400x500?text=User+Profile";

  // If it's already a direct image URL, return it
  if (
    url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
    url.includes("freepik") ||
    url.includes("unsplash") ||
    url.includes("placeholder") ||
    url.includes("picsum") ||
    url.includes("avatars.githubusercontent")
  ) {
    return url;
  }

  // If it's a Google Images redirect/URL, try to extract the actual image URL
  if (url.includes("google.com")) {
    try {
      // Try extracting from imgurl parameter (from imgres)
      const imgUrlMatch = url.match(/imgurl=([^&]+)/);
      if (imgUrlMatch) {
        const extractedUrl = decodeURIComponent(imgUrlMatch[1]);
        console.log("✅ Extracted from google imgres:", extractedUrl);
        return extractedUrl;
      }

      // Try extracting from url parameter (from google.com/url redirect)
      const urlMatch = url.match(/url=([^&]+)/);
      if (urlMatch) {
        const extractedUrl = decodeURIComponent(urlMatch[1]);
        console.log("✅ Extracted from google url redirect:", extractedUrl);
        return extractedUrl;
      }
    } catch (e) {
      console.error("❌ Error extracting image URL:", e);
    }

    console.warn(
      "⚠️ Could not extract URL from Google redirect, using placeholder. Original URL:",
      url,
    );
    return "https://via.placeholder.com/400x500?text=User+Profile";
  }

  return url;
};
