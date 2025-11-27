import { env } from "../env";

interface Props {
  landlordName: string;
  property: string;
  slug: string;
}

export const listingSubmittedAdmin = ({
  landlordName,
  property,
  slug,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Listing Pending Approval – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2 text-green-700">📝 New Listing Pending Approval</h1>
    <p class="opacity-90 m-0">Action required: review and approve listing</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hello Admin,<br /><br />
        A new listing has been submitted by <span class="font-bold">${landlordName}</span> for the property 
        <span class="font-bold">${property}</span>.
      </p>

      <div class="bg-green-50 border-l-4 border-green-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-3">Next Steps</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Review the property details, images, and pricing.</li>
          <li>Approve if it meets guidelines, or request edits if needed.</li>
          <li>Once approved, the listing will go live on the platform.</li>
        </ul>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/admin/listings/${slug}"
          class="inline-block bg-green-600 text-white py-3 px-8 rounded-full font-medium hover:bg-green-700"
        >
          Review Listing Now
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed">
        Please review promptly so the landlord can start receiving tenant interest.
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa – Admin Portal</p>
    </div>
  </div>
</body>
</html>
`;
