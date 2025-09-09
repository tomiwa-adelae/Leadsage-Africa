import { env } from "../env";

interface Props {
  name: string;
  location: string;
}

export const applicationRejectedTenant = ({ name, location }: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Update – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-semibold mb-2">Application Update</h1>
    <p class="opacity-90 m-0">Your rental application was not approved</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${name}</span>,<br /><br />
        Thank you for applying for the property at 
        <span class="font-bold">${location}</span>.  
        Unfortunately, your application was not approved this time.
      </p>

      <p class="text-gray-700 leading-relaxed mb-6">
        We understand this may be disappointing, but don’t worry — 
        there are many other homes available that might be the perfect fit for you.
      </p>

      <div class="text-center my-8 space-y-4">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/listings"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700"
        >
          Browse Other Properties
        </a>
        <br />
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
          class="inline-block bg-gray-700 text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-800"
        >
          Go to Dashboard
        </a>
      </div>

      <p class="text-gray-600">
        Keep exploring with Leadsage Africa — your dream home is waiting. 🏡
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Need support? Contact us at
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
