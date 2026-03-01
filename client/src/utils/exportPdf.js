import html2pdf from 'html2pdf.js';

export const exportPdf = async (elementId, userFirstName) => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error("Could not find resume element to export.");
    }

    const safeName = (userFirstName || 'User').replace(/\s+/g, '').toLowerCase();
    const fileName = `${safeName}_resume.pdf`;

    const opt = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(element).save();
        return fileName;
    } catch (error) {
        console.error("PDF generation failed:", error);
        throw new Error("Failed to generate PDF.");
    }
};
