# i18n Findings and Recommendations

## Current State of i18n Usage

After a thorough analysis of the project's internationalization (i18n) implementation, here are the key findings:

### Translation Systems

The project currently uses two different translation systems:

1. **I18NextService**: Uses local translation files (en.ts, th.ts, vi.ts) with a single "translation" namespace.
2. **API-based translations**: Fetches translations from an API endpoint based on language and namespace, and stores them in the `useLanguageStore`.

This dual system creates potential inconsistencies in how translations are managed and accessed throughout the project.

### Translation Access Methods

The project uses several methods to access translations:

1. **useTranslateFile**: A legacy hook that retrieves translations from the `useLanguageStore`, which is populated by API calls.
2. **useGlobalTranslate**: A hook that fetches translations from an API endpoint and stores them in the `useLanguageStore`.
3. **getNamespace**: A helper function that uses `I18NextService` to access translations from local files.
4. **t**: A helper function that provides direct access to translations with namespace support using `I18NextService`.

### Migration Status

Some components have been migrated from `useTranslateFile` to `getNamespace`, but others still use the legacy hook. This creates inconsistency in how translations are accessed across the project.

### Hardcoded Text

Several components contain hardcoded text, particularly in Thai, that should be moved to translation files. This includes:

1. Error messages
2. Form labels and placeholders
3. Button text
4. Informational text

A comprehensive list of hardcoded text that needs to be translated is available in `docs/hardcoded-text-fixes.md`.

### Validation Messages

Most components are using translations for validation error messages through the `authen` object obtained from either `useTranslateFile` or `getNamespace`. This is a good practice that should be continued.

## Recommendations

Based on the findings, here are the recommendations for improving i18n usage in the project:

### 1. Standardize on a Single Translation System

Choose one translation system and migrate all components to use it. The recommended approach is to use `I18NextService` through the helper functions provided in `@/utils/i18nHelper.ts`.

#### Option A: Use I18NextService with Local Files

If you choose to use `I18NextService` with local files:

1. Ensure all translation keys used in components exist in the local translation files (en.ts, th.ts, vi.ts).
2. Update the `i18nHelper.ts` file to handle namespaces correctly.
3. Migrate all components to use `getNamespace` or `t` from `i18nHelper.ts`.

#### Option B: Use API-based Translations

If you choose to use API-based translations:

1. Update the `i18nHelper.ts` file to use the `useLanguageStore` instead of `I18NextService`.
2. Ensure all components use `getNamespace` or `t` from `i18nHelper.ts`.

### 2. Fix Hardcoded Text

1. Move all hardcoded text to translation files.
2. Update components to use translations instead of hardcoded text.
3. Follow the recommendations in `docs/hardcoded-text-fixes.md`.

### 3. Update the Migration Script

Update the `scripts/migrate-translations.sh` script to handle more complex cases and edge cases that the current script might miss.

### 4. Fix the Test Script

Fix the `scripts/test-translations.js` script to correctly import the `I18NextService` module. This will allow you to verify that translations work correctly.

### 5. Document the Chosen Approach

Update the documentation to reflect the chosen approach and provide examples of correct usage. The `docs/i18n-best-practices.md` file can serve as a starting point.

### 6. Implement a Translation Key Verification System

Implement a system to verify that all translation keys used in components exist in the translation files. This could be a script that:

1. Scans all components for translation key usage.
2. Checks if the keys exist in the translation files.
3. Reports any missing keys.

### 7. Consider Using a Translation Management System

Consider using a translation management system to manage translations more effectively. This could help with:

1. Keeping translations in sync across different languages.
2. Tracking missing translations.
3. Providing a user-friendly interface for translators.

## Conclusion

The project has made progress in standardizing i18n usage, but there's still work to be done to ensure consistency and completeness. By following the recommendations above, the project can achieve a more robust and maintainable i18n implementation.

## Next Steps

1. Choose a translation system (Option A or Option B).
2. Complete the migration of all components to use the chosen system.
3. Fix hardcoded text.
4. Update the documentation.
5. Implement a translation key verification system.

By addressing these issues, the project will have a more consistent and maintainable approach to internationalization, making it easier to add new languages and update existing translations in the future.