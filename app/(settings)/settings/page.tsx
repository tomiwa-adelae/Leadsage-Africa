import { SiteHeader } from "@/components/sidebar/site-header";
import { LegalNamesBox } from "./_components/LegalNamesBox";
import { getUserInfo } from "@/app/data/user/get-user-info";
import { PreferredFirstNameBox } from "./_components/PreferredFirstNameBox";
import { EmailBox } from "./_components/EmailBox";
import { PhoneNumberBox } from "./_components/PhoneNumberBox";
import { ResidentialAddressBox } from "./_components/ResidentialAddressBox";
import { MailingAddressBox } from "./_components/MailingAddressBox";
import { EmergencyBox } from "./_components/EmergencyBox";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings | Leadsage",
  description:
    "Manage your Leadsage account settings, update your profile, adjust notifications, and keep your information secure.",
};

const page = async () => {
  const user = await getUserInfo();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-4">
        <h1 className="text-3xl md:text-4xl font-medium">
          Personal Information
        </h1>
        <div className="space-y-1">
          <LegalNamesBox name={user.name} />
          <PreferredFirstNameBox name={user.preferredFirstName} />
          <EmailBox email={user.email} />
          <PhoneNumberBox phoneNumber={user.phoneNumber} />
          <ResidentialAddressBox
            address={user.address}
            city={user.city}
            state={user.state}
            country={user.country}
          />
          <MailingAddressBox
            mailingAddress={user.mailingAddress}
            mailingCity={user.mailingCity}
            mailingState={user.mailingState}
            mailingCountry={user.mailingCountry}
          />
          <EmergencyBox
            emergencyName={user.emergencyName}
            emergencyLanguage={user.emergencyLanguage}
            emergencyPhoneNumber={user.emergencyPhoneNumber}
            emergencyRelationship={user.emergencyRelationship}
            emergencyEmail={user.emergencyEmail}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
