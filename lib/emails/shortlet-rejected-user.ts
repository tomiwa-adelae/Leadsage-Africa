import { env } from "../env";

interface Props {
  userName: string;
  property: string | null;
  startDate: string;
  endDate: string;
  shortletID: string;
  rejectionReason?: string;
}

export const shortletRejectedUser = ({
  userName,
  property,
  startDate,
  endDate,
  shortletID,
  rejectionReason,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Request Update – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-semibold mb-2 text-orange-600">📋 Booking Request Update</h1>
    <p class="opacity-90 m-0">Regarding your shortlet booking request</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${userName}</span>,<br /><br />
        Thank you for your interest in
        <span class="font-bold">${property}</span>.
      </p>

      <p class="text-gray-700 leading-relaxed mb-6">
        Unfortunately, we're unable to confirm your booking request for the selected dates.
      </p>

      <div class="bg-gray-50 border-l-4 border-gray-400 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Booking Request Details</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li><span class="font-semibold">Booking ID:</span> ${shortletID}</li>
          <li><span class="font-semibold">Property:</span> ${property}</li>
          <li><span class="font-semibold">Check-in:</span> ${startDate}</li>
          <li><span class="font-semibold">Check-out:</span> ${endDate}</li>
        </ul>
      </div>

      ${
        rejectionReason
          ? `
      <div class="bg-orange-50 border-l-4 border-orange-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Reason</h3>
        <p class="text-gray-700">${rejectionReason}</p>
      </div>
      `
          : ""
      }

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">💡 What's Next?</h3>
        <p class="text-gray-700 mb-3">
          We have many other amazing properties available! You can:
        </p>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li>Browse alternative properties with similar features</li>
          <li>Try different dates for this property</li>
          <li>Contact us for personalized recommendations</li>
        </ul>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/listings?category=Short+let"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700"
        >
          Browse Available Shortlets
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed mt-6">
        We're sorry we couldn't accommodate your request this time, but we'd love to help you find the perfect property.
        Our team is here to assist you with any questions.
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
