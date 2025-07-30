import {
  OAuthProvider,
  LoginResponse,
} from "lemmy-js-client";
import {HttpService, UserService} from "@/services";
import {setIsoData} from "@/utils/app";
import {LoginFormClass} from "@/components/Authentication/LoginForm";
import {toast} from "@/toast";
import {LoginProps} from "@/components/Authentication/LoginForm/interface";
import getQueryParams from "@/utils/helpers";
import {isSuccess, REQUEST_STATE} from "@/services/HttpService";

export const handleUseOAuthProvider = async (params: {
  oauthProvider: OAuthProvider;
  username?: string;
  prev?: string;
  answer?: string;
  showNsfw?: boolean;
}) => {
  const redirectUri = `${window.location.origin}/api/auth/callback/${params.oauthProvider.displayName}`;
  const state = crypto.randomUUID();
  const requestUri =
    params.oauthProvider.authorizationEndpoint +
    "?" +
    [
      `client_id=${encodeURIComponent(params.oauthProvider.clientId)}`,
      `response_type=code`,
      `scope=${encodeURIComponent(params.oauthProvider.scopes)}`,
      `redirect_uri=${encodeURIComponent(redirectUri)}`,
      `state=${state}`,
    ].join("&");
  console.log(requestUri);

  localStorage.setItem(
    "oauthState",
    JSON.stringify({
      state,
      oauthProviderId: params.oauthProvider.id,
      redirectUri: redirectUri,
      prev: params.prev ?? "/",
      username: params.username,
      answer:  "FastJob",
      expiresAt: Date.now() + 5 * 60_000,
    }),
  );

  window.location.assign(requestUri);
};

export const handleLogin = async (i: LoginFormClass, data: any) => {
  const {usernameOrEmail, password} = data;
  i.setState(prev => ({
    form: {
      ...prev.form,
      usernameOrEmail,
      password,
    }
  }));
  console.log(i.state.form);
  try {
    const loginRes = await HttpService.client.login({
      usernameOrEmail,
      password,
      totp2faToken: i.state.form.totp2faToken || undefined,
    });

    switch (loginRes.state) {
      case REQUEST_STATE.FAILED: {
        const {name, message} = loginRes.err ?? {};
        if (name === "missing_totp_token") {
          // Trigger modal to ask for TOTP token
          i.setState({show2faModal: true});
        } else {
          i.props.formMethods.setError("password", {
            type: "manual",
            message: i.props.t("invalidPassword"),
          });
        }
        i.setState({loginRes});
        break;
      }
      case REQUEST_STATE.SUCCESS: {
        await handleLoginSuccess(i, loginRes.data);
        break;
      }
    }
  } catch (error) {
    console.error(error);
    i.props.formMethods.setError("root", {
      type: "manual",
      message: i.props.t("systemError"),
    });
  }
};

export async function handleLoginSuccess(i: LoginFormClass, loginRes: LoginResponse) {
  UserService.Instance.login({
    res: loginRes,
  });

  const site = await HttpService.client.getSite();

  if (isSuccess(site)) {
    try {
      const isoData = setIsoData(i.context);
      if (isoData && isoData.siteRes) {
        isoData.siteRes.oauthProviders = site.data.oauthProviders;
        isoData.siteRes.adminOauthProviders = site.data.adminOauthProviders;
      }
    } catch (error) {
      console.error("Error updating isoData:", error);
    }
  }

  // ใช้ redirectUrl จาก props แทน prev
  const {redirectUrl} = i.props;

  // ใช้ router จาก props แทน history
  if (redirectUrl) {
    i.props.router.replace(redirectUrl);
  } else {
    i.props.router.replace("/");
  }
}

export async function handleSubmitTotp(i: LoginFormClass, totp: string) {
  const {usernameOrEmail, password} = i.state.form;

  i.setState(prev => ({
    form: {
      ...prev.form,
      totp2faToken: totp,
    },
  }));

  const loginRes = await HttpService.client.login({
    usernameOrEmail,
    password,
    totp2faToken: totp,
  });

  const successful = isSuccess(loginRes);
  if (successful) {
    i.setState({show2faModal: false});
    await handleLoginSuccess(i, loginRes.data);
  } else {
    toast("incorrectTotpCode");
  }

  return successful;
}

export function getLoginQueryParams(source?: string): LoginProps {
  return getQueryParams<LoginProps>(
    {
      prev: (param?: string) => param,
    },
    source,
  );
}