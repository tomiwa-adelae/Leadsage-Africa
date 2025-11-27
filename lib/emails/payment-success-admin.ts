import { env } from "../env";

interface Props {
  userName: string;
  amount: string;
  property: string | any;
  reference: string;
  id: string;
}

export const paymentSuccessAdmin = ({
  userName,
  amount,
  property,
  reference,
  id,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>User Payment Notification – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2 text-green-700">💰 Payment Received</h1>
    <p class="opacity-90 m-0">A user has successfully made a payment</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        User <span class="font-bold">${userName}</span> has successfully paid 
        <span class="font-bold">₦${amount}</span> for 
        <span class="font-bold">${property}</span>.
      </p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">Payment Details:</h3>
        <p class="text-gray-700 m-0"><span class="font-medium">User:</span> ${userName}</p>
        <p class="text-gray-700 m-0"><span class="font-medium">Amount:</span> ₦${amount}</p>
        <p class="text-gray-700 m-0"><span class="font-medium">Property:</span> ${property}</p>
        <p class="text-gray-700 m-0"><span class="font-medium">Reference ID:</span> ${reference}</p>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/admin/payments/${id}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          Review Payment in Admin Dashboard
        </a>
      </div>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        This is an automated payment notification.  
        For system issues, contact 
        <a href="mailto:${env.SUPPORT_EMAIL_ADDRESS}" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>.
      </p>
    </div>
  </div>
</body>
</html>
`;
