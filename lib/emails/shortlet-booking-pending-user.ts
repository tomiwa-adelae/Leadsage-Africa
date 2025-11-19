import { env } from "../env";

interface Props {
  userName: string;
  property: string | null;
  startDate: string;
  endDate: string;
  totalPrice: string;
  shortletID: string;
}

export const shortletBookingPendingUser = ({
  userName,
  property,
  startDate,
  endDate,
  totalPrice,
  shortletID,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Shortlet Booking Request Received – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-semibold mb-2 text-blue-600">📝 Booking Request Received</h1>
    <p class="opacity-90 m-0">We're reviewing your shortlet booking</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${userName}</span>,<br /><br />
        Thank you for your interest in
        <span class="font-bold">${property}</span>!
      </p>

      <p class="text-gray-700 leading-relaxed mb-6">
        We've received your booking request and our team is currently verifying the availability
        of this property for your selected dates. We'll get back to you shortly with a confirmation.
      </p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Booking Request Details</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li><span class="font-semibold">Booking ID:</span> ${shortletID}</li>
          <li><span class="font-semibold">Check-in:</span> ${startDate}</li>
          <li><span class="font-semibold">Check-out:</span> ${endDate}</li>
          <li><span class="font-semibold">Total Price:</span> ₦${totalPrice}</li>
          <li><span class="font-semibold">Property:</span> ${property}</li>
        </ul>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">⏰ What's Next?</h3>
        <p class="text-gray-700">
          Our team will review your request within 24 hours. Once confirmed, you'll receive an email
          with a secure payment link to complete your booking.
        </p>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/bookings/shortlets/${shortletID}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700"
        >
          View Booking Status
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed mt-4">
        If you have any questions, feel free to contact us at any time.
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Need help? Contact us at
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>
        or call us at ${env.NEXT_PUBLIC_LEADSAGE_PHONE_NUMBER}.
      </p>
    </div>
  </div>
</body>
</html>
`;
