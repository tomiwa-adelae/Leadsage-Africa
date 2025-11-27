import { env } from "../env";

interface Props {
  fullName: string;
  email: string;
  phoneNumber?: string;
  subject: string;
  message: string;
}

export const contactAdmin = ({
  fullName,
  email,
  phoneNumber,
  subject,
  message,
}: Props) => `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Form Submission – Leadsage Africa</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans bg-gray-100 p-5">
  <div>
    <h1 class="text-2xl font-medium mb-2 text-blue-600">📩 New Contact Form Submission</h1>
    <p class="opacity-90 m-0">A user just reached out through the Leadsage Contact Us page</p>

    <div class="p-10">
      <p class="text-gray-700 leading-relaxed mb-6">
        Hello Admin,<br /><br />
        A new inquiry has been received. Here are the details:
      </p>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg my-6">
        <h3 class="text-lg font-medium text-gray-800 mb-4">📝 Message Details</h3>
        <div class="space-y-3 text-gray-700">
          <p><span class="font-medium">Name:</span> ${fullName}</p>
          <p><span class="font-medium">Email:</span> 
            <a href="mailto:${email}" class="text-blue-600 font-medium">${email}</a>
          </p>
          ${
            phoneNumber
              ? `<p><span class="font-medium">Phone:</span> <a href="tel:${phoneNumber}" class="text-blue-600 font-medium">${phoneNumber}</a></p>`
              : ""
          }
          <p><span class="font-medium">Subject:</span> ${subject}</p>
          <p><span class="font-medium">Message:</span><br /> ${message}</p>
        </div>
      </div>

      <div class="text-center my-8">
        <a
          href="mailto:${email}"
          class="inline-block bg-blue-600 text-white py-3 px-8 rounded-full font-medium hover:bg-blue-700"
        >
          Reply to User
        </a>
      </div>

      <p class="text-gray-700 leading-relaxed">
        Please respond to the user promptly. For records, all contact form submissions are also stored in the admin dashboard.
      </p>
    </div>

    <div class="bg-gray-800 text-gray-300 py-8 px-10 text-center text-sm">
      <p class="font-bold text-white mb-2">Leadsage Africa</p>
      <p class="m-0">
        Admin notifications are sent to
        <a href="mailto:${
          env.SUPPORT_EMAIL_ADDRESS
        }" class="text-blue-400 hover:text-blue-300">
          ${env.SUPPORT_EMAIL_ADDRESS}
        </a>
      </p>
    </div>
  </div>
</body>
</html>
`;
