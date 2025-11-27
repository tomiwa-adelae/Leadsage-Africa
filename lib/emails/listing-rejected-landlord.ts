import { env } from "../env";

interface Props {
  landlordName: string;
  property: string;
  reason: string; // admin rejection reason
  slug: string;
}

export const listingRejectedLandlord = ({
  landlordName,
  property,
  reason,
  slug,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Listing Rejected – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2 text-red-600">❌ Listing Rejected</h1>
    <p class="opacity-90 m-0">Your property listing requires updates before it can go live</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${landlordName}</span>,<br /><br />
        Unfortunately, your listing for 
        <span class="font-bold">${property}</span> could not be approved at this time.  
        Our review team flagged some issues that need to be resolved before it can go live.
      </p>

      <div class="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-3">Reason for Rejection</h3>
        <p class="text-gray-700">
          ${reason}
        </p>
      </div>

      <div class="bg-slate-50 p-5 rounded-lg my-6">
        <h4 class="font-medium text-gray-800 mb-3">Next Steps</h4>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Update your listing details to address the rejection reason.</li>
          <li>Ensure your property information, images, and pricing are accurate.</li>
          <li>Resubmit your listing for approval through your dashboard.</li>
        </ul>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/landlord/listings/${slug}"
          class="inline-block bg-red-600 text-white py-3 px-8 rounded-full font-medium hover:bg-red-700"
        >
          Update & Resubmit Listing
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed">
        We want your property to find the right tenants as quickly as possible.  
        Once corrected, your listing will be reviewed again promptly.  
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Need clarification? Reach out at
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>
      </p>
    </div>
  </div>
</body>
</html>
`;
