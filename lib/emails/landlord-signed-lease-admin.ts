import { env } from "../env";

interface Props {
  tenantName: string;
  landlordName: string;
  location: string;
  id: string;
}

export const landlordSignedLeaseAdmin = ({
  tenantName,
  landlordName,
  location,
  id,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lease Fully Executed – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-semibold mb-2">Lease Agreement Executed</h1>
    <p class="opacity-90 m-0">Both parties have signed</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        The lease agreement for <span class="font-bold">${location}</span> is now fully executed.  
      </p>

      <p class="text-gray-700 mb-6">
        <span class="font-bold">${tenantName}</span> (tenant) and
        <span class="font-bold">${landlordName}</span> (landlord) have both signed.
      </p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Next Steps for Admin:</h3>
        <ul class="list-disc list-inside text-gray-700 space-y-2">
          <li>Record the lease in the system</li>
          <li>Issue official confirmation to both parties (automated)</li>
          <li>Prepare move-in checklist if applicable</li>
        </ul>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/admin/leases/${id}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-blue-700"
        >
          Open lease details
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;
