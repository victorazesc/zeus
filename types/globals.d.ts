interface GsiButtonConfiguration {
    type?: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'small' | 'medium' | 'large';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string;
    locale?: string;
    click_listener?: () => void;
  }
  
  // Definição da inicialização do Google Accounts
  interface IdConfiguration {
    client_id: string;
    callback: (response: CredentialResponse) => void;
    auto_select?: boolean;
    login_uri?: string;
    native_callback?: (response: CredentialResponse) => void;
    cancel_on_tap_outside?: boolean;
    prompt_parent_id?: string;
    nonce?: string;
    context?: 'signin' | 'signup' | 'use';
    state_cookie_domain?: string;
    ux_mode?: 'popup' | 'redirect';
    allowed_parent_origin?: string | string[];
    intermediate_iframe_close_callback?: () => void;
  }
  
  // Definição da resposta de credencial
  interface CredentialResponse {
    credential: string;
    select_by: string;
    clientId: string;
  }
  
  // Definição da interface Google Accounts ID
  interface GoogleAccountsID {
    initialize: (config: IdConfiguration) => void;
    prompt: (momentListener?: (promptMomentNotification: PromptMomentNotification) => void) => void;
    renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;
    disableAutoSelect: () => void;
    storeCredential: (credential: { id: string; password: string }) => void;
    cancel: () => void;
    on: (eventName: string, callback: () => void) => void;
  }
  
  // Definição da notificação de momento do prompt
  interface PromptMomentNotification {
    isDisplayMoment: () => boolean;
    isDisplayed: () => boolean;
    isNotDisplayed: () => boolean;
    getNotDisplayedReason: () => string;
    isSkippedMoment: () => boolean;
    getSkippedReason: () => string;
    isDismissedMoment: () => boolean;
    getDismissedReason: () => string;
    getMomentType: () => string;
  }
  
  // Extensão da interface Window
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsID;
      };
    };
  }