import { env } from "../env";

interface Props {
  tenantName: string;
  location: string;
  id: string;
}

export const leaseSignedAdmin = ({ tenantName, location, id }: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tenant Signed Lease – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2">Tenant Signed Lease</h1>
    <p class="opacity-90 m-0">Action required: Awaiting landlord signature</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        The tenant <span class="font-bold">${tenantName}</span> has signed the lease agreement
        for <span class="font-bold">${location}</span>.
      </p>

      <p class="text-gray-700 mb-6">
        Please ensure the landlord is prompted to sign their copy and log the
        agreement in the system once both parties are complete.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/admin/leases/${id}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          View lease details
        </a>
      </div>
    </div>
  </div>
</body>
</html>
`;
