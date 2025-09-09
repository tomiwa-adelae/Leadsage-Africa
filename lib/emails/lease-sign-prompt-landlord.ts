import { env } from "../env";

interface Props {
  landlordName: string;
  tenantName: string;
  location: string;
  id: string;
}

export const leaseSignPromptLandlord = ({
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
  <title>Lease Agreement Pending – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-semibold mb-2">Your Signature Is Needed</h1>
    <p class="opacity-90 m-0">Tenant has already signed the lease</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${landlordName}</span>,<br /><br />
        Your tenant <span class="font-bold">${tenantName}</span> has signed the
        lease agreement for <span class="font-bold">${location}</span>.
      </p>

      <p class="text-gray-700 mb-6">
        To complete the process, please review and sign your copy of the
        agreement. Once signed, both parties will receive a final confirmation.
      </p>

      <div class="text-center my-8">
        <a
         href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/landlord/leases/${id}"
          class="inline-block bg-green-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-green-700"
        >
          Review & Sign Lease
        </a>
      </div>
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
