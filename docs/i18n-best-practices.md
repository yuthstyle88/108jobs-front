# i18n Best Practices

This document outlines best practices for using internationalization (i18n) in the Fast Work Clone project.

## Current Translation Systems

The project currently uses two different translation systems:

1. **I18NextService**: Uses local translation files (en.ts, th.ts, vi.ts) with a single "translation" namespace.
2. **API-based translations**: Fetches translations from an API endpoint based on language and namespace, and stores them in the `useLanguageStore`.

To ensure consistent translation usage throughout the project, we recommend using `I18NextService` through the helper functions provided in `@/utils/i18nHelper.ts`.

## Helper Functions

### `getNamespace`

The `getNamespace` function returns a proxy object that provides translations for a specific namespace. This is the recommended approach for most components.

```typescript
import { getNamespace } from "@/utils/i18nHelper";
import { LanguageFile } from "@/constants/language";

// In your component
const authen = getNamespace(LanguageFile.AUTHEN);

// Use translations
<label>{authen.labelEmail}</label>
<input placeholder={authen.placeholderEmail} />
```

### `t`

The `t` function provides direct access to translations with namespace support. This is useful for one-off translations or when you need more control over the translation process.

```typescript
import { t } from "@/utils/i18nHelper";
import { LanguageFile } from "@/constants/language";

// Use translations
<label>{t(LanguageFile.AUTHEN, "labelEmail")}</label>
<input placeholder={t(LanguageFile.AUTHEN, "placeholderEmail")} />
```

## Best Practices

1. **Use helper functions**: Always use the helper functions from `@/utils/i18nHelper.ts` for translations.
2. **Avoid hardcoded text**: All user-facing text should be translatable.
3. **Use namespaces**: Organize translations by namespace using the `LanguageFile` enum.
4. **Consistent naming**: Use consistent naming for translation keys across different languages.
5. **Validation messages**: Use translations for validation error messages in Zod schemas.

## Example: Component with Translations

```typescript
"use client";
import { getNamespace } from "@/utils/i18nHelper";
import { LanguageFile } from "@/constants/language";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const LoginForm = () => {
  // Get translations for the authentication namespace
  const authen = getNamespace(LanguageFile.AUTHEN);

  // Create a validation schema with translated error messages
  const loginSchema = z.object({
    usernameOrEmail: z
      .string()
      .min(6, authen.pleaseEnterEmailOrUsernameMin6)
      .max(32, authen.usernameMax32),
    password: z.string().min(6, authen.passwordMin6),
  });

  // Set up the form with the validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Handle form submission
  const onSubmit = (data) => {
    // ...
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>{authen.labelUsernameOrEmail}</label>
        <input
          {...register("usernameOrEmail")}
          placeholder={authen.placeholderUsernameOrEmail}
        />
        {errors.usernameOrEmail && (
          <p>{errors.usernameOrEmail.message}</p>
        )}
      </div>

      <div>
        <label>{authen.labelPassword}</label>
        <input
          type="password"
          {...register("password")}
          placeholder={authen.placeholderPassword}
        />
        {errors.password && (
          <p>{errors.password.message}</p>
        )}
      </div>

      <button type="submit">{authen.buttonProceed}</button>
    </form>
  );
};
```

## Example: Handling Errors

For error messages, you can use the `t` function directly:

```typescript
import { t } from "@/utils/i18nHelper";
import { LanguageFile } from "@/constants/language";

// In your error handling code
try {
  // Some code that might throw an error
} catch (error) {
  setApiError(t(LanguageFile.ERROR, "fetchingSiteData"));
}
```

## Migration from Legacy Translation Methods

If you encounter components using legacy translation methods like `useTranslateFile`, update them to use the standardized approach with `getNamespace` or `t`. A migration script is available at `scripts/migrate-translations.sh` to help with this process.

## Ensuring Translation Keys Exist

To ensure that all translation keys used in components exist in the translation files, you should:

1. Check the translation files (en.ts, th.ts, vi.ts) to see if the keys exist.
2. If a key doesn't exist, add it to all translation files.
3. Use the same key naming convention across all files.

## Testing Translations

You can use the test script at `scripts/test-translations.js` to verify that translations work correctly. The script tests:

1. Direct I18NextService usage
2. getNamespace usage
3. Translations in different languages

Run the script with:

```bash
node scripts/test-translations.js
```