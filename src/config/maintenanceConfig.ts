/**
 * Standard Maintenance Mode Configuration for Techtural BuiltIn.
 *
 * To enable or disable maintenance across the entire website:
 * Change `MAINTENANCE_MODE_ENABLED` to `true` or `false`.
 *
 * Administrators & team members can bypass the maintenance notice by adding
 * `?preview=true` or `?bypass=true` to the URL, or using the discreet Admin Access modal.
 */

export interface MaintenanceSettings {
  enabled: boolean;
  title: string;
  badge: string;
  subtitle: string;
  detailedMessage: string;
  estimatedReturn: string;
  reason: string;
  showEmergencyContactForm: boolean;
  contactChannels: {
    primaryWhatsApp: string;
    displayWhatsApp: string;
    primaryPhone: string;
    displayPhone: string;
    secondaryWhatsApp: string;
    displaySecondaryWhatsApp: string;
    primaryEmail: string;
    secondaryEmail: string;
    officeAddress: string;
    workingHours: string;
  };
}

export const MAINTENANCE_CONFIG: MaintenanceSettings = {
  // Set to true to activate standard maintenance notice on the entire website
  enabled: true,

  badge: 'Scheduled Maintenance & Upgrade',
  title: 'Digital Systems Under Scheduled Maintenance',
  subtitle: 'We are currently enhancing our digital architecture, smart estimation modules, and client portal infrastructure.',
  detailedMessage: 'Techtural BuiltIn is performing a comprehensive technical architecture and security update to optimize our 20-model kit home costing engines, structural specification databases, and digital project management workflows across Papua New Guinea.',
  estimatedReturn: 'Service restoration is actively underway. All public calculation engines, blueprints, and digital selector features will be back online shortly.',
  reason: 'Infrastructure, Security & Cloud Database Optimization',
  showEmergencyContactForm: true,

  contactChannels: {
    primaryWhatsApp: '67581464661',
    displayWhatsApp: '+675 8146 4661',
    primaryPhone: '(675) 7313 9744',
    displayPhone: '(675) 7313 9744',
    secondaryWhatsApp: '67573139744',
    displaySecondaryWhatsApp: '+675 7313 9744',
    primaryEmail: 'techtural782@gmail.com',
    secondaryEmail: 'gerea.george@techturalpng.com',
    officeAddress: 'PO Box 1585 | PORT MORESBY | National Capital District 121, Papua New Guinea',
    workingHours: 'Monday – Friday: 8:00 AM – 5:00 PM (PNG Time)',
  },
};

/**
 * Check if the current user session has activated the maintenance bypass
 */
export function isMaintenanceBypassed(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('preview') === 'true' || urlParams.get('bypass') === 'true') {
      window.sessionStorage.setItem('techtural_maintenance_bypass', 'true');
      return true;
    }
    return window.sessionStorage.getItem('techtural_maintenance_bypass') === 'true';
  } catch {
    return false;
  }
}

/**
 * Set maintenance bypass in session storage
 */
export function setMaintenanceBypass(bypass: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (bypass) {
      window.sessionStorage.setItem('techtural_maintenance_bypass', 'true');
    } else {
      window.sessionStorage.removeItem('techtural_maintenance_bypass');
    }
  } catch {
    // Ignore storage errors
  }
}
