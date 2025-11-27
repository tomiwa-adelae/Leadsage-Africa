import { env } from "../env";

interface Props {
  name: string;
  location: string;
  id: string;
}

export const applicationApprovedTenant = ({ name, location, id }: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Approved – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2">🎉 Congratulations!</h1>
    <p class="opacity-90 m-0">Your rental application has been approved</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${name}</span>,<br /><br />
        Great news! Your application for the property at <span class="font-bold">${location}</span> 
        has been <span class="text-green-600 font-bold">approved</span>.
      </p>

      <p class="text-gray-700 leading-relaxed mb-6">
        What’s next? You’ll need to finalize the rental by reviewing and signing the lease agreement, 
        and completing any required payments (such as the security deposit or first month’s rent).
      </p>

      <div class="text-center my-8 space-y-4">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/applications/${id}"
          class="inline-block bg-green-600 text-white py-3 px-8 rounded-full font-medium hover:bg-green-700"
        >
          View Application Status
        </a>
        <br />
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          Go to Dashboard
        </a>
      </div>

      <p class="text-gray-600">
        Our team will be here to guide you through the final steps until you officially move in. 
        Welcome closer to your new home! 🏡
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Questions? Contact us at
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
