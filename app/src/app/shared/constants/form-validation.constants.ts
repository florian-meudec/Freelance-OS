import { ValidationErrors } from '@angular/forms';

export const VALIDATION_MESSAGES: Record<
  string,
  string | ((error: ValidationErrors[string]) => string)
> = {
  required: 'Ce champ est obligatoire.',

  blank: 'Ce champ ne peut pas contenir uniquement des espaces.',

  email: 'Adresse email invalide.',

  maxlength: (error) => `Maximum ${error.requiredLength} caractères.`,

  minlength: (error) => `Minimum ${error.requiredLength} caractères.`,

  min: (error) => `La valeur minimale est ${error.min}.`,

  max: (error) => `La valeur maximale est ${error.max}.`,

  invalidDuration: 'La durée et son unité doivent être renseignées ensemble.',

  duplicateTechnology: 'Cette technologie est déjà présente.',

  technologyTooLong: 'Une technologie ne peut dépasser 100 caractères.',

  emptyTechnology: 'Une technologie est vide.',
};
