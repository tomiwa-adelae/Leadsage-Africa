import { env } from "../env";

interface Props {
  userName: string;
  property: string;
  startDate: string;
  endDate: string;
  rent: string;
}

export const leaseRenewedUser = ({
  userName,
  property,
  startDate,
  endDate,
  rent,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lease Renewed – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-semibold mb-2 text-green-600">🔄 Lease Renewed</h1>
    <p class="opacity-90 m-0">Your lease has been successfully extended</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${userName}</span>,<br /><br />
        Great news! Your lease for <span class="font-bold">${property}</span> has been renewed.  
      </p>

      <div class="bg-green-50 border-l-4 border-green-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Renewed Lease Details</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li><span class="font-semibold">Start Date:</span> ${startDate}</li>
          <li><span class="font-semibold">New End Date:</span> ${endDate}</li>
          <li><span class="font-semibold">Rent:</span> ₦${rent}</li>
          <li><span class="font-semibold">Property:</span> ${property}</li>
        </ul>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700"
        >
          View My Lease
        </a>
        <a
          href="mailto:${env.SUPPORT_EMAIL_ADDRESS}"
          class="inline-block bg-gray-700 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-800 ml-2"
        >
          Contact Support
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed">
        Your lease continues without interruption. You can manage payments, view agreements, and stay connected with your landlord directly from your dashboard.  
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
