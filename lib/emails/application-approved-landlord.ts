import { env } from "../env";

interface Props {
  landlordName: string;
  tenantName: string;
  location: string;
  id: string;
}

export const applicationApprovedLandlord = ({
  landlordName,
  tenantName,
  location,
  id,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tenant Application Approved – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2">✅ Tenant Application Approved</h1>
    <p class="opacity-90 m-0">You’re ready to move forward with your new tenant</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${landlordName}</span>,<br /><br />
        The application submitted by <span class="font-bold">${tenantName}</span> 
        for your property at <span class="font-bold">${location}</span> has been 
        <span class="text-green-600 font-bold">approved</span>.
      </p>

      <p class="text-gray-700 leading-relaxed mb-6">
        Next, please connect with the tenant to finalize the lease agreement, 
        confirm move-in details, and complete payment arrangements.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/landlord/applications/${id}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          Manage Application
        </a>
      </div>

      <p class="text-gray-600">
        Responding quickly will help secure your new tenant and create a smooth transition.
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Need assistance? Contact us at
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
