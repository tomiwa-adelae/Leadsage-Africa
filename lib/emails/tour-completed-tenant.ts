import { env } from "../env";

interface Props {
  name: string;
  location: string;
  date: string;
  time: string;
  landlordName: string;
  id: string;
}

export const tourCompletedTenant = ({
  name,
  location,
  date,
  time,
  landlordName,
  id,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Leadsage Africa – Tour Completed</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-semibold mb-2">🏡 Tour Completed</h1>
    <p class="opacity-90 m-0">Your property viewing has been marked complete</p>

    <div class="p-10">
      <p class="mb-6 text-gray-700 leading-relaxed">
        Hi <span class="font-bold">${name}</span>,<br /><br />
        Thank you for touring the property at <span class="font-bold">${location}</span> 
        on <span class="font-bold">${date}</span> at <span class="font-bold">${time}</span> 
        with <span class="font-bold">${landlordName}</span>.
      </p>

      <p class="text-gray-700 leading-relaxed">
        What’s next? Let’s take the next step toward finding your dream home:
      </p>

      <div class="text-center my-8 space-y-4">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/bookings/${id}?interested=true"
          class="inline-block bg-green-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-green-700"
        >
          Apply for This Property
        </a>
        <br />
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/listings"
          class="inline-block bg-gray-700 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-800"
        >
          Explore Other Properties
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed">
        Your feedback also matters! It helps us and landlords improve the experience for future renters. 
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/feedback"
          class="inline-block bg-yellow-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-yellow-600"
        >
          Leave Feedback
        </a>
      </div>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Questions? Contact us at
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
