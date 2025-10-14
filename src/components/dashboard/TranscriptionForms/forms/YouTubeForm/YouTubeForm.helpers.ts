import { FORM_FIELD_NAMES } from '../../TasncriptionForms.constants'

export const getYouTubeDefaultValues = (url: string = '') => ({
  [FORM_FIELD_NAMES.URL]: url,
})
