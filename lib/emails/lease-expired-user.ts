import { env } from "../env";

interface Props {
  userName: string;
  property: string;
  expiryDate: string;
}

export const leaseExpiredUser = ({ userName, property, expiryDate }: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lease Expiration – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2 text-red-600">⚠️ Lease Expired</h1>
    <p class="opacity-90 m-0">Your rental lease has reached its end</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${userName}</span>,<br /><br />
        This is a friendly reminder that your lease for 
        <span class="font-bold">${property}</span> officially expired on 
        <span class="font-bold">${expiryDate}</span>.
      </p>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">Next Steps:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Renew your lease agreement (if you’d like to continue staying)</li>
          <li>Start exploring other available properties on Leadsage</li>
          <li>Contact your landlord or our support team for guidance</li>
        </ul>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          Renew Lease
        </a>
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/listings"
          class="inline-block bg-gray-700 text-white py-3 px-8 rounded-full font-medium hover:bg-gray-800 ml-2"
        >
          Browse New Homes
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed">
        Please take action soon to avoid disruptions. If you need help, our support team is always here for you.
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Questions? Contact us at
        <a href="mailto:\${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          \${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
