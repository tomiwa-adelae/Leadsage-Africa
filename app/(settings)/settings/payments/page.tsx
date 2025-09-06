import { EmptyState } from "@/components/EmptyState";
import { SiteHeader } from "@/components/sidebar/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { PaymentCard } from "./_components/PaymentCard";
import { AddPaymentMethod } from "./_components/AddPaymentMethod";
import { getPaymentMethods } from "@/app/data/payment/get-payment-methods";

const page = async () => {
  const methods = await getPaymentMethods();
  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-4">
        <h1 className="text-3xl md:text-4xl font-semibold">
          Billings & Payments
        </h1>
        <div className="space-y-8 mt-8">
          <Card className="gap-0">
            <CardHeader className="border-b">
              <CardTitle>Your payments</CardTitle>
              <CardDescription>
                Keep track of all your payments and refunds.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              <EmptyState title="No payments" />
            </CardContent>
          </Card>
          <Card className="gap-0">
            <CardHeader className="border-b">
              <CardTitle>Payment methods</CardTitle>
              <CardDescription>
                Add a payment method using our secure payment system, then start
                planning your next property.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
              {methods.length === 0 && (
                <>
                  <EmptyState title="No payment methods" />
                  <div className="flex items-center justify-center mt-2">
                    <AddPaymentMethod />
                  </div>
                </>
              )}
              <div className="flex flex-wrap gap-4 items-center justify-start">
                {methods.map((method) => (
                  <PaymentCard
                    key={method.id}
                    name={method.nameOnCard}
                    expiryDate={method.expiryDate}
                    cardType={method.cardType}
                    firstSix={method.cardNumber.slice(0, 7)}
                    lastFour={method.cardNumber.slice(-4)}
                  />
                ))}
              </div>
              <div className="mt-4">
                {methods.length !== 0 && <AddPaymentMethod variant="outline" />}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
