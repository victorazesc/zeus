// Proposals
import { APIService } from "./api.service";
import { API_BASE_URL } from "@/helpers/common.helper";

export class ProposalService extends APIService {
  constructor() {
    super(API_BASE_URL);
  }

  async getProposals(): Promise<Proposal[]> {
    return this.get("/api/proposals/")
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }
  async createProposal(data: Partial<Proposal>): Promise<Proposal> {
    return this.post("/api/proposals/", data)
      .then((response) => {
        return response?.data;
      })
      .catch((error) => {
        throw error?.response;
      });
  }
}
