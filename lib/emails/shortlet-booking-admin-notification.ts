import { env } from "../env";

interface Props {
  userName: string;
  userEmail: string;
  userPhone: string | null;
  property: string | null;
  startDate: string;
  endDate: string;
  totalPrice: string;
  shortletID: string;
  bookingId: string;
}

export const shortletBookingAdminNotification = ({
  userName,
  userEmail,
  userPhone,
  property,
  startDate,
  endDate,
  totalPrice,
  shortletID,
  bookingId,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Shortlet Booking Request – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2 text-orange-600">🔔 New Shortlet Booking Request</h1>
    <p class="opacity-90 m-0">Action required: Review and confirm availability</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hello Admin,<br /><br />
        A new shortlet booking request has been submitted and requires your confirmation.
      </p>

      <div class="bg-orange-50 border-l-4 border-orange-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-3">Booking Details</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li><span class="font-medium">Booking ID:</span> ${shortletID}</li>
          <li><span class="font-medium">Property:</span> ${property}</li>
          <li><span class="font-medium">Check-in:</span> ${startDate}</li>
          <li><span class="font-medium">Check-out:</span> ${endDate}</li>
          <li><span class="font-medium">Total Price:</span> ₦${totalPrice}</li>
        </ul>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-3">Customer Information</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-700">
          <li><span class="font-medium">Name:</span> ${userName}</li>
          <li><span class="font-medium">Email:</span> <a href="mailto:${userEmail}" class="text-blue-600">${userEmail}</a></li>
          <li><span class="font-medium">Phone:</span> ${
            userPhone || "Not provided"
          }</li>
        </ul>
      </div>

      <div class="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">⚡ Action Required</h3>
        <p class="text-gray-700">
          Please verify the availability of this property for the requested dates and confirm or reject this booking.
        </p>
      </div>

      <div class="text-center my-8 flex gap-4 justify-center">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/admin/shortlets/${bookingId}"
          class="inline-block bg-green-600 text-white py-3 px-8 rounded-full font-medium hover:bg-green-700"
        >
          Review & Confirm
        </a>
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/admin/shortlets"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          View All Requests
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed mt-4 text-center text-sm">
        Customer is waiting for confirmation. Please respond within 24 hours.
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa Admin Panel</p>
      <p class="m-0">
        This is an automated notification for admin users only.
      </p>
    </div>
  </div>
</body>
</html>
`;
