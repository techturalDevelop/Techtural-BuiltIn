/**
 * Utility functions for direct WhatsApp and Email communication links across Techtural BuiltIn.
 * Primary contact phone in contact form: (675) 7061 9746 / 7313 9744
 * Primary email addresses: techtural782@gmail.com / gerea.george@techturalpng.com
 */

export const PRIMARY_WHATSAPP_NUMBER = '67581464661'; // International format without leading + or symbols
export const SECONDARY_WHATSAPP_NUMBER = '67570619746';
export const TERTIARY_WHATSAPP_NUMBER = '67573139744';
export const DISPLAY_WHATSAPP = '+675 8146 4661';
export const DISPLAY_PHONE = '(675) 7061 9746 / 7313 9744';
export const PRIMARY_EMAIL = 'techtural782@gmail.com';
export const SECONDARY_EMAIL = 'gerea.george@techturalpng.com';

/**
 * Builds an openable wa.me link with encoded pre-filled text
 */
export function buildWhatsAppLink(message: string, phone: string = PRIMARY_WHATSAPP_NUMBER): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Builds an openable mailto link with encoded subject and body
 */
export function buildMailtoLink(subject: string, body: string, recipient: string = PRIMARY_EMAIL): string {
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Formats structured message for Kit Home Official Quote Request (Configure & Quote)
 */
export function formatKitHomeQuoteWhatsAppMessage(params: {
  modelName: string;
  modelCode: string;
  officialNumber?: number;
  calculatedTotal: number;
  isFullTurnKey: boolean;
  selections: {
    includeBlueprint: boolean;
    includeBoqBom: boolean;
    includeKitMaterials: boolean;
    includeProjectManagement: boolean;
    includeMaterialProcurement: boolean;
    includeContingency?: boolean;
    includeSolar: boolean;
    includeRainwater: boolean;
    includeCycloneUpgrade: boolean;
    selectedFinishes?: string[];
  };
  isTurnKeyCostingInProgress?: boolean;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  plotLocation?: string;
  targetTimeline?: string;
  notes?: string;
}): string {
  const isPending = params.isFullTurnKey && params.isTurnKeyCostingInProgress;
  const lines: string[] = [
    `*🏛️ TECHTURAL BUILTIN - KIT HOME QUOTE REQUEST*`,
    `----------------------------------------`,
    `*Model:* ${params.modelName} (${params.modelCode}${params.officialNumber ? ` #${String(params.officialNumber).padStart(2, '0')}` : ''})`,
    `*Package Mode:* ${params.isFullTurnKey ? 'Full Turn-Key Construction' : 'Custom Configured Kitset Package'}`,
    `*Estimated Total:* *${isPending ? 'Costing in Progress (Quotation on Request)' : `PGK ${params.calculatedTotal.toLocaleString()}`}*`,
    ``,
    `*Selected Scope & Cost Breakdown:*`,
    params.isFullTurnKey 
      ? `• Full Turn-Key Construction Contract Included ${isPending ? '(Handover Costing in Progress)' : ''}`
      : [
          params.selections.includeBlueprint ? `• Certified Blueprint Package` : null,
          params.selections.includeBoqBom ? `• Detailed BOQ & BOM Trade Schedule` : null,
          params.selections.includeKitMaterials ? `• Kitset Structural Materials Supply` : null,
          params.selections.includeProjectManagement ? `• Construction & Project Supervision` : null,
          params.selections.includeMaterialProcurement ? `• Material Procurement & Quality Control` : null,
        ].filter(Boolean).join('\n') || `• Custom Selection`,
    params.selections.includeContingency ? `• Project Contingency Provision (Materials & Site Buffer)` : null,
    params.selections.includeSolar ? `• Off-Grid Solar Power PV Add-on` : null,
    params.selections.includeRainwater ? `• Rainwater Harvesting & Filtration Add-on` : null,
    params.selections.includeCycloneUpgrade ? `• High-Wind Cyclone Foundation Upgrade` : null,
    params.selections.selectedFinishes && params.selections.selectedFinishes.length > 0 
      ? `• Selected Interior Fitouts: ${params.selections.selectedFinishes.join(', ')}` 
      : null,
    ``,
    `*Client Details:*`,
    `• Name: ${params.clientName?.trim() || 'Not specified'}`,
    `• Phone: ${params.clientPhone?.trim() || 'Not specified'}`,
    `• Email: ${params.clientEmail?.trim() || 'Not specified'}`,
    `• Plot Location: ${params.plotLocation?.trim() || 'Not specified'}`,
    `• Target Timeline: ${params.targetTimeline || 'Not specified'}`,
    params.notes?.trim() ? `• Notes/Questions: ${params.notes.trim()}` : null,
    ``,
    `Sent directly via Techtural BuiltIn Portal.`
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

/**
 * Formats structured message for Official Scope of Works (SOW) PDF Document Request
 */
export function formatScopeOfWorksInquiryWhatsAppMessage(params: {
  modelName: string;
  modelCode: string;
  officialNumber?: number;
  areaSqm: number;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  plotLocation?: string;
  requestedPackageTier?: string;
}): string {
  const lines: string[] = [
    `*📑 TECHTURAL BUILTIN - SCOPE OF WORKS (SOW) PDF REQUEST*`,
    `----------------------------------------`,
    `Hello Techtural BuiltIn Engineering Team,`,
    ``,
    `I would like to request the official comprehensive *Scope of Works (SOW) & Deliverables PDF Document* for:`,
    `*Model:* ${params.modelName} (${params.modelCode}${params.officialNumber ? ` #${String(params.officialNumber).padStart(2, '0')}` : ''})`,
    `*Floor Area:* ${params.areaSqm} m²`,
    params.requestedPackageTier ? `*Package of Interest:* ${params.requestedPackageTier}` : null,
    ``,
    `*Requester Contact Details:*`,
    `• Name: ${params.clientName?.trim() || 'Prospective Client'}`,
    `• Phone: ${params.clientPhone?.trim() || 'Not specified'}`,
    `• Email: ${params.clientEmail?.trim() || 'Not specified'}`,
    `• Building Plot/Province: ${params.plotLocation?.trim() || 'Papua New Guinea'}`,
    ``,
    `Please provide the official signed PDF document detailing the technical specifications, structural material standards, BOQ schedule, and construction milestones for this model.`,
    ``,
    `Thank you!`
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

/**
 * Formats structured message for Blueprint / Details Inquiry
 */
export function formatBlueprintInquiryWhatsAppMessage(params: {
  modelName: string;
  modelCode: string;
  officialNumber?: number;
  blueprintPrice: number;
  selectedScope: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  plotLocation?: string;
  notes?: string;
}): string {
  const lines: string[] = [
    `*📐 TECHTURAL BUILTIN - BLUEPRINT & SPECIFICATION INQUIRY*`,
    `----------------------------------------`,
    `*Model:* ${params.modelName} (${params.modelCode}${params.officialNumber ? ` #${String(params.officialNumber).padStart(2, '0')}` : ''})`,
    `*Selected Scope:* ${params.selectedScope}`,
    `*Standard Blueprint Price:* PGK ${params.blueprintPrice.toLocaleString()}`,
    ``,
    `*Client Details:*`,
    `• Name: ${params.clientName?.trim() || 'Not specified'}`,
    `• Phone: ${params.clientPhone?.trim() || 'Not specified'}`,
    `• Email: ${params.clientEmail?.trim() || 'Not specified'}`,
    `• Location/Province: ${params.plotLocation?.trim() || 'Not specified'}`,
    params.notes?.trim() ? `• Site Questions: ${params.notes.trim()}` : null,
    ``,
    `Sent directly via Techtural BuiltIn Portal.`
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

/**
 * Formats structured message for General Contact Form
 */
export function formatGeneralContactWhatsAppMessage(params: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): string {
  const lines: string[] = [
    `*💬 TECHTURAL BUILTIN - GENERAL INQUIRY*`,
    `----------------------------------------`,
    `*From:* ${params.name.trim()}`,
    `*Email:* ${params.email.trim()}`,
    `*Subject:* ${params.subject.trim()}`,
    ``,
    `*Message:*`,
    `${params.message.trim()}`,
    ``,
    `Sent directly via Techtural BuiltIn Contact Form.`
  ];

  return lines.join('\n');
}
