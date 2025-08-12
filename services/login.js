export class LoginService {
  constructor(sdk) {
    this.sdk = sdk;
  }

  async login(username, password, namespace) {
    this.sdk.validateParams(
      { username, password },
      {
        username: { type: 'string', required: true },
        password: { type: 'string', required: true },
        namespace: { type: 'string', required: false },
      },
    );

    const options = {
      body: { username, password, tokenType: 'cookie', namespace },
    };

    const login = await this.sdk._fetch('/login', 'POST', options, true);

    if (typeof window !== 'undefined') {
      const canUseLocalStorage = typeof localStorage !== 'undefined';
      if (login?.namespace && canUseLocalStorage) {
        localStorage.setItem('unbound_url', login.url);
        localStorage.setItem('unbound_userId', login.userId);
        localStorage.setItem('unbound_namespace', login.namespace);
      }
    }

    return {
      valid: true,
      userId: login.userId,
      namespace: login.namespace,
      url: login.url,
    };
  }

  async logout() {
    const logout = await this.sdk._fetch('/login', 'DELETE', {}, true);

    if (typeof window !== 'undefined') {
      const canUseLocalStorage = typeof localStorage !== 'undefined';
      if (canUseLocalStorage) {
        localStorage.removeItem('unbound_url');
        localStorage.removeItem('unbound_userId');
        localStorage.removeItem('unbound_namespace');
      }
    }

    return true;
  }

  async validate() {
    const options = {};
    const validation = await this.sdk._fetch('/login/validate', 'POST', options, true);
    return validation;
  }

  async changePassword(currentPassword, newPassword) {
    this.sdk.validateParams(
      { currentPassword, newPassword },
      {
        currentPassword: { type: 'string', required: true },
        newPassword: { type: 'string', required: true },
      },
    );

    const options = {
      body: { currentPassword, newPassword },
    };

    const result = await this.sdk._fetch('/login/changePassword', 'POST', options);
    return result;
  }
}