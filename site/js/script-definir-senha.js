import { FormUtils } from './form-utils.js';
import { sb } from './supabase.js';

// Página para onde o usuário vai depois de salvar a senha. Ajuste se for outra.
const DESTINO_APOS_SENHA = 'index.html';

function traduzirErroSenha(error) {
    if (error.code === 'same_password') {
        return 'Escolha uma senha diferente da anterior.';
    }
    if (error.code === 'weak_password') {
        return 'Senha fraca. Use ao menos 8 caracteres com letras e números.';
    }
    if (error.status === 401 || error.code === 'session_not_found' || /session/i.test(error.message)) {
        return 'Link inválido ou expirado. Peça um novo em "Esqueci a senha".';
    }
    return 'Não foi possível salvar a senha. Tente novamente.';
}

// Definir senha: a pessoa chega aqui pelo link do e-mail, que já a deixa
// "logada" com uma sessão temporária; basta chamar updateUser.
class DefinirSenhaForm extends FormUtils.LoginFormBase {
    constructor() {
        super({
            hideOnSuccess: ['.signup-link'],
            redirectTo: DESTINO_APOS_SENHA,
            validators: {
                password: FormUtils.validatePassword,
                confirmPassword: (value) =>
                    value === document.getElementById('password').value
                        ? { isValid: true }
                        : { isValid: false, message: 'As senhas não coincidem' },
            },
        });
        if (this.form) this.verificarLink();
    }

    decorate() {
        FormUtils.addEntranceAnimation(this.form.closest('.login-card'), 100);
    }

    // O supabase-js lê o link da URL sozinho; getSession espera esse processo.
    // Sem sessão, o link é inválido/expirado (ou a página foi aberta direto).
    async verificarLink() {
        const { data: { session } } = await sb.auth.getSession();
        if (session) return;

        this.submitBtn?.setAttribute('disabled', '');
        FormUtils.showNotification(
            'Link inválido ou expirado. Peça um novo abaixo.',
            'error',
            this.form
        );
    }

    async authenticate() {
        const password = document.getElementById('password').value;

        const { error } = await sb.auth.updateUser({ password });
        if (error) throw new Error(traduzirErroSenha(error));
    }
}

new DefinirSenhaForm();
