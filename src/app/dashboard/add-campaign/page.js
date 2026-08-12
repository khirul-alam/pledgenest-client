"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import uploadImageToImgBB from "../../../services/imgbbService";
import { createCampaign } from "../../../services/campaignService";

const CATEGORIES = ["Technology", "Art", "Community", "Health", "Education", "Environment"];

export default function AddCampaignPage() {
  const axiosSecure = useAxiosSecure();
  const router = useRouter();

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const campaign_title = form.campaign_title.value.trim();
    const campaign_story = form.campaign_story.value.trim();
    const category = form.category.value;
    const funding_goal = form.funding_goal.value;
    const minimum_contribution = form.minimum_contribution.value;
    const deadline = form.deadline.value;
    const reward_info = form.reward_info.value.trim();

    if (!campaign_title || !campaign_story || !funding_goal || !minimum_contribution || !deadline) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!imageFile) {
      toast.error("Please upload a cover image");
      return;
    }
    if (Number(minimum_contribution) > Number(funding_goal)) {
      toast.error("Minimum contribution can't exceed the funding goal");
      return;
    }

    setSubmitting(true);
    try {
      const campaign_image_url = await uploadImageToImgBB(imageFile);

      await createCampaign(axiosSecure, {
        campaign_title,
        campaign_story,
        category,
        funding_goal,
        minimum_contribution,
        deadline,
        reward_info,
        campaign_image_url,
      });

      toast.success("Campaign submitted! It will be visible after admin approval.");
      router.push("/dashboard/my-campaigns");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "Failed to create campaign");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Add New Campaign</h1>
      <p className="mt-1 text-sm text-neutral-400">Your campaign will be reviewed by an admin before it goes live.</p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-sm text-neutral-300">Campaign Title</label>
          <input name="campaign_title" type="text" placeholder="Help us build a solar-powered water pump" className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400" />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Campaign Story</label>
          <textarea name="campaign_story" rows={5} placeholder="Describe your project, why it matters, and how the funds will be used..." className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400" />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Category</label>
          <select name="category" defaultValue={CATEGORIES[0]} className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400">
            {CATEGORIES.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Funding Goal (credits)</label>
            <input name="funding_goal" type="number" min={1} placeholder="1000" className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-300">Minimum Contribution (credits)</label>
            <input name="minimum_contribution" type="number" min={1} placeholder="10" className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Deadline</label>
          <input name="deadline" type="date" min={new Date().toISOString().split("T")[0]} className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400" />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Reward Info</label>
          <input name="reward_info" type="text" placeholder="What supporters receive for contributing" className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 outline-none focus:border-emerald-400" />
        </div>

        <div>
          <label className="mb-1 block text-sm text-neutral-300">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-emerald-500 file:px-3 file:py-1 file:text-neutral-950" />
          {imagePreview && (<img src={imagePreview} alt="Preview" className="mt-3 aspect-video w-full rounded-lg object-cover" />)}
        </div>

        <button type="submit" disabled={submitting} className="mt-2 rounded-full bg-emerald-500 px-6 py-3 font-medium text-neutral-950 hover:bg-emerald-400 disabled:opacity-50">
          {submitting ? "Submitting..." : "Add Campaign"}
        </button>
      </form>
    </div>
  );
}