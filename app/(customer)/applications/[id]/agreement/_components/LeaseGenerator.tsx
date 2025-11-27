import React, { useEffect, useState } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Props {
  leaseId: string;
  createdAt: string;
  landlordName: string;
  landlordAddress: string;
  tenantName: string;
  tenantEmail: string;
  tenantPhoneNumber: string;
  propertyAddress: string;
  propertyCategory: string;
  startDate: string;
  endDate: string;
  duration: string;
  price: string;
  paymentFrequency: string;
  securityDeposit: string;
  petRule: string;
  smokingRule: string;
  partyRule: string;
  additionalRule: string;
  moveInDate: string;
}

export const LeaseGenerator = ({
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
}: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const sampleLeaseData = {
    leaseNumber: "LS-2025-0847",
    property: {
      address: "2847 Oak Street, Unit 4B",
      city: "San Francisco, CA 94123",
      type: "Apartment",
      sqft: 850,
    },
    landlord: {
      name: "Acme Property Management LLC",
      address: "1234 Business Ave, San Francisco, CA 94102",
    },
    tenant: {
      name: "John Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
    },
    terms: {
      startDate: "March 15, 2025",
      endDate: "March 14, 2026",
      duration: "12 months",
      monthlyRent: 3200,
      securityDeposit: 3200,
      petDeposit: 500,
      lateFee: 75,
      petsAllowed: true,
      maxPets: 2,
    },
  };

  // Simple jsPDF implementation that works
  const generateSimplePDF = async () => {
    setIsGenerating(true);

    try {
      // Dynamic import to avoid SSR issues
      const { default: jsPDF } = await import("jspdf");

      const doc = new jsPDF();
      let yPos = 20;

      // Title
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("Residential Lease Agreement", 105, yPos, { align: "center" });
      yPos += 15;

      // Lease info
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Lease No: ${leaseId}`, 105, yPos, {
        align: "center",
      });
      yPos += 5;
      doc.text(`Date: ${formatDate(createdAt)}`, 105, yPos, {
        align: "center",
      });
      yPos += 20;

      // Parties
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Parties", 20, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Landlord: ${landlordName}`, 20, yPos);
      yPos += 6;
      doc.text(`Landlord Address: ${landlordAddress}`, 20, yPos);
      yPos += 6;
      doc.text(`Tenant: ${tenantName}`, 20, yPos);
      yPos += 6;
      doc.text(`Tenant Email: ${tenantEmail}`, 20, yPos);
      yPos += 6;
      doc.text(`Tenant Phone: ${tenantPhoneNumber}`, 20, yPos);
      yPos += 15;

      // Property Information
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Property", 20, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Property Address: ${propertyAddress}`, 20, yPos);
      yPos += 6;
      doc.text(`Type: ${propertyCategory}`, 20, yPos);
      yPos += 15;

      // Lease Terms
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Lease Terms", 20, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Start Date: ${formatDate(startDate)}`, 20, yPos);
      yPos += 6;
      doc.text(`End Date: ${formatDate(endDate)}`, 20, yPos);
      yPos += 6;
      doc.text(`Duration: ${duration}`, 20, yPos);
      yPos += 20;

      // Lease Terms
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Rent", 20, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Price: ₦${price}/${paymentFrequency}`, 20, yPos);
      yPos += 6;
      doc.text(`Security Deposit: ₦${securityDeposit}`, 20, yPos);
      yPos += 20;

      // Lease Terms
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Rules & Policies", 20, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`${petRule}`, 20, yPos);
      yPos += 6;
      doc.text(`${smokingRule}`, 20, yPos);
      yPos += 6;
      doc.text(`${partyRule}`, 20, yPos);
      yPos += 6;
      doc.text(`${additionalRule}`, 20, yPos);
      yPos += 20;

      // Lease Terms
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Move-in Date", 20, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`${formatDate(moveInDate)}`, 20, yPos);
      yPos += 20;

      // Add new page for terms
      doc.addPage();
      yPos = 20;

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Signatures", 20, yPos);
      yPos += 20;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(
        "By signing below, parties agree to all terms and conditions.",
        20,
        yPos
      );
      yPos += 30;

      // Signature lines
      doc.line(20, yPos, 90, yPos);
      doc.line(110, yPos, 180, yPos);

      doc.setFontSize(9);
      doc.text("Landlord Signature", 20, yPos + 5);
      doc.text("Tenant Signature", 110, yPos + 5);
      doc.text(`Date: ${formatDate(new Date())}`, 20, yPos + 12);
      doc.text(`Date: ${formatDate(new Date())}`, 110, yPos + 12);

      return doc;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      const doc = await generateSimplePDF();
      doc.save(`lease-agreement-${leaseId}.pdf`);
    } catch (error: any) {
      alert("Error downloading PDF: " + error.message);
    }
  };

  const handlePreview = async () => {
    try {
      const doc = await generateSimplePDF();
      const pdfBlob = doc.output("blob");
      const pdfUrl = URL.createObjectURL(pdfBlob);

      const newWindow = window.open(pdfUrl, "_blank");
      if (!newWindow) {
        alert("Please allow popups to preview the PDF");
      }

      // Clean up after 10 seconds
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 10000);
    } catch (error: any) {
      alert("Error previewing PDF: " + error.message);
    }
  };

  // Alternative: Generate PDF as data URL and show in iframe
  const handleEmbeddedPreview = async () => {
    try {
      const doc = await generateSimplePDF();
      const pdfDataUri = doc.output("datauristring");

      // Create a modal-like preview
      const previewWindow = document.createElement("div");
      previewWindow.style.position = "fixed";
      previewWindow.style.top = "0";
      previewWindow.style.left = "0";
      previewWindow.style.width = "100vw";
      previewWindow.style.height = "100vh";
      previewWindow.style.backgroundColor = "rgba(0,0,0,0.8)";
      previewWindow.style.zIndex = "9999";
      previewWindow.style.display = "flex";
      previewWindow.style.alignItems = "center";
      previewWindow.style.justifyContent = "center";

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
    } catch (error: any) {
      alert("Error creating embedded preview: " + error.message);
    }
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold">Simple PDF Lease Generator</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Generate a professional PDF lease agreement with guaranteed working
          download and preview.
        </p>

        {/* Preview Information */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">Document Preview:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Property:</strong> {sampleLeaseData.property.address}
              </p>
              <p>
                <strong>Type:</strong> {sampleLeaseData.property.type}
              </p>
            </div>
            <div>
              <p>
                <strong>Tenant:</strong> {sampleLeaseData.tenant.name}
              </p>
              <p>
                <strong>Rent:</strong> $
                {sampleLeaseData.terms.monthlyRent.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            <Download className="w-4 h-4 mr-2" />
            {isGenerating ? "Generating..." : "Download PDF"}
          </button>

          <button
            onClick={handlePreview}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview in New Tab
          </button>

          <button
            onClick={handleEmbeddedPreview}
            disabled={isGenerating}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Embedded
          </button>
        </div>

        {isGenerating && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">Generating PDF... Please wait.</p>
          </div>
        )}
      </div>
    </div>
  );
};
