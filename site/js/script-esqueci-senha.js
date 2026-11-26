import { FormUtils } from './form-utils.js';
import { sb, urlDaPagina } from './supabase.js';

// Esqueci a senha: envia por e-mail um link que abre a página de definir senha.
// O Supabase responde com sucesso mesmo se o e-mail não existir, então a tela
// nunca revela quais e-mails têm conta.
class EsqueciSenhaForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            validators: { email: FormUtils.validateEmail },
        });
    }

    decorate() {
        FormUtils.addEntranceAnimation(this.form.closest('.login-card'), 100);
    }

    async authenticate() {
        const email = document.getElementById('email').value.trim();

        const { error } = await sb.auth.resetPasswordForEmail(email, {
            redirectTo: urlDaPagina('definir-senha.html'),
        });

        const limite = error.status === 429 || /rate_limit/.test(error.code || '');
        throw new Error(
            limite
                ? 'Muitos pedidos de e-mail. Aguarde um pouco antes de tentar de novo.'
                : 'Não foi possível enviar o link. Tente novamente em instantes.'
        );
    }
}

new EsqueciSenhaForm();
