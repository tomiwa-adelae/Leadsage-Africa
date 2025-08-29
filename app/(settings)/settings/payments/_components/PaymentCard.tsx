import { AmexIcon } from "@/components/AmexIcon";
import { DinersClubIcon } from "@/components/DinersClubIcon";
import { DiscoverIcon } from "@/components/DiscoverIcon";
import { JCBIcon } from "@/components/JCBIcon";
import { Logo } from "@/components/Logo";
import { MaestroIcon } from "@/components/MaestroIcon";
import { MastercardIcon } from "@/components/MastercardIcon";
import {
  CreditCard,
  CreditCardBack,
  CreditCardChip,
  CreditCardCvv,
  CreditCardExpiry,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardLogo,
  CreditCardMagStripe,
  CreditCardName,
  CreditCardNumber,
  CreditCardServiceProvider,
} from "@/components/ui/kibo-ui/credit-card";
import { UnionPayIcon } from "@/components/UnionPayIcon";
import { VisaIcon } from "@/components/VisaIcon";
import Image from "next/image";
import type { HTMLAttributes } from "react";
const ChaseLogo = (props: HTMLAttributes<SVGElement>) => (
  <svg
    viewBox="0 0 561.578 104.369"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Chase Logo</title>
    <path
      d="m494.525 0a3.69 3.69 0 0 0 -3.691 3.686v25.83h68.244l-31.078-29.508zm67.053 37.33a3.677 3.677 0 0 0 -3.688-3.68h-25.828v68.242l29.504-31.086zm-37.342 67.039a3.688 3.688 0 0 0 3.678-3.688v-25.827h-68.241l31.073 29.508zm-67.056-37.326a3.687 3.687 0 0 0 3.686 3.688h25.83v-68.247l-29.512 31.078z"
      fill="currentColor"
    />
    <path
      d="m144.379 12.453v31.514h-43.91v-31.514l-15.987-.006v79.461h15.987v-34.137h43.91v34.137h16.016v-79.455zm212.744 0v79.441l70.164-.004-8.891-13.98h-45.23v-20.139h43.797v-13.472h-43.797v-18.188h45.156l8.711-13.658zm-332.08-.01c-16.639 0-25.043 10.106-25.043 24.823v29.665c0 17.026 10.824 24.979 24.957 24.979l50.164-.01-9.293-14.521h-37.775c-8.021 0-11.515-2.899-11.515-11.881v-26.91c0-8.684 2.939-12.072 11.729-12.072h37.955l8.928-14.072zm261.904-.023c-9.613 0-19.451 5.771-19.451 20.625v3.816c0 15.475 9.476 21.389 18.949 21.432h33.275c3.455 0 6.264.572 6.264 6.416l-.004 6.754c-.086 5.236-2.711 6.447-6.379 6.447h-43.771l-8.967 13.979h53.762c12.972 0 21.773-6.447 21.773-21.353v-5.476c0-14.408-8.176-21.207-20.859-21.207h-31.77c-3.525 0-5.976-.967-5.976-6.184l-.004-5.492c0-4.443 1.688-6.066 5.791-6.066l41.683-.016 8.715-13.69-53.031.015m-80.084.045-37.679 79.435h17.811l7.338-16.405h40.941l7.315 16.405h17.882l-37.765-79.436zm7.896 16.488 14.479 33.021h-28.867z"
      fill="currentColor"
    />
  </svg>
);

interface Props {
  name: string;
  firstSix: string;
  lastFour: string;
  expiryDate: string;
  cardType: string;
}

export const PaymentCard = ({
  name,
  firstSix,
  lastFour,
  expiryDate,
  cardType,
}: Props) => (
  <CreditCard>
    <CreditCardFlipper>
      <CreditCardFront className="bg-primary">
        <Logo />
        <CreditCardLogo>
          {cardType === "Visa" && <VisaIcon />}
          {cardType === "Mastercard" && <MastercardIcon />}
          {cardType === "American Express" && <AmexIcon />}
          {cardType === "Discover" && <DiscoverIcon />}
          {cardType === "JCB" && <JCBIcon />}
          {cardType === "Maestro" && <MaestroIcon />}
          {cardType === "UnionPay" && <UnionPayIcon />}
          {cardType === "Diners Club" && <DinersClubIcon />}
        </CreditCardLogo>
        <CreditCardChip className="mt-4" />
        <CreditCardName className="absolute bottom-0 left-0">
          {name}
        </CreditCardName>
      </CreditCardFront>
      <CreditCardBack className="bg-primary">
        <CreditCardMagStripe />
        <CreditCardNumber className="absolute bottom-0 left-0">
          {firstSix} ** **** {lastFour}
        </CreditCardNumber>
        <div className="-translate-y-1/2 absolute top-1/2 flex gap-4">
          <CreditCardExpiry>{expiryDate}</CreditCardExpiry>
          <CreditCardCvv>***</CreditCardCvv>
        </div>
      </CreditCardBack>
    </CreditCardFlipper>
  </CreditCard>
);
