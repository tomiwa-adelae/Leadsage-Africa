import { env } from "../env";

interface Props {
  userName: string;
  property: string | null;
  startDate: string;
  endDate: string;
  totalPrice: string;
  id: string;
}

export const shortletBookedUser = ({
  userName,
  property,
  startDate,
  endDate,
  totalPrice,
  id,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-semibold mb-2 text-blue-600">🎉 Booking Confirmed</h1>
    <p class="opacity-90 m-0">Your shortlet stay is officially confirmed</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${userName}</span>,<br /><br />
        Great news! Your booking for 
        <span class="font-bold">${property}</span> has been confirmed.
      </p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Booking Details</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li><span class="font-semibold">Check-in:</span> ${startDate}</li>
          <li><span class="font-semibold">Check-out:</span> ${endDate}</li>
          <li><span class="font-semibold">Total Price:</span> ₦${totalPrice}</li>
          <li><span class="font-semibold">Property:</span> ${property}</li>
        </ul>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/bookings/${id}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700"
        >
          View My Booking
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed">
        We look forward to hosting you! You can view your booking details, manage your stay, 
        or contact the host anytime through your dashboard.
      </p>

      <p class="text-gray-700 leading-relaxed mt-4">
        Don’t forget to check your email for check-in instructions closer to your stay date.
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
