import { env } from "../env";

interface Props {
  name: string;
  location: string;
  landlordName: string;
  id: string;
}

export const applicationSubmittedTenant = ({
  name,
  location,
  landlordName,
  id,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Submitted – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2">✅ Application Submitted!</h1>
    <p class="opacity-90 m-0">Your rental application has been received</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${name}</span>,<br /><br />
        Your application for the property at <span class="font-bold">${location}</span> 
        has been successfully submitted to <span class="font-bold">${landlordName}</span>.
      </p>

      <p class="text-gray-700 leading-relaxed mb-6">
        What’s next? The landlord will review your application and may reach out for further details or supporting documents. 
        You can track your application status anytime from your dashboard.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/applications/${id}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          Track Applications Progress
        </a>
      </div>

      <p class="text-gray-600">
        Thank you for choosing <span class="font-bold">Leadsage Africa</span> to find your dream home. 
        We’ll keep you updated every step of the way.
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
