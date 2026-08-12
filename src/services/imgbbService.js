/**
 * uploadImageToImgBB()
 * ---------------------
 * একটা image File অবজেক্ট নিয়ে ImgBB তে আপলোড করে এবং hosted URL রিটার্ন করে।
 * Register পেজ (profile picture) এবং Add New Campaign পেজ (cover image) —
 * দুই জায়গাতেই এই একই ফাংশন রিইউজ হবে।
 *
 * @param {File} imageFile - ইউজারের সিলেক্ট করা ইমেজ ফাইল
 * @returns {Promise<string>} - ImgBB তে হোস্ট হওয়া ইমেজের URL
 */
export default async function uploadImageToImgBB(imageFile) {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error("ImgBB API key is missing. Please set NEXT_PUBLIC_IMGBB_API_KEY in .env.local");
  }

  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!data.success) {
    throw new Error(data?.error?.message || "Image upload failed");
  }

  return data.data.display_url;
}