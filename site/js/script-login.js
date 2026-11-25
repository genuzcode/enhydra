import { FormUtils } from './form-utils.js';
import { sb } from './supabase.js';

// Página para onde o usuário vai depois de entrar. Ajuste se for outra.
const DESTINO_APOS_LOGIN = 'index.html';

function traduzirErroLogin(error) {
    if (error.code === 'invalid_credentials' || /invalid login credentials/i.test(error.message)) {
        return 'E-mail ou senha incorretos.';
    }
    if (error.code === 'email_not_confirmed' || /email not confirmed/i.test(error.message)) {
        return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
    }
    if (error.status === 429) {
        return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
    }
    return 'Não foi possível entrar. Tente novamente.';
}

// Basic Login Form
class BasicLoginForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.signup-link'],
            redirectTo: DESTINO_APOS_LOGIN,
            validators: {
                email: FormUtils.validateEmail,
                // No login só exigimos que a senha tenha sido digitada.
                password: FormUtils.validateRequired('A senha é obrigatória'),
            },
        });
    }

    decorate() {
        FormUtils.addEntranceAnimation(this.form.closest('.login-card'), 100);
    }

    async authenticate() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw new Error(traduzirErroLogin(error));
    }
}

new BasicLoginForm();
