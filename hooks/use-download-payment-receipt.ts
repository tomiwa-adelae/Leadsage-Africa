"use client";

import { useState } from "react";
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import { PaymentStatus } from "@/lib/generated/prisma";

interface PaymentProps {
  id: string;
  leaseId: string;
  paidAt: Date | null;
  landlordName: string;
  amount: string;
  tenantName: string;
  reference: string | null;
  propertyAddress: string;
  method: string | null;
  status: PaymentStatus;
}

export const useDownloadPaymentReceipt = (payment: PaymentProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReceiptPDF = async () => {
    setIsGenerating(true);
    try {
      const { default: jsPDF } = await import("jspdf");

      const doc = new jsPDF();
      let yPos = 20;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Payment Receipt", 105, 20, { align: "center" });
      yPos += 10;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`Receipt ID: ${payment.id}`, 20, yPos);
      yPos += 10;
      doc.text(`Reference: ${payment.reference}`, 20, yPos);
      yPos += 10;
      doc.text(`Payment Status: ${payment.status}`, 20, yPos);
      yPos += 10;
      doc.text(`Date: ${formatDate(payment.paidAt)}`, 20, yPos);
      yPos += 10;

      // Tenant + Landlord Info
      doc.text(`Tenant: ${payment.tenantName}`, 20, yPos);
      yPos += 10;
      doc.text(`Landlord: ${payment.landlordName}`, 20, yPos);
      yPos += 10;
      doc.text(`Property: ${payment.propertyAddress}`, 20, yPos);
      yPos += 10;

      // Payment Details
      doc.setFont("helvetica", "bold");
      doc.text("Payment Details", 20, yPos);

      doc.setFont("helvetica", "normal");
      yPos += 10;
      doc.text(`Lease ID: ${payment.leaseId}`, 20, yPos);
      yPos += 10;
      doc.text(`Payment Method: ${payment.method}`, 20, yPos);
      yPos += 10;
      doc.text(`Amount Paid: NGN${payment.amount}`, 20, yPos);
      yPos += 10;

      // Footer
      doc.setFontSize(10);
      doc.text(
        "Thank you for your payment. This receipt serves as confirmation.",
        20,
        yPos
      );

      doc.save(`receipt-${payment.reference}.pdf`);

      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const doc = await generateReceiptPDF();
    doc.save(`lease-receipt-${payment.leaseId}.pdf`);
  };

  return { isGenerating, handleDownload };
};
