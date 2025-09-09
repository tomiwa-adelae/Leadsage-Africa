import { env } from "../env";

interface Props {
  landlordName: string;
  property: string;
  slug: string;
}

export const listingApprovedLandlord = ({
  landlordName,
  property,
  slug,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Listing Approved – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-semibold mb-2 text-green-700">✅ Listing Approved!</h1>
    <p class="opacity-90 m-0">Your property is now live on Leadsage Africa</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${landlordName}</span>,<br /><br />
        Congratulations! Your listing for 
        <span class="font-bold">${property}</span> has been reviewed and approved.  
        It is now live on our platform and visible to thousands of potential renters.
      </p>

      <div class="bg-green-50 border-l-4 border-green-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">What Happens Next?</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Your property is now searchable on Leadsage Africa.</li>
          <li>Interested tenants can request tours and submit applications.</li>
          <li>You’ll receive email notifications as soon as tenants engage with your listing.</li>
        </ul>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/landlord/listings/${slug}"
          class="inline-block bg-green-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-green-700"
        >
          View My Listing
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed">
        Thank you for trusting Leadsage Africa to connect you with the right tenants.  
        If you have questions or need support, we’re always here to help.
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        For support, contact us at 
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>
      </p>
    </div>
  </div>
</body>
</html>
`;
