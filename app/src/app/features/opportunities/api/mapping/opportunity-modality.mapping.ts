import { WORK_MODALITIES } from '../../../../shared/constants/work-modality.constants';
import { WorkModality } from '../../../../shared/types/work-modality.type';

export const MODALITY_MAPPING: Record<string, WorkModality> = {
  REMOTE: WORK_MODALITIES.REMOTE.value,
  HYBRID: WORK_MODALITIES.HYBRID.value,
  ONSITE: WORK_MODALITIES.ONSITE.value,
};
