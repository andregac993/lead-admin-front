export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  position?: string | null;
  dateOfBirth?: string | null;
  message?: string | null;
  // Campos flat (listagem)
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
  // Campos nested (detalhes)
  tracking?: {
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    utmTerm?: string | null;
    utmContent?: string | null;
    gclid?: string | null;
    fbclid?: string | null;
  };
  landingPage?: {
    id: string;
    name: string;
    slug: string;
    url?: string | null;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface LeadsResponse {
  leads: Lead[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface LeadDetailResponse {
  lead: Lead;
}

export interface UpdateLeadData {
  name?: string;
  email?: string;
  phone?: string | null;
  position?: string | null;
  dateOfBirth?: string | null;
  message?: string | null;
  tracking?: {
    utmSource?: string | null;
    utmMedium?: string | null;
    utmCampaign?: string | null;
    utmTerm?: string | null;
    utmContent?: string | null;
    gclid?: string | null;
    fbclid?: string | null;
  };
}

export interface LeadTracking {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
}
