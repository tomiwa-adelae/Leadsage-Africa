import { env } from "../env";

interface Props {
  name: string;
  location: string;
  date: string;
  time: string;
  reason?: string;
}

export const adminCancelTourTenant = ({
  name,
  location,
  date,
  time,
  reason,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Leadsage Africa – Tour Canceled by Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <div>
      <h1 class="text-2xl font-semibold mb-2">⚠️ Tour Canceled</h1>
      <p class="opacity-90 m-0">Your scheduled tour has been canceled by Leadsage</p>
    </div>

    <div class="p-10">
      <p class="mb-6 text-gray-700 leading-relaxed">
        Hi <span class="font-bold">${name}</span>,<br /><br />
        We regret to inform you that your scheduled property tour at
        <span class="font-bold">${location}</span> on
        <strong>${date}</strong> at <strong>${time}</strong> has been
        <span class="text-red-600 font-semibold">canceled</span> by Leadsage Admin.
      </p>

      ${
        reason
          ? `<div class="bg-red-50 border-l-4 border-red-500 p-5 my-6 rounded-r-lg">
              <p class="text-gray-700">
                <strong>Reason Provided:</strong> ${reason}
              </p>
            </div>`
          : ""
      }

      <p class="text-gray-700 leading-relaxed">
        We apologize for the inconvenience. You can choose a new time and reschedule your tour directly from your dashboard.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700"
        >
          Reschedule Tour
        </a>
      </div>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Need help? Contact us at 
        <a href="mailto:${
          env.SUPPORT_EMAIL_ADDRESS
        }" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
