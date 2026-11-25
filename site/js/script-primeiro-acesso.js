import { FormUtils } from './form-utils.js';
import { sb, urlDaPagina } from './supabase.js';

// Primeiro acesso: envia por e-mail um link que abre a página de definir senha.
class PrimeiroAcessoForm extends FormUtils.LoginFormBase {
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

        const { error } = await sb.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
                emailRedirectTo: urlDaPagina('definir-senha.html'),
            },
        });

        if (error) {
            throw new Error(
                error.status === 429
                    ? 'Aguarde cerca de 1 minuto antes de pedir outro link.'
                    : 'Não foi possível enviar o link. Tente novamente em instantes.'
            );
        }
    }
}

new PrimeiroAcessoForm();
