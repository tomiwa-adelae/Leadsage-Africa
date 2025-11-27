import { env } from "../env";

interface Props {
  userName: string;
  property: string;
  endDate: string;
}

export const leaseTerminatedUser = ({ userName, property, endDate }: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lease Terminated – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2 text-red-600">⚠️ Lease Terminated</h1>
    <p class="opacity-90 m-0">Your rental agreement has been closed</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${userName}</span>,<br /><br />
        This is to inform you that your lease for 
        <span class="font-bold">${property}</span> has been officially terminated as of 
        <span class="font-bold">${endDate}</span>.
      </p>

      <div class="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-3">What This Means</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>You no longer have an active rental agreement at <strong>${property}</strong>.</li>
          <li>Future rent payments will not be processed.</li>
          <li>If applicable, kindly finalize your move-out process with your landlord.</li>
        </ul>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/listings"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          Find a New Home
        </a>
        <a
          href="mailto:${env.SUPPORT_EMAIL_ADDRESS}"
          class="inline-block bg-gray-700 text-white py-3 px-8 rounded-full font-medium hover:bg-gray-800 ml-2"
        >
          Contact Support
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed">
        Thank you for being part of the Leadsage community. We wish you the best in your housing journey, and remember you can always explore verified listings on our platform.
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
