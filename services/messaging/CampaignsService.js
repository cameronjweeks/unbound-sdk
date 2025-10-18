import { TollFreeCampaignsService } from './TollFreeCampaignsService.js';
import { TenDlcCampaignsService } from './TenDlcCampaignsService.js';

export class CampaignsService {
  constructor(sdk) {
    this.sdk = sdk;
    this.tollFree = new TollFreeCampaignsService(sdk);
    this.tenDlc = new TenDlcCampaignsService(sdk);
  }
}
