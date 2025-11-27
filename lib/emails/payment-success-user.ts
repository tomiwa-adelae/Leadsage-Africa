import { env } from "../env";

interface Props {
  userName: string;
  amount: string;
  property: string | any;
  reference: string;
}

export const paymentSuccessUser = ({
  userName,
  amount,
  property,
  reference,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Successful – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2 text-green-700">✅ Payment Successful</h1>
    <p class="opacity-90 m-0">We’ve received your payment</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hi <span class="font-bold">${userName}</span>,<br /><br />
        Thank you! We’ve successfully received your payment of 
        <span class="font-bold">₦${amount}</span> for 
        <span class="font-bold">${property}</span>.
      </p>

      <div class="bg-green-50 border-l-4 border-green-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-2">Transaction Details:</h3>
        <p class="text-gray-700 m-0"><span class="font-medium">Amount:</span> ₦${amount}</p>
        <p class="text-gray-700 m-0"><span class="font-medium">Property:</span> ${property}</p>
        <p class="text-gray-700 m-0"><span class="font-medium">Reference ID:</span> ${reference}</p>
      </div>

      <div class="text-center my-8">
        <a
          href="${env.NEXT_PUBLIC_BETTER_AUTH_URL}/dashboard"
          class="inline-block bg-green-600 text-white py-3 px-8 rounded-full font-medium hover:bg-green-700"
        >
          View My Dashboard
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed">
        A receipt has been added to your dashboard. You can also download it anytime.
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
