import {OAuthProvider, PublicOAuthProvider,} from "lemmy-js-client";

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
                        className="oauth-button relative py-3 px-6 border border-gray-300 rounded-lg flex justify-center items-center text-gray-800 font-medium text-sm bg-white shadow-sm hover:shadow-md hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                    >
                      <span className="flex items-center space-x-2">
                          <span>{p.displayName}</span>
                      </span>
                    </button>
                ))}
            </div>
        </>
    );
};
