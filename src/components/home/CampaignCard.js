import Link from "next/link";

export default function CampaignCard({ campaign }) {
  const progress = Math.min(100, Math.round((campaign.amount_raised / campaign.funding_goal) * 100) || 0);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition hover:border-emerald-500/50">
      <div className="aspect-video w-full overflow-hidden bg-neutral-800">
        {campaign.campaign_image_url ? (
          <img src={campaign.campaign_image_url} alt={campaign.campaign_title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-600">No image</div>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-emerald-400">{campaign.category}</span>
        <h3 className="mt-1 line-clamp-1 font-semibold">{campaign.campaign_title}</h3>
        <p className="mt-1 text-xs text-neutral-500">by {campaign.creator_name}</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
          <div className="h-full bg-emerald-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
          <span>{campaign.amount_raised || 0} / {campaign.funding_goal} credits</span>
          <span>Ends {campaign.deadline}</span>
        </div>
        <Link href={`/campaign/${campaign._id}`} className="mt-4 block rounded-full bg-emerald-500 px-4 py-2 text-center text-sm font-medium text-neutral-950 hover:bg-emerald-400">
          View Details
        </Link>
      </div>
    </div>
  );
}