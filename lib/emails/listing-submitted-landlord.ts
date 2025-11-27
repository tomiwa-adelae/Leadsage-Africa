import { env } from "../env";

interface Props {
  landlordName: string;
  property: string;
}

export const listingSubmittedLandlord = ({ landlordName, property }: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Listing Submitted – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2 text-blue-700">📌 Listing Submitted</h1>
    <p class="opacity-90 m-0">Your property is under review</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${landlordName}</span>,<br /><br />
        Thank you for submitting your new listing for 
        <span class="font-bold">${property}</span>.  
        Our admin team is currently reviewing your submission.
      </p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-3">What Happens Next?</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Your listing is being reviewed for quality and accuracy.</li>
          <li>You’ll receive an update once it has been approved or requires edits.</li>
          <li>Once approved, it will go live on the platform for tenants to see.</li>
        </ul>
      </div>

      <p class="text-gray-700 leading-relaxed">
        You can check the status of your listing anytime in your dashboard.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          View Dashboard
        </a>
      </div>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">For support, contact us at 
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>
      </p>
    </div>
  </div>
</body>
</html>
`;
