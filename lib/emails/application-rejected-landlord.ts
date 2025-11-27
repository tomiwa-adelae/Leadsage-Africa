import { env } from "../env";

interface Props {
  landlordName: string;
  tenantName: string;
  location: string;
}

export const applicationRejectedLandlord = ({
  landlordName,
  tenantName,
  location,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Rejected – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2">Application Rejected</h1>
    <p class="opacity-90 m-0">The tenant’s application was not approved</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${landlordName}</span>,<br /><br />
        The application submitted by <span class="font-bold">${tenantName}</span> 
        for your property at <span class="font-bold">${location}</span> 
        has been <span class="text-red-600 font-bold">rejected</span> by the admin team.
      </p>

      <p class="text-gray-700 leading-relaxed mb-6">
        You don’t need to take any further action at this time. 
        We’ll notify you when new applications come in for this property.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/landlord/dashboard"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          Go to Dashboard
        </a>
      </div>

      <p class="text-gray-600">
        Stay tuned for more applicants through Leadsage Africa. 
      </p>
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
