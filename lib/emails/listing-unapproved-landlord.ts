import { env } from "../env";

interface Props {
  landlordName: string;
  property: string;
  slug: string;
}

export const listingUnapprovedLandlord = ({
  landlordName,
  property,
  slug,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Listing Unapproved – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-semibold mb-2 text-orange-600">⚠️ Listing Unapproved</h1>
    <p class="opacity-90 m-0">Your property listing has been removed from the marketplace</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${landlordName}</span>,<br /><br />
        Your listing for <span class="font-bold">${property}</span> has been unapproved by our admin team.  
        This means it is no longer visible to renters on Leadsage Africa.
      </p>

      <div class="bg-slate-50 p-5 rounded-lg my-6">
        <h4 class="font-semibold text-gray-800 mb-3">What You Can Do</h4>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Review the reason above carefully.</li>
          <li>Make the necessary corrections to your listing.</li>
          <li>Once fixed, you can resubmit your listing for approval.</li>
        </ul>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/landlord/listings/${slug}"
          class="inline-block bg-orange-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-orange-700"
        >
          Review & Resubmit
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed">
        We want to maintain the highest standards for renters on Leadsage Africa.  
        Updating your listing helps ensure trust and transparency across the platform.
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Need help resolving this? Contact us at
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>
      </p>
    </div>
  </div>
</body>
</html>
`;
