import { env } from "../env";

interface Props {
  landlordName: string;
  tenantName: string;
  location: string;
  id: string;
}

export const applicationSubmittedLandlord = ({
  landlordName,
  tenantName,
  location,
  id,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Rental Application – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2">📩 New Application Received</h1>
    <p class="opacity-90 m-0">A tenant has applied for your property</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${landlordName}</span>,<br /><br />
        <span class="font-bold">${tenantName}</span> has submitted an application for your property at 
        <span class="font-bold">${location}</span>.
      </p>

      <p class="text-gray-700 leading-relaxed mb-6">
        Please log in to your dashboard to review the application details and take the next step.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/landlord/applications/${id}"
          class="inline-block bg-green-600 text-white py-3 px-8 rounded-full font-medium hover:bg-green-700"
        >
          Review Application
        </a>
      </div>

      <p class="text-gray-600">
        Responding promptly to applications helps ensure a smooth rental experience.
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Need help? Contact us at
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
