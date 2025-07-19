import {
  OAuthProvider,
  PublicOAuthProvider,
} from "../../../lib/lemmy-js-client";

export const OAuthButtons: React.FC<{
  providers: PublicOAuthProvider[];
  onLogin: (provider: OAuthProvider) => void;
  label: string;
}> = ({providers, onLogin, label}) => {
  return (
    <>
      <hr className="my-6"/>
      <p className="text-center text-sm text-gray-600 mb-3">
        {label}
      </p>
      <div className="flex flex-col gap-3">
        {providers.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onLogin(p)}
            className="oauth-button py-2 px-4 border rounded-md flex justify-center items-center hover:bg-gray-100"
          >
            {p.displayName}
          </button>
        ))}
      </div>
    </>
  );
};
