"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatDate, formatPhoneNumber } from "@/lib/utils";
import { RenderDescription } from "@/components/text-editor/RenderDescription";

interface Props {
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
  buttonText?: string;
}

export const PreviewLease = ({
  leaseId,
  createdAt,
  landlordName,
  landlordAddress,
  tenantName,
  tenantEmail,
  tenantPhoneNumber,
  propertyAddress,
  propertyCategory,
  startDate,
  endDate,
  duration,
  price,
  paymentFrequency,
  securityDeposit,
  petRule,
  smokingRule,
  partyRule,
  additionalRule,
  moveInDate,
  tenantSignature,
  buttonText = "Preview Lease",
}: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateLeasePDF = async () => {
    setIsGenerating(true);
    try {
      const { default: jsPDF } = await import("jspdf");

      const doc = new jsPDF();
      let yPos = 20;

      // Title
      doc.setFontSize(20);
      doc.setFont("courier", "bold");
      doc.text("Residential Lease Agreement", 105, yPos, { align: "center" });
      yPos += 15;

      // Lease Info
      doc.setFontSize(11);
      doc.setFont("courier", "bold");
      doc.text(`Lease ID: ${leaseId}`, 20, yPos);
      yPos += 6;
      doc.text(`Date Created: ${formatDate(createdAt)}`, 20, yPos);
      yPos += 12;

      // Parties Section
      doc.setFontSize(14);
      doc.setFont("courier", "bold");
      doc.text("1. Parties", 20, yPos);
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("courier", "normal");
      doc.text(`Landlord: ${landlordName}`, 20, yPos);
      yPos += 6;
      doc.text(`Landlord Address: ${landlordAddress}`, 20, yPos);
      yPos += 6;
      doc.text(`Tenant: ${tenantName}`, 20, yPos);
      yPos += 6;
      doc.text(`Tenant Email: ${tenantEmail}`, 20, yPos);
      yPos += 6;
      doc.text(
        `Tenant Phone: ${formatPhoneNumber(tenantPhoneNumber)}`,
        20,
        yPos
      );
      yPos += 12;

      // Property Section
      doc.setFontSize(14);
      doc.setFont("courier", "bold");
      doc.text("2. Property", 20, yPos);
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("courier", "normal");
      doc.text(`Address: ${propertyAddress}`, 20, yPos);
      yPos += 6;
      doc.text(`Type: ${propertyCategory}`, 20, yPos);
      yPos += 12;

      // Lease Terms Section
      doc.setFontSize(14);
      doc.setFont("courier", "bold");
      doc.text("3. Lease Terms", 20, yPos);
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("courier", "normal");
      doc.text(`Start Date: ${formatDate(startDate)}`, 20, yPos);
      yPos += 6;
      doc.text(`End Date: ${formatDate(endDate)}`, 20, yPos);
      yPos += 6;
      doc.text(`Duration: ${duration}`, 20, yPos);
      yPos += 12;

      // Rent Section
      doc.setFontSize(14);
      doc.setFont("courier", "bold");
      doc.text("4. Rent & Deposits", 20, yPos);
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("courier", "normal");
      doc.text(`Rent: NGN${price} (${paymentFrequency})`, 20, yPos);
      yPos += 6;
      doc.text(`Security Deposit: NGN${securityDeposit}`, 20, yPos);
      yPos += 12;

      // Rules Section
      doc.setFontSize(14);
      doc.setFont("courier", "bold");
      doc.text("5. Rules & Policies", 20, yPos);
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("courier", "normal");
      if (petRule) {
        doc.text(`Pets: ${petRule}`, 20, yPos);
        yPos += 6;
      }
      if (smokingRule) {
        doc.text(`Smoking: ${smokingRule}`, 20, yPos);
        yPos += 6;
      }
      if (partyRule) {
        doc.text(`Parties: ${partyRule}`, 20, yPos);
        yPos += 6;
      }
      if (additionalRule) {
        doc.text(
          `Other: ${(<RenderDescription json={JSON.parse(additionalRule)} />)}`,
          20,
          yPos
        );
        yPos += 6;
      }
      yPos += 12;

      // Move-in Section
      doc.setFontSize(14);
      doc.setFont("courier", "bold");
      doc.text("6. Move-in Date", 20, yPos);
      yPos += 8;
      doc.setFontSize(11);
      doc.setFont("courier", "normal");
      doc.text(`${formatDate(moveInDate)}`, 20, yPos);
      yPos += 20;

      // Signatures Section (new page)
      doc.addPage();
      yPos = 20;

      doc.setFontSize(14);
      doc.setFont("courier", "bold");
      doc.text("7. Signatures", 20, yPos);
      yPos += 12;
      doc.setFontSize(11);
      doc.setFont("courier", "normal");
      doc.text(
        "By signing below, both parties agree to the terms above.",
        20,
        yPos
      );
      yPos += 60;

      // Signature lines
      doc.line(20, yPos, 90, yPos); // Landlord line
      doc.line(110, yPos, 180, yPos); // Tenant line

      // Labels
      doc.setFontSize(9);
      doc.text("Landlord Signature", 20, yPos + 5);
      doc.text("Tenant Signature", 110, yPos + 5);
      doc.text(`Date: ${formatDate(new Date())}`, 20, yPos + 12);
      doc.text(`Date: ${formatDate(new Date())}`, 110, yPos + 12);

      // === Tenant Signature Image (Base64) ===
      if (tenantSignature) {
        // Place smaller image under Tenant’s line
        doc.addImage(tenantSignature, "PNG", 110, yPos - 30, 70, 25);
        // params: (img, format, x, y, width, height)
      }

      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  // === Handlers ===
  const handleDownload = async () => {
    const doc = await generateLeasePDF();
    doc.save(`lease-agreement-${leaseId}.pdf`);
  };

  const handleEmbeddedPreview = async () => {
    const doc = await generateLeasePDF();
    const pdfDataUri = doc.output("datauristring");

    const previewWindow = document.createElement("div");
    previewWindow.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.8); z-index: 9999; display: flex; 
      align-items: center; justify-content: center;
    `;
    previewWindow.innerHTML = `
      <div style="width: 90%; height: 90%; background: white; border-radius: 8px; position: relative;">
        <button onclick="this.parentElement.parentElement.remove()" 
                style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer;">
          ×
        </button>
        <iframe src="${pdfDataUri}" style="width: 100%; height: 100%; border: none; border-radius: 8px;"></iframe>
      </div>
    `;
    document.body.appendChild(previewWindow);
  };

  return (
    <div className="space-y-3">
      <Button
        className="w-full"
        onClick={handleEmbeddedPreview}
        disabled={isGenerating || !tenantSignature || !moveInDate}
        variant={"outline"}
      >
        {buttonText}
      </Button>
      {isGenerating && (
        <p className="text-sm text-yellow-600">
          Generating PDF... Please wait.
        </p>
      )}
    </div>
  );
};
