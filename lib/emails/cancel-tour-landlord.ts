import { env } from "../env";

interface Props {
  landlordName: string;
  tenantName: string;
  location: string;
  date: string;
  time: string;
}

export const cancelTourLandlord = ({
  landlordName,
  tenantName,
  location,
  date,
  time,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Leadsage Africa – Tour Canceled</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <div>
      <h1 class="text-2xl font-semibold mb-2">⚠️ Tour Canceled</h1>
      <p class="opacity-90 m-0">A tenant has canceled their property viewing</p>
    </div>

    <div class="p-10">
      <p class="mb-6 text-gray-700 leading-relaxed">
        Hi <span class="font-bold">${landlordName}</span>,<br /><br />
        <span class="font-bold">${tenantName}</span> has canceled their scheduled tour for your property at 
        <span class="font-bold">${location}</span> on <strong>${date}</strong> at <strong>${time}</strong>.
      </p>

      <p class="text-gray-700 leading-relaxed">
        No action is required on your end. You will be notified if the tenant decides to reschedule.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700"
        >
          View Dashboard
        </a>
      </div>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        For support, contact 
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
