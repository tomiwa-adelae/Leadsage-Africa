"use client";

import { useState } from "react";
import { formatDate, formatPhoneNumber } from "@/lib/utils";

interface LeaseProps {
  leaseId: string;
  createdAt: Date;
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhoneNumber: string;
  propertyAddress: string;
  propertyCategory: string;
  startDate: string;
  endDate: string | any;
  duration: string;
  price: string;
  paymentFrequency: string;
  securityDeposit: string;
  petRule: string;
  smokingRule: string;
  partyRule: string;
  additionalRule: string | null;
  moveInDate: string;
  tenantSignature: any;
  landlordSignature: any;
}

export const useDownloadLease = (lease: LeaseProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLeasePDF = async () => {
    setIsGenerating(true);
    try {
      const { default: jsPDF } = await import("jspdf");

      const doc = new jsPDF();
      let yPos = 20;

      // === Title ===
      doc.setFontSize(20);
      doc.setFont("courier", "bold");
      doc.text("Residential Lease Agreement", 105, yPos, { align: "center" });
      yPos += 15;

      // === Lease Info ===
      doc.setFontSize(11);
      doc.setFont("courier", "bold");
      doc.text(`Lease ID: ${lease.leaseId}`, 20, yPos);
      yPos += 6;
      doc.text(`Date Created: ${formatDate(lease.createdAt)}`, 20, yPos);
      yPos += 12;

      // === Parties Section ===
      doc.setFontSize(14).setFont("courier", "bold");
      doc.text("1. Parties", 20, yPos);
      yPos += 8;

      doc.setFontSize(11).setFont("courier", "normal");
      doc.text(`Landlord: ${lease.landlordName}`, 20, yPos);
      yPos += 6;
      doc.text(`Landlord Address: ${lease.landlordAddress}`, 20, yPos);
      yPos += 6;
      doc.text(`Tenant: ${lease.tenantName}`, 20, yPos);
      yPos += 6;
      doc.text(`Tenant Email: ${lease.tenantEmail}`, 20, yPos);
      yPos += 6;
      doc.text(
        `Tenant Phone: ${formatPhoneNumber(lease.tenantPhoneNumber)}`,
        20,
        yPos
      );
      yPos += 12;

      // === Property Section ===
      doc.setFontSize(14).setFont("courier", "bold");
      doc.text("2. Property", 20, yPos);
      yPos += 8;

      doc.setFontSize(11).setFont("courier", "normal");
      doc.text(`Address: ${lease.propertyAddress}`, 20, yPos);
      yPos += 6;
      doc.text(`Type: ${lease.propertyCategory}`, 20, yPos);
      yPos += 12;

      // === Lease Terms Section ===
      doc.setFontSize(14).setFont("courier", "bold");
      doc.text("3. Lease Terms", 20, yPos);
      yPos += 8;

      doc.setFontSize(11).setFont("courier", "normal");
      doc.text(`Start Date: ${formatDate(lease.startDate)}`, 20, yPos);
      yPos += 6;
      doc.text(`End Date: ${formatDate(lease.endDate)}`, 20, yPos);
      yPos += 6;
      doc.text(`Duration: ${lease.duration}`, 20, yPos);
      yPos += 12;

      // === Rent Section ===
      doc.setFontSize(14).setFont("courier", "bold");
      doc.text("4. Rent & Deposits", 20, yPos);
      yPos += 8;

      doc.setFontSize(11).setFont("courier", "normal");
      doc.text(`Rent: NGN${lease.price} (${lease.paymentFrequency})`, 20, yPos);
      yPos += 6;
      doc.text(`Security Deposit: NGN${lease.securityDeposit}`, 20, yPos);
      yPos += 12;

      // === Rules Section ===
      doc.setFontSize(14).setFont("courier", "bold");
      doc.text("5. Rules & Policies", 20, yPos);
      yPos += 8;

      doc.setFontSize(11).setFont("courier", "normal");
      if (lease.petRule) {
        doc.text(`Pets: ${lease.petRule}`, 20, yPos);
        yPos += 6;
      }
      if (lease.smokingRule) {
        doc.text(`Smoking: ${lease.smokingRule}`, 20, yPos);
        yPos += 6;
      }
      if (lease.partyRule) {
        doc.text(`Parties: ${lease.partyRule}`, 20, yPos);
        yPos += 6;
      }
      if (lease.additionalRule) {
        doc.text(`Other: ${lease.additionalRule}`, 20, yPos);
        yPos += 6;
      }
      yPos += 12;

      // === Move-in Section ===
      doc.setFontSize(14).setFont("courier", "bold");
      doc.text("6. Move-in Date", 20, yPos);
      yPos += 8;

      doc.setFontSize(11).setFont("courier", "normal");
      doc.text(`${formatDate(lease.moveInDate)}`, 20, yPos);
      yPos += 20;

      // === Signatures Section ===
      doc.addPage();
      yPos = 20;

      doc.setFontSize(14).setFont("courier", "bold");
      doc.text("7. Signatures", 20, yPos);
      yPos += 12;

      doc.setFontSize(11).setFont("courier", "normal");
      doc.text(
        "By signing below, both parties agree to the terms above.",
        20,
        yPos
      );
      yPos += 60;

      doc.line(20, yPos, 90, yPos);
      doc.line(110, yPos, 180, yPos);

      doc.setFontSize(9);
      doc.text("Landlord Signature", 20, yPos + 5);
      doc.text("Tenant Signature", 110, yPos + 5);
      doc.text(`Date: ${formatDate(new Date())}`, 20, yPos + 12);
      doc.text(`Date: ${formatDate(new Date())}`, 110, yPos + 12);

      if (lease.landlordSignature) {
        doc.addImage(lease.landlordSignature, "PNG", 20, yPos - 30, 70, 25);
      }

      if (lease.tenantSignature) {
        doc.addImage(lease.tenantSignature, "PNG", 110, yPos - 30, 70, 25);
      }

      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const doc = await generateLeasePDF();
    doc.save(`lease-agreement-${lease.leaseId}.pdf`);
  };

  return { isGenerating, handleDownload };
};
