import { env } from "../env";

interface Props {
  name: string;
  location: string;
  id: string;
}

export const leaseSignedTenant = ({ name, location, id }: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lease Agreement Signed – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2">✅ Lease Agreement Signed</h1>
    <p class="opacity-90 m-0">Your rental process is moving forward</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${name}</span>,<br /><br />
        Congratulations! 🎉 You’ve successfully signed the lease agreement for
        <span class="font-bold">${location}</span>.
      </p>

      <p class="text-gray-700 mb-6">
        The landlord will now review and sign their copy. Once both parties have
        signed, you’ll receive a final confirmation along with move-in details.
      </p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">Next Steps:</h3>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>Wait for landlord’s signature</li>
          <li>Prepare your move-in checklist</li>
          <li>Track status in your dashboard</li>
        </ul>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/leases/${id}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          View Lease details
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
