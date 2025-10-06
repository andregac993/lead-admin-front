export interface LandingPage {
  id: string;
  name: string;
}

export interface LandingPagesResponse {
  landingPages: LandingPage[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}
