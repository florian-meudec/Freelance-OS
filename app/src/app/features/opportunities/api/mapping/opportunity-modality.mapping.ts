import { WORK_MODALITIES } from '../../../../shared/constants/work-modality.constants';
import { WorkModality } from '../../../../shared/types/work-modality.type';

export const MODALITY_MAPPING: Record<string, WorkModality> = {
  remote: WORK_MODALITIES.REMOTE.value,
  hybrid: WORK_MODALITIES.HYBRID.value,
  onsite: WORK_MODALITIES.ONSITE.value,
};
