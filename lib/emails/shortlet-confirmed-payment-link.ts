import { env } from "../env";

interface Props {
  userName: string;
  property: string | null;
  startDate: string;
  endDate: string;
  totalPrice: string;
  shortletID: string;
  paymentToken: string;
  bookingId: string;
}

export const shortletConfirmedPaymentLink = ({
  userName,
  property,
  startDate,
  endDate,
  totalPrice,
  shortletID,
  paymentToken,
  bookingId,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed – Complete Your Payment – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2 text-green-600">✅ Great News! Your Booking is Confirmed</h1>
    <p class="opacity-90 m-0">Complete your payment to secure your reservation</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${userName}</span>,<br /><br />
        Fantastic news! We've confirmed that
        <span class="font-bold">${property}</span> is available for your selected dates.
      </p>

      <div class="bg-green-50 border-l-4 border-green-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-3">✓ Confirmed Booking Details</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li><span class="font-medium">Booking ID:</span> ${shortletID}</li>
          <li><span class="font-medium">Check-in:</span> ${startDate}</li>
          <li><span class="font-medium">Check-out:</span> ${endDate}</li>
          <li><span class="font-medium">Total Price:</span> ₦${totalPrice}</li>
          <li><span class="font-medium">Property:</span> ${property}</li>
        </ul>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">💳 Next Step: Complete Payment</h3>
        <p class="text-gray-700 mb-4">
          Your reservation is confirmed! To finalize your booking, please complete the payment using the secure link below.
        </p>
        <p class="text-sm text-gray-600">
          <strong>Important:</strong> This payment link is valid for 48 hours and is unique to your booking.
        </p>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/shortlets/payment?token=${paymentToken}&id=${bookingId}"
          class="inline-block bg-green-600 text-white py-4 px-10 rounded-full font-bold text-lg hover:bg-green-700 shadow-lg"
        >
          💳 Pay Now - ₦${totalPrice}
        </a>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">⚠️ Important Notes</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700 text-sm">
          <li>This payment link expires in 48 hours</li>
          <li>Your reservation will be held during this time</li>
          <li>Once payment is completed, you'll receive a confirmation email with check-in instructions</li>
          <li>For security, do not share this payment link with anyone</li>
        </ul>
      </div>

      <div class="text-center my-6">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/bookings/shortlets/${bookingId}"
          class="text-blue-600 hover:text-blue-700 underline"
        >
          View Booking Details
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed mt-6">
        We're excited to host you! If you have any questions or need assistance with the payment process,
        please don't hesitate to contact us.
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
