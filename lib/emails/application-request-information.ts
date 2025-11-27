import { env } from "../env";

interface Props {
  name: string;
  location: string;
  id: string;
  additionalInfo: string; // e.g. "proof of income, valid ID"
}

export const applicationRequestInformation = ({
  name,
  location,
  id,
  additionalInfo,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Additional Information Required – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2">Action Required</h1>
    <p class="opacity-90 m-0">We need a bit more information for your application</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${name}</span>,<br /><br />
        Thanks for applying for the property at 
        <span class="font-bold">${location}</span>.  
        Before we can proceed, we need you to provide the following:
      </p>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">Missing Information:</h3>
        <p class="text-gray-700">${additionalInfo}</p>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard/applications/${id}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          Upload / Update Info
        </a>
      </div>

      <p class="text-gray-600">
        Once submitted, your application will be reviewed again promptly.  
        Don’t worry — this is a normal step in the process!
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
