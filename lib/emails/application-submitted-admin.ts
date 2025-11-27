import { env } from "../env";

interface Props {
  tenantName: string;
  landlordName: string;
  id: string;
  location: string;
}

export const applicationSubmittedAdmin = ({
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
  <title>New Application Alert – Leadsage Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2">🚨 New Application Submitted</h1>
    <p class="opacity-90 m-0">An application has been submitted through Leadsage</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        <span class="font-bold">${tenantName}</span> has submitted an application for the property at 
        <span class="font-bold">${location}</span>, owned by <span class="font-bold">${landlordName}</span>.
      </p>

      <p class="text-gray-700 leading-relaxed mb-6">
        Please monitor the process in the admin panel to ensure compliance and smooth communication between both parties.
      </p>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/admin/applications/${id}"
          class="inline-block bg-blue-700 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-800"
        >
          View application
        </a>
      </div>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa – Admin Notification</p>
      <p class="m-0">
        This is an automated alert. For issues, email
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
