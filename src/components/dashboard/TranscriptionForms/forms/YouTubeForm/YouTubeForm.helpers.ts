import { FORM_FIELD_NAMES } from '../../constants/formConstants'

export const getYouTubeDefaultValues = (url: string = '') => ({
  [FORM_FIELD_NAMES.URL]: url,
})
